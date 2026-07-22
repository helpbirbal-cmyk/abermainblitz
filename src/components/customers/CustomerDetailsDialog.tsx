// src/components/customers/CustomerDetailsDialog.tsx
// src/components/customers/CustomerDetailsDialog.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Chip, Divider, LinearProgress,
    Box, Tabs, Tab, TextField, Card, CardHeader, CardContent
} from '@mui/material';
import {
    Business as BusinessIcon,
    Timeline as TimelineIcon,
    History as HistoryIcon,
    AssignmentInd as AssignmentIcon
} from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import type { Customer, Brief, OrgMemberProfile } from '@/types';
import { CustomerOpportunitiesPanel } from '@/components/customers/CustomerOpportunitiesPanel';
import { LeadBriefPanel } from '@/components/leads/LeadBriefPanel';
import { fetchBrief } from '@/lib/fetchBrief';
import { createClient } from '@/lib/supabase/client';
import { CustomerAssignmentMenu } from '@/components/customers/CustomerAssignmentMenu';

type Props = {
    open: boolean;
    onClose: () => void;
    customer: Customer;
    onRefreshCustomers: () => void;
    onAssign: (customerId: string, userId: string) => void;
    orgMembers: OrgMemberProfile[]; // ✅ view-based type
    orgId: string;
};

