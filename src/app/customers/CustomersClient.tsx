// src/app/customers/CustomersClient.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTenant } from '@/lib/supabase/tenant-context';
import { createClient } from '@/lib/supabase/client';
import type { Customer, OrgMemberProfile } from '@/types';

import { CustomersHeader } from '@/components/customers/CustomersHeader';
import { CustomerListView } from '@/components/customers/CustomerListView';
import { CustomerDetailsDialog } from '@/components/customers/CustomerDetailsDialog';
import { AddCustomerDialog } from '@/components/customers/AddCustomerDialog';
import { CustomerImportDialog } from '@/components/customers/CustomerImportDialog';
import { CustomerKanbanVirtualized } from '@/components/customers/CustomerKanbanVirtualized'; // ✅ new grid

const PAGE_SIZE = 20;

export function CustomersClient() {
    const { organization, isLoading } = useTenant();
    const supabase = createClient();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [orgMembers, setOrgMembers] = useState<OrgMemberProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const [activeTab, setActiveTab] = useState(0); // 0 = Kanban, 1 = List
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const [addCustomerOpen, setAddCustomerOpen] = useState(false);
    const [showImportWizard, setShowImportWizard] = useState(false);

    const orgToUse = organization?.id;

    // Progressive loading
    const loadCustomers = useCallback(
        async (pageIndex: number) => {
            if (!orgToUse) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('customers')
                    .select(`
            *,
            assigned_member:organization_members_with_profiles!customers_assigned_to_fkey (
              id,
              user_id,
              full_name,
              email,
              role
            )
          `)
                    .eq('organization_id', orgToUse)
                    .order('created_at', { ascending: false })
                    .range(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE - 1);

                if (error) {
                    console.error('Error fetching customers:', error);
                    setHasMore(false);
                    return;
                }

                if (data && data.length > 0) {
                    setCustomers((prev) => [...prev, ...data]);
                    setHasMore(data.length === PAGE_SIZE);
                } else {
                    setHasMore(false);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        },
        [orgToUse, supabase]
    );

    const loadOrgMembers = async () => {
        if (!orgToUse) return;
        try {
            const { data, error } = await supabase
                .from('organization_members_with_profiles')
                .select('*')
                .eq('organization_id', orgToUse)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error loading members:', error);
                setOrgMembers([]);
                return;
            }
            setOrgMembers((data || []) as OrgMemberProfile[]);
        } catch (err) {
            console.error('Unexpected error loading org members:', err);
            setOrgMembers([]);
        }
    };

    // Patch in place
    const handleAssignCustomer = async (customerId: string, memberId: string) => {
        if (!orgToUse) return;
        try {
            const { data, error } = await supabase
                .from('customers')
                .update({ assigned_to: memberId || null })
                .eq('id', customerId)
                .eq('organization_id', orgToUse)
                .select(`
          *,
          assigned_member:organization_members_with_profiles!customers_assigned_to_fkey (
            id,
            user_id,
            full_name,
            email,
            role
          )
        `);

            if (error) {
                console.error('Error assigning customer:', error);
                return;
            }

            if (data && data.length > 0) {
                const updatedCustomer = data[0];
                setCustomers((prev) =>
                    prev.map((cust) =>
                        cust.id === updatedCustomer.id ? updatedCustomer : cust
                    )
                );
            }
        } catch (e) {
            console.error('Unexpected error assigning customer:', e);
        }
    };

    useEffect(() => {
        if (!isLoading && orgToUse) {
            setCustomers([]);
            setPage(0);
            void loadCustomers(0);
            void loadOrgMembers();
        }
    }, [isLoading, orgToUse, loadCustomers]);

    // Infinite scroll handler
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            void loadCustomers(nextPage);
        }
    };

    return (
        <Box onScroll={handleScroll} sx={{ height: 'calc(100vh - 120px)', overflow: 'auto' }}>
            <CustomersHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onExport={(format) => console.log('Export', format)}
                onAddCustomer={() => setAddCustomerOpen(true)}
                onImportCSV={() => setShowImportWizard(true)}
            />

            {loading && customers.length === 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && customers.length === 0 && (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    No customers found.
                </Typography>
            )}

            {customers.length > 0 && (
                <>
                    {activeTab === 0 && (
                        <CustomerKanbanVirtualized
                            customers={customers}
                            orgMembers={orgMembers}
                            onAssign={handleAssignCustomer}
                            onRefreshCustomers={() => loadCustomers(0)}
                            onOpenDetails={(customer) => {
                                setSelectedCustomer(customer);
                                setDetailsOpen(true);
                            }}
                        />
                    )}

                    {activeTab === 1 && (
                        <CustomerListView
                            customers={customers}
                            selectedCustomers={new Set()}
                            onCustomerSelect={() => {}}
                            onSelectAll={() => {}}
                            onInteractionClick={(customer) => {
                                setSelectedCustomer(customer);
                                setDetailsOpen(true);
                            }}
                            onDetailsClick={(customer) => {
                                setSelectedCustomer(customer);
                                setDetailsOpen(true);
                            }}
                            onAssignClick={(customer) => {
                                setSelectedCustomer(customer);
                                setDetailsOpen(true);
                            }}
                            orgMembers={orgMembers}
                        />
                    )}
                </>
            )}

            {selectedCustomer && (
                <CustomerDetailsDialog
                    open={detailsOpen}
                    onClose={() => setDetailsOpen(false)}
                    customer={selectedCustomer}
                    onRefreshCustomers={() => loadCustomers(0)}
                    onAssign={handleAssignCustomer}
                    orgMembers={orgMembers}
                    orgId={orgToUse!}
                />
            )}

            <AddCustomerDialog
                open={addCustomerOpen}
                onClose={() => setAddCustomerOpen(false)}
                organizationId={orgToUse!}
                onCustomerAdded={() => loadCustomers(0)}
            />

            <CustomerImportDialog
                open={showImportWizard}
                onClose={() => setShowImportWizard(false)}
                organizationId={orgToUse!}
                onImport={() => loadCustomers(0)}
            />
        </Box>
    );
}
