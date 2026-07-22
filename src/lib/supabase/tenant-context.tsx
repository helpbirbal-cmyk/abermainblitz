// lib/supabase/tenant-context.tsx
'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Organization {
  id: string;
  name: string;
  slug: string;
  plan_type: string;
  created_at: string;
  updated_at: string;
  trial_ends_at: string | null;
  is_active: boolean;
  activation_code: string | null;
  plan_expires_at: string | null;
}

interface TenantContextType {
  organization: Organization | null;
  organizations: Organization[];
  isLoading: boolean;
  user: any;
  switchOrganization: (orgId: string) => Promise<void>;
  refreshOrganizations: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  const router = useRouter();
  const supabase = createClient();

  // Track last processed session user id to avoid redundant reloads
  const lastUserIdRef = useRef<string | null>(null);
  const loadOrganizationsTimerRef = useRef<number | null>(null);

  const clearDebounce = () => {
    if (loadOrganizationsTimerRef.current) {
      window.clearTimeout(loadOrganizationsTimerRef.current);
      loadOrganizationsTimerRef.current = null;
    }
  };

  const loadOrganizations = useCallback(async () => {
    if (typeof window === 'undefined') {
      // SSR safeguard
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        setUser(null);
        setOrganizations([]);
        setOrganization(null);
        return;
      }

      if (!session) {
        // Not signed in
        setUser(null);
        setOrganizations([]);
        setOrganization(null);
        return;
      }

      // Authenticated
      setUser(session.user);
      lastUserIdRef.current = session.user.id;

      const { data: organizationsData, error } = await supabase
        .from('organizations')
        .select(`
          *,
          organization_members!inner(user_id)
        `)
        .eq('organization_members.user_id', session.user.id)
        .order('name');

      if (error) {
        console.error('❌ Organizations query error:', error);
        // Fallback: try plain organizations
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('organizations')
          .select('*')
          .order('name');

        if (fallbackError) {
          console.error('❌ Fallback organizations query failed:', fallbackError);
          setOrganizations([]);
          setOrganization(null);
          return;
        }

        setOrganizations(fallbackData || []);
      } else {
        const list: Organization[] = (organizationsData ?? []).map((org: any) => ({
          id: org.id,
          name: org.name,
          slug: org.slug,
          plan_type: org.plan_type,
          created_at: org.created_at || new Date().toISOString(),
          updated_at: org.updated_at || new Date().toISOString(),
          trial_ends_at: org.trial_ends_at || null,
          is_active: typeof org.is_active === 'boolean' ? org.is_active : true,
          activation_code: org.activation_code || null,
          plan_expires_at: org.plan_expires_at || null,
        }));
        setOrganizations(list);
      }

      // Select current organization deterministically
      const savedOrgId = typeof window !== 'undefined' ? localStorage.getItem('current_organization') : null;
      const nextOrg =
        (savedOrgId && (organizationsData ?? []).find((o: any) => o.id === savedOrgId)) ||
        (organizationsData && organizationsData[0]) ||
        null;

      setOrganization(prev => {
        const next = nextOrg
          ? {
              id: nextOrg.id,
              name: nextOrg.name,
              slug: nextOrg.slug,
              plan_type: nextOrg.plan_type,
              created_at: nextOrg.created_at || new Date().toISOString(),
              updated_at: nextOrg.updated_at || new Date().toISOString(),
              trial_ends_at: nextOrg.trial_ends_at || null,
              is_active: typeof nextOrg.is_active === 'boolean' ? nextOrg.is_active : true,
              activation_code: nextOrg.activation_code || null,
              plan_expires_at: nextOrg.plan_expires_at || null,
            }
          : null;

        if (next && next.id !== prev?.id) {
          localStorage.setItem('current_organization', next.id);
        }
        return next ?? prev ?? null;
      });
    } catch (e) {
      console.error('❌ CATCH - loadOrganizations error:', e);
      setUser(null);
      setOrganizations([]);
      setOrganization(null);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const debouncedLoadOrganizations = useCallback(() => {
    clearDebounce();
    loadOrganizationsTimerRef.current = window.setTimeout(() => {
      loadOrganizations();
    }, 300);
  }, [loadOrganizations]);

  // Mounted flag
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Initial load after mount
  useEffect(() => {
    if (!hasMounted) return;
    debouncedLoadOrganizations();
    return clearDebounce;
  }, [hasMounted, debouncedLoadOrganizations]);

  // Auth state listener with guards to prevent reload loops
  useEffect(() => {
    if (!hasMounted) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state change:', event);

      // Normalize session user id
      const newUserId = session?.user?.id ?? null;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setOrganizations([]);
        setOrganization(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('current_organization');
        }
        return;
      }

      if (event === 'SIGNED_IN' && newUserId) {
        // Only reload when the user actually changes or we have no data
        const shouldReload =
          lastUserIdRef.current !== newUserId ||
          organizations.length === 0;

        if (shouldReload) {
          lastUserIdRef.current = newUserId;
          debouncedLoadOrganizations();
        } else {
          // Avoid redundant reloads
          console.log('ℹ️ SIGNED_IN ignored (same user & orgs already loaded)');
        }
        return;
      }

      if (event === 'TOKEN_REFRESHED' && newUserId) {
        // Token refresh can affect RLS; refresh orgs but debounce
        debouncedLoadOrganizations();
        return;
      }

      if (event === 'USER_UPDATED') {
        setUser(session?.user || null);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearDebounce();
    };
  }, [hasMounted, supabase.auth, debouncedLoadOrganizations, organizations.length]);

  // Switch organization
  const switchOrganization = async (orgId: string) => {
    if (!hasMounted) return;
    if (!orgId) return;

    const org = organizations.find(o => o.id === orgId) || null;
    if (org) {
      setOrganization(org);
      localStorage.setItem('current_organization', orgId);
      // Light refresh to propagate selection to server components if any
      setTimeout(() => router.refresh(), 100);
    }
  };

  const refreshOrganizations = async () => {
    if (!hasMounted) return;
    await loadOrganizations();
  };

  const contextValue: TenantContextType = {
    organization,
    organizations,
    isLoading,
    user,
    switchOrganization,
    refreshOrganizations,
  };

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
