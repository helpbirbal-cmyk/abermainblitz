// src/hooks/use-permissions.ts
'use client';

import { useTenant } from '@/lib/supabase/tenant-context';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

export type UserRole = 'owner' | 'admin' | 'manager' | 'member';

export interface Permission {
  key: string;
  granted: boolean;
  description: string;
}

export interface OrganizationMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export function usePermissions() {
  const { organization } = useTenant();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!organization) {
      setUserRole(null);
      setPermissions(new Set());
      setIsLoading(false);
      return;
    }

    loadUserRoleAndPermissions();
  }, [organization]);

  const loadUserRoleAndPermissions = async () => {
    try {
      const supabase = createClient();

      // Get user's role in current organization
      const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', organization!.id) // Use non-null assertion since we checked organization exists
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (memberError || !memberData) {
        console.error('Error loading user role:', memberError);
        return;
      }

      setUserRole(memberData.role);

      // Load permissions for this role
      const { data: permissionData, error: permissionError } = await supabase
        .from('organization_permissions')
        .select('permission_key')
        .eq('organization_id', organization!.id) // Use non-null assertion
        .eq('role', memberData.role)
        .eq('granted', true);

      if (!permissionError && permissionData) {
        const permissionKeys = new Set(permissionData.map(p => p.permission_key));
        setPermissions(permissionKeys);
      }

    } catch (error) {
      console.error('Error loading permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permissionKey: string): boolean => {
    return permissions.has(permissionKey);
  };

  const canManageUsers = hasPermission('manage_users') || hasPermission('invite_users');
  const canManageOrganization = hasPermission('manage_organization');
  const canManageCustomers = hasPermission('manage_customers');
  const canViewAnalytics = hasPermission('view_analytics');

  return {
    userRole,
    permissions,
    hasPermission,
    canManageUsers,
    canManageOrganization,
    canManageCustomers,
    canViewAnalytics,
    isLoading
  };
}
