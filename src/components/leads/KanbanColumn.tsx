// src/components/leads/KanbanColumn.tsx
import { Box } from '@mui/material';
import { StageHeader } from './StageHeader';
import { LeadCard } from './LeadCard';
import type { PipelineStage, LeadData, TeamMember } from '@/types';

export function KanbanColumn({
  stage,
  leads,
  onLeadDrop,
  teamMembers
}: {
  stage: PipelineStage;
  leads: LeadData[];
  onLeadDrop: (leadId: string, newStageId: string) => void;
  teamMembers: TeamMember[];
}) {
  return (
    <Box sx={{ width: 300, mx: 1 }}>
      <StageHeader name={stage.name} color={stage.color} />
      <Box sx={{ mt: 2 }}>
        {leads.map(lead => (
          <LeadCard
            key={lead.id}
            lead={lead}
            stageId={stage.id}
            onDrop={(newStageId: string) => onLeadDrop(lead.id, newStageId)}
            teamMembers={teamMembers}
            isSelected={false}
            isActive={false}
            onSelect={() => {}}
            onDragStart={() => {}}
            onDragEnd={() => {}}
            onTouchStart={() => {}}
            onTouchEnd={() => {}}
            onClick={() => {}}
          />
        ))}
      </Box>
    </Box>
  );
}
