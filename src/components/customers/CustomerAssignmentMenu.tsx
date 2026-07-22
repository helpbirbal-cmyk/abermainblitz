// src/components/customers/CustomerAssignmentMenu.tsx
'use client';

import { Menu, MenuItem, Avatar, Box, Typography } from '@mui/material';
import type { Customer, OrgMemberProfile } from '@/types';

interface CustomerAssignmentMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    onAssign: (userId: string | null) => void;
    orgMembers: OrgMemberProfile[];   // ✅ use the view-based type
    customer: Customer | null;
}

export const CustomerAssignmentMenu = ({
                                           anchorEl,
                                           open,
                                           onClose,
                                           onAssign,
                                           orgMembers,
                                           customer,
                                       }: CustomerAssignmentMenuProps) => {
    if (!customer) return null;
    console.log('CustomerAssignmentMenu rendered, orgMembers length:', orgMembers.length);

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <MenuItem disabled>
                <Typography variant="subtitle2">
                    Assign "{customer.name}"
                </Typography>
            </MenuItem>

            <MenuItem
                onClick={() => {
                    onAssign(null);
                    onClose();
                }}
            >
                Unassign
            </MenuItem>

            {orgMembers.map((member) => {
                const displayName = member.full_name || member.email || `User ${member.user_id.slice(0, 8)}`;
                const avatarInitial = member.full_name?.[0] || member.email?.[0] || member.user_id[0];
                console.log('Rendering member displayName:', displayName);

                return (
                    <MenuItem
                        key={member.user_id}
                        onClick={() => {
                            onAssign(member.user_id);
                            onClose();
                        }}
                        selected={customer.assigned_to === member.user_id}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                {avatarInitial}
                            </Avatar>
                            <Box>
                                <Typography variant="body2">{displayName}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {member.role}
                                </Typography>
                            </Box>
                        </Box>
                    </MenuItem>
                );
            })}

        </Menu>
    );
};
