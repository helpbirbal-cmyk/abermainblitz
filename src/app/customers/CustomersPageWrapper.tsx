// src/app/customers/CustomersPageWrapper.tsx
'use client';

import { TenantProvider } from '@/lib/supabase/tenant-context';
import { CustomersClient } from './CustomersClient';

export default function CustomersPageWrapper() {
    return (
        <TenantProvider>
            <CustomersClient />
        </TenantProvider>
    );
}
