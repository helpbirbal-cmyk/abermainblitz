// src/components/leads/AssignmentMenu.tsx
import { Menu, MenuItem, Avatar, Box, Typography } from '@mui/material';
import type { TeamMember, LeadData } from '@/types';

interface AssignmentMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onAssign: (userId: string | null) => void;
  teamMembers: TeamMember[];
  lead: LeadData | null;
}

export const AssignmentMenu = ({
  anchorEl,
  open,
  onClose,
  onAssign,
  teamMembers,
  lead
}: AssignmentMenuProps) => {
  if (!lead) return null;

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem disabled>
        <Typography variant="subtitle2">
          Assign "{lead.name}"
        </Typography>
      </MenuItem>

      <MenuItem onClick={() => {
        onAssign(null);
        onClose();
      }}>
        Unassign
      </MenuItem>

      {teamMembers.map(member => (
        <MenuItem
          key={member.user_id}
          onClick={() => {
            onAssign(member.user_id);
            onClose();
          }}
          selected={lead.assigned_to === member.user_id}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
              {member.users?.user_metadata?.full_name?.[0] || member.users.email[0]}
            </Avatar>
            <Box>
              <Typography variant="body2">
                {member.users?.user_metadata?.full_name || member.users.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {member.role}
              </Typography>
            </Box>
          </Box>
        </MenuItem>
      ))}
    </Menu>
  );
};