export function CustomerDetailsDialog({
                                          open,
                                          onClose,
                                          customer,
                                          orgMembers = [],
                                          onAssign,
                                          orgId,
                                          onRefreshCustomers
                                      }: Props) {
    const [tab, setTab] = useState(0);
    const [localCustomer, setLocalCustomer] = useState<Customer | null>(customer);
    const [brief, setBrief] = useState<Brief | null>(null);
    const [updatedAt, setUpdatedAt] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [interactions, setInteractions] = useState<any[]>([]);
    const supabase = createClient();

    const [assignAnchorEl, setAssignAnchorEl] = useState<HTMLElement | null>(null);

    const handleOpenAssignMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAssignAnchorEl(event.currentTarget);
    };
    const handleCloseAssignMenu = () => {
        setAssignAnchorEl(null);
    };

    console.log('Assigned_to:', localCustomer?.assigned_to);
    console.log('OrgMembers in dialog:', orgMembers);
    console.log(
        'Matched member:',
        orgMembers.find(m => m.user_id === localCustomer?.assigned_to)
    );

    useEffect(() => {
        setLocalCustomer(customer);

        if (open && customer?.id) {
            void loadBrief();
            void loadInteractions(customer.id);
        } else {
            setBrief(null);
            setUpdatedAt(null);
            setError(null);
            setLoading(false);
            setInteractions([]);
        }
    }, [open, customer?.id]);

    const loadBrief = async (force = false) => {
        if (!customer?.id) return;
        setLoading(true);
        setError(null);
        try {
            const { brief, updated_at } = await fetchBrief(customer.id, force);
            setBrief(brief);
            setUpdatedAt(updated_at ?? null);
        } catch (err: any) {
            setError(err?.message ?? 'Failed to load brief');
            setBrief(null);
            setUpdatedAt(null);
        } finally {
            setLoading(false);
        }
    };

    const loadInteractions = async (custId: string) => {
        const { data, error } = await supabase
            .from('interaction_with_creator')
            .select(`
        id,
        organization_id,
        related_to_type,
        related_to_id,
        interaction_type,
        subject,
        description,
        outcome,
        scheduled_at,
        completed_at,
        duration_minutes,
        assigned_to,
        created_by,
        created_at,
        updated_at,
        creator_email,
        creator_name
      `)
            .eq('related_to_type', 'customer')
            .eq('related_to_id', custId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching interactions:', error);
            setInteractions([]);
            return;
        }
        setInteractions(data ?? []);
    };

    const formattedDate = (d?: string | null) => (d ? new Date(d).toLocaleString() : 'Unknown');

    const handleAddOpportunity = async (customerId: string) => {
        if (!orgId) return;
        try {
            await supabase.from('opportunities').insert({
                customer_id: customerId,
                organization_id: orgId,
                name: 'New Opportunity',
                stage: 'prospect',
                created_at: new Date().toISOString(),
            });
            onRefreshCustomers?.();
        } catch (err) {
            console.error('Failed to add opportunity', err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Customer details</Typography>
                    <Chip label={customer?.status ?? 'Unknown'} color="primary" variant="outlined" />
                </Box>
            </DialogTitle>

            <DialogContent>
                <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ mb: 2 }}>
                    <Tab label="Details" />
                    <Tab label="Opportunities" />
                    <Tab label="Brief" />
                </Tabs>

                {tab === 0 && localCustomer && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Basic Info */}
                        <Card sx={{ borderRadius: 2 }}>
                            <CardHeader avatar={<BusinessIcon />} title="Basic information" />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField label="Name" fullWidth size="small" value={localCustomer.name || ''} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField label="Company" fullWidth size="small" value={localCustomer.company || ''} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField label="Email" fullWidth size="small" value={localCustomer.email || ''} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField label="Phone" fullWidth size="small" value={localCustomer.phone || ''} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField label="Industry" fullWidth size="small" value={localCustomer.industry || ''} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField label="Type" fullWidth size="small" value={localCustomer.customer_type || ''} />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Assignment */}
                        <Card sx={{ borderRadius: 2 }}>
                            <CardHeader avatar={<AssignmentIcon />} title="Assignment" />
                            <Divider />
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>


                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleOpenAssignMenu}
                                    >
                                        {localCustomer?.assigned_to
                                            ? `Assigned to ${
                                                orgMembers.find(m => m.id === localCustomer.assigned_to)?.full_name ??
                                                orgMembers.find(m => m.id === localCustomer.assigned_to)?.email ??
                                                'Unknown'
                                            }`
                                            : 'Assign Customer'}
                                    </Button>
                                </Box>

                                <CustomerAssignmentMenu
                                    anchorEl={assignAnchorEl}
                                    open={Boolean(assignAnchorEl)}
                                    onClose={handleCloseAssignMenu}
                                    orgMembers={orgMembers}              // ✅ pass OrgMemberProfile[] directly
                                    customer={localCustomer}
                                    onAssign={async (userId) => {
                                        if (localCustomer?.id) {
                                            await onAssign(localCustomer.id, userId ?? '');
                                            handleCloseAssignMenu();
                                            onRefreshCustomers?.();
                                        }
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card sx={{ borderRadius: 2 }}>
                            <CardHeader avatar={<TimelineIcon />} title="Timeline" />
                            <Divider />
                            <CardContent>
                                <Typography variant="body2">
                                    Created: {formattedDate(customer?.created_at)}
                                </Typography>
                                {('updated_at' in (customer ?? {}) as any) && (
                                    <Typography variant="body2">
                                        Updated: {formattedDate((customer as any)?.updated_at)}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>

                        {/* Interactions */}
                        <Card sx={{ borderRadius: 2 }}>
                            <CardHeader avatar={<HistoryIcon />} title="Interactions" />
                            <Divider />
                            <CardContent>
                                {interactions.length > 0 ? (
                                    interactions.map((i) => (
                                        <Box key={i.id} sx={{ mb: 1 }}>
                                            <Typography variant="body2">
                                                {i.interaction_type} — {new Date(i.created_at).toLocaleString()}
                                            </Typography>
                                            {i.subject && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {i.subject}
                                                </Typography>
                                            )}
                                            {i.creator_name && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ display: 'block' }}
                                                >
                                                    By: {i.creator_name} ({i.creator_email ?? 'unknown'})
                                                </Typography>
                                            )}
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No interactions logged yet.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                )}

                {tab === 1 && customer?.id && (
                    <CustomerOpportunitiesPanel
                        opportunities={customer.opportunities || []}
                        onAddOpportunity={() => handleAddOpportunity(customer.id)}
                    />
                )}

                {tab === 2 && (
                    <Box>
                        {loading && <LinearProgress sx={{ mb: 2 }} />}
                        <LeadBriefPanel
                            brief={brief}
                            updatedAt={updatedAt}
                            error={error}
                            loading={loading}
                            onRetry={() => loadBrief(true)}
                        />
                        {error && (
                            <Box sx={{ mt: 2 }}>
                                <Button variant="outlined" onClick={() => loadBrief(true)}>
                                    Retry brief
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
