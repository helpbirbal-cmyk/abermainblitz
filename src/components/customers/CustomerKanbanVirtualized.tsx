// src/components/customers/CustomerKanbanVirtualized.tsx

'use client';

import { VirtuosoGrid } from 'react-virtuoso';
import type { Customer, OrgMemberProfile } from '@/types';
import { CustomerCard } from '@/components/customers/CustomerCard';
import { useRef } from 'react';

interface CustomerKanbanVirtualizedProps {
    customers: Customer[];
    orgMembers: OrgMemberProfile[];
    onAssign: (customerId: string, memberId: string) => Promise<void>;
    onRefreshCustomers: () => Promise<void>;
    onOpenDetails: (customer: Customer) => void;
}

export function CustomerKanbanVirtualized({
                                              customers,
                                              orgMembers,
                                              onAssign,
                                              onRefreshCustomers,
                                              onOpenDetails,
                                          }: CustomerKanbanVirtualizedProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={parentRef} className="h-full w-full overflow-auto">
            <VirtuosoGrid
                totalCount={customers.length}
                overscan={200}
                style={{ height: '100%' }} // fill parent height
                listClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2"
                itemContent={(index) => {
                    const customer = customers[index];
                    return (
                        <CustomerCard
                            key={customer.id}
                            customer={customer}
                            orgMembers={orgMembers}
                            onAssign={onAssign}
                            onRefreshCustomers={onRefreshCustomers}
                            onOpenDetails={() => onOpenDetails(customer)}
                        />
                    );
                }}
            />
        </div>
    );
}
