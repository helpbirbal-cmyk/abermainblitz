'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Avatar,
    IconButton,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    Tooltip,
    Badge,
} from '@mui/material';
import {
    Info,
    AssignmentInd,
    Chat as ChatIcon,
    ViewList as ViewListIcon,
} from '@mui/icons-material';
import { createClient } from '@/lib/supabase/client';
import type { Customer, OrgMemberProfile, LeadData } from '@/types';
import { CustomerInteractionDialog } from '@/components/customers/CustomerInteractionDialog';
import { AddLeadDialog } from '@/components/leads/AddLeadDialog';
import { useTenant } from '@/lib/supabase/tenant-context';

interface CustomerCardProps {
    customer: Customer;
    orgMembers: OrgMemberProfile[];
    onAssign: (customerId: string, memberId: string) => Promise<void>;
    onRefreshCustomers?: () => void;
    onOpenDetails: () => void;
}

export const CustomerCard = ({
                                 customer,
                                 orgMembers,
                                 onAssign,
                                 onRefreshCustomers,
                                 onOpenDetails,
                             }: CustomerCardProps) => {
    const theme = useTheme();
    const supabase = createClient();
    const { organization } = useTenant();

    // ✅ assigned_to now references organization_members.id
    const assignedUser = orgMembers.find(m => m.id === customer.assigned_to);
    const initials =
        assignedUser?.full_name?.[0] ||
        assignedUser?.email?.[0] ||
        '?';

    const [interactionOpen, setInteractionOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(customer.assigned_to || '');

    const [leadsOpen, setLeadsOpen] = useState(false);
    const [addLeadOpen, setAddLeadOpen] = useState(false);

    useEffect(() => {
        console.log('CustomerCard mounted for', customer.id);
    }, [customer.assigned_to]);

    return (
        <>
            <Card sx={{ minHeight: 120, display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.background.paper, boxShadow: 3, borderRadius: 2, cursor: 'pointer', transition: 'transform 0.2s ease', '&:hover': { zIndex: 2, boxShadow: theme.shadows[4], transform: 'scale(1.01)' } }}>
                <CardContent>
                    <Typography variant="subtitle2" fontWeight={600}>
                        {customer.name}
                    </Typography>
                    <Typography variant="body2">{customer.company || 'NA'}</Typography>

                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={customer.status || 'Active'} size="small" />
                        <Chip label={customer.customer_type || 'SME'} size="small" />
                        {customer.industry && <Chip label={customer.industry} size="small" />}
                    </Box>

                    {/* ✅ Assigned user chip */}
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {customer.assigned_member ? (
                            <Chip
                                avatar={
                                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                        {customer.assigned_member.full_name?.[0] ||
                                            customer.assigned_member.email?.[0] ||
                                            "?"}
                                    </Avatar>
                                }
                                label={customer.assigned_member.full_name || customer.assigned_member.email}
                                size="small"
                                variant="outlined"
                                color="primary"
                            />
                        ) : (
                            <Chip
                                label="Unassigned"
                                size="small"
                                variant="outlined"
                                color="default"
                            />
                        )}


                        <Box>
                            <Tooltip title="Details" placement="top-start">
                                <IconButton size="small" onClick={onOpenDetails}>
                                    <Info />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Assign" placement="top-start">
                                <IconButton size="small" onClick={() => setAssignOpen(true)}>
                                    <AssignmentInd />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Interactions" placement="top-start">
                                <IconButton size="small" onClick={() => setInteractionOpen(true)}>
                                    <ChatIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Leads" placement="top-start">
                                <IconButton size="small" onClick={() => setLeadsOpen(true)}>
                                    <Badge badgeContent={customer.leads?.length ?? 0} color="primary" overlap="circular" showZero>
                                        <ViewListIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Assignment dialog */}
            <Dialog open={assignOpen} onClose={() => setAssignOpen(false)}>
                <DialogTitle>Assign Customer</DialogTitle>
                <DialogContent>
                    <Select
                        fullWidth
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        {orgMembers.map((m) => (
                            <MenuItem key={m.id} value={m.id}>
                                {m.full_name || m.email || m.user_id}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAssignOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (selectedUser) {
                                onAssign(customer.id, selectedUser); // ✅ membership id
                                setAssignOpen(false);
                            }
                        }}
                    >
                        Assign
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Leads dialog */}
            <Dialog open={leadsOpen} onClose={() => setLeadsOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Leads</DialogTitle>
                <DialogContent>
                    <List>
                        {(customer.leads as LeadData[] | undefined)?.map((lead) => (
                            <ListItem key={lead.id}>
                                <ListItemText primary={lead.name} secondary={lead.status} />
                            </ListItem>
                        ))}
                        {(!customer.leads || customer.leads.length === 0) && (
                            <ListItem><ListItemText primary="No leads yet" /></ListItem>
                        )}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLeadsOpen(false)}>Close</Button>
                    <Button variant="contained" onClick={() => setAddLeadOpen(true)}>+ New Lead</Button>
                </DialogActions>
            </Dialog>

            {/* Interaction dialog */}
            {interactionOpen && (
                <CustomerInteractionDialog
                    open={interactionOpen}
                    onClose={() => setInteractionOpen(false)}
                    customer={customer}
                    onSubmit={async (type, notes) => {
                        await supabase.from('interactions').insert({
                            related_to_type: 'customer',
                            related_to_id: customer.id,
                            interaction_type: type,
                            description: notes,
                        });
                        setInteractionOpen(false);
                        onRefreshCustomers?.();
                    }}
                />
            )}

            {/* Add Lead dialog */}
            <AddLeadDialog
                open={addLeadOpen}
                onClose={() => setAddLeadOpen(false)}
                organizationId={organization?.id ?? ''}
                onLeadAdded={onRefreshCustomers ? async () => { onRefreshCustomers(); } : async () => {}}
            />
        </>
    );
};
