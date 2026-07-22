// src/components/leads/LeadCard.tsx
'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Info,
  AssignmentInd,
  SwapHoriz,
  Chat as ChatIcon
} from '@mui/icons-material';
import type { LeadData, TeamMember } from '@/types';
import { InteractionDialog } from './InteractionDialog';
import { logInteraction, fetchInteractionsWithCreator} from '@/lib/supabase/interactions';
import type { SxProps, Theme } from '@mui/material';

interface LeadCardProps {
  lead: LeadData;
  isSelected: boolean;
  isActive: boolean;
  onSelect: (leadId: string) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onClick: () => void;
  onInteractionClick?: () => void;
  onDetailsClick?: () => void;
  onConvertClick?: () => void;
  onAssignClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  stageId: string;
  onDrop: (leadId: string, newStageId: string) => void;
  teamMembers: TeamMember[];
  sx?: SxProps<Theme>; // ✅ add this line
}

export const LeadCard = ({
  lead,
  isSelected,
  isActive,
  onSelect,
  onDragStart,
  onDragEnd,
  onTouchStart,
  onTouchEnd,
  onClick,
  onInteractionClick,
  onDetailsClick,
  onConvertClick,
  onAssignClick,
  stageId,
  onDrop,
  teamMembers
}: LeadCardProps) => {
  const theme = useTheme();
  const assignedUser = teamMembers.find(tm => tm.user_id === lead.assigned_to);
  const initials = assignedUser?.users?.user_metadata?.full_name?.[0] || '?';
  const [interactionOpen, setInteractionOpen] = useState(false);

  return (
    <>
      <Card
        draggable
        onDragStart={e => {
          e.dataTransfer.setData('leadId', lead.id);
          onDragStart();
        }}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          const draggedId = e.dataTransfer.getData('leadId');
          onDrop(draggedId, stageId);
          onDragEnd();
        }}
        onTouchStart={e => onTouchStart(e)}
        onTouchEnd={e => onTouchEnd(e)}
        onClick={onClick}
        sx={{

          minHeight: 120,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',

          backgroundColor: theme.palette.background.paper,
          boxShadow: 3,
          borderRadius: 2,
          cursor: 'grab',
          transition: 'transform 0.2s ease',
          '&:hover': {
            zIndex: 2,
            boxShadow: theme.shadows[4],
            transform: 'scale(1.01)',
          },
        }}
      >
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600}>
            {lead.name}
          </Typography>
          <Typography variant="body2">{lead.company || 'NA'}</Typography>
          <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={lead.status} size="small" />
            <Chip label={`Score: ${lead.lead_score}`} size="small" />
            { /** <Chip label={lead.source} size="small" />**/}
          </Box>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Avatar>{initials}</Avatar>
            <Box>
              <IconButton size="small" onClick={onDetailsClick}><Info /></IconButton>
              <IconButton size="small" onClick={onAssignClick}><AssignmentInd /></IconButton>
              <IconButton size="small" onClick={onConvertClick}><SwapHoriz /></IconButton>
              <IconButton size="small" onClick={() => setInteractionOpen(true)}><ChatIcon /></IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {interactionOpen && (
        <InteractionDialog
          open={interactionOpen}
          onClose={() => setInteractionOpen(false)}
          lead={lead}
          onSubmit={async (type, notes) => {
            await logInteraction(
              lead.id,
              lead.organization_id || null,
              lead.created_by || null,
              lead.assigned_to || null,
              {
                type: type as
                  | 'call'
                  | 'email'
                  | 'meeting'
                  | 'demo'
                  | 'proposal'
                  | 'follow_up'
                  | 'note',
                subject: `Interaction with ${lead.name}`,
                description: notes
              }
            );

            setInteractionOpen(false);
          }}
        />
      )}
    </>
  );
};
