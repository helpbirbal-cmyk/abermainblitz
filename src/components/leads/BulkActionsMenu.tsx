'use client';

import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Delete as DeleteIcon,
  PersonAdd as AssignIcon,
  Edit as EditIcon,
  CheckCircle as ConvertIcon,
  Label as LabelIcon
} from '@mui/icons-material';

interface BulkActionsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onAssign: () => void;
  onUpdateStage: () => void;
  onConvert: () => void;
  onDelete: () => void;
  selectedCount: number;
}

export const BulkActionsMenu = ({
  anchorEl,
  open,
  onClose,
  onAssign,
  onUpdateStage,
  onConvert,
  onDelete,
  selectedCount
}: BulkActionsMenuProps) => {
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
        <ListItemText>
          {selectedCount} leads selected
        </ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => {
        onAssign();
        onClose();
      }}>
        <ListItemIcon>
          <AssignIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Assign To</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => {
        onUpdateStage();
        onClose();
      }}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Update Stage</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => {
        onConvert();
        onClose();
      }}>
        <ListItemIcon>
          <ConvertIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Convert to Customer</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => {
        onDelete();
        onClose();
      }} sx={{ color: 'error.main' }}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Delete Selected</ListItemText>
      </MenuItem>
    </Menu>
  );
};
