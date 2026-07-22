// src/components/common/OrganizationSwitcher.tsx
'use client';

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTenant } from '@/lib/supabase/tenant-context';
import { useState, useEffect } from 'react';

export const OrganizationSwitcher = () => {
  const { organization, organizations, switchOrganization } = useTenant();
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>('');

  useEffect(() => {
    if (organization?.id && organization.id !== selectedOrganizationId) {
      setSelectedOrganizationId(organization.id);
    }
  }, [organization]);

  const handleChange = (newOrgId: string) => {
    if (newOrgId && newOrgId !== "") {
      setSelectedOrganizationId(newOrgId);
      if (switchOrganization) {
        switchOrganization(newOrgId);
      }
    }
  };

  if (!organizations || organizations.length === 0) {
    return null;
  }

  return (
    <FormControl sx={{ minWidth: 200 }} size="small">
      <InputLabel>Organization</InputLabel>
      <Select
        value={selectedOrganizationId || ""}
        label="Organization"
        onChange={(e) => handleChange(e.target.value)}
      >
        {organizations.map((org) => (
          <MenuItem key={org.id} value={org.id}>
            {org.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
