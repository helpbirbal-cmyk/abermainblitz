// src/components/leads/PipelineKanban.tsx
'use client';

import { useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { PipelineStage } from './PipelineStage';
import type { LeadData, PipelineStage as IPipelineStage, TeamMember } from '@/types';

interface PipelineKanbanProps {
  leads: LeadData[];
  stages: IPipelineStage[];
  teamMembers: TeamMember[];
  onLeadMove: (leadId: string, newStageId: string) => void;
  selectedLeads: Set<string>;
  onLeadSelect: (leadId: string) => void;
  onSelectAll: (leads: LeadData[]) => void;
  onInteractionClick?: (lead: LeadData) => void;
  onDetailsClick?: (lead: LeadData) => void;
  onConvertClick?: (lead: LeadData) => void;
  onAssignClick?: (lead: LeadData, event: React.MouseEvent<HTMLButtonElement>) => void;
  onDropLead: (leadId: string, newStageId: string) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  onLeadClick: (lead: LeadData) => void;
  onStageClick?: () => void;
  collapsedStages: Set<string>;
  toggleCollapse: (stageId: string) => void;
}

export const PipelineKanban = ({
  leads,
  stages,
  teamMembers,
  onLeadMove,
  selectedLeads,
  onLeadSelect,
  onSelectAll,
  onInteractionClick,
  onDetailsClick,
  onConvertClick,
  onAssignClick,
  onDropLead,
  onDragStart,
  onDragEnd,
  onTouchStart,
  onTouchEnd,
  onLeadClick,
  onStageClick,
  collapsedStages,
 toggleCollapse
}: PipelineKanbanProps) => {
  const theme = useTheme();
  const [draggedLead, setDraggedLead] = useState<LeadData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState<number>(0);
  const [touchStartLead, setTouchStartLead] = useState<LeadData | null>(null);
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);

/***  const [collapsedStages, setCollapsedStages] = useState<Set<string>>(new Set());

  const toggleCollapse = (stageId: string) => {
    setCollapsedStages(prev => {
      const next = new Set(prev);
      next.has(stageId) ? next.delete(stageId) : next.add(stageId);
      return next;
    }); **/
//  };



  useEffect(() => {
    return () => {
      setTouchStartTime(0);
      setTouchStartLead(null);
      setSelectedLead(null);
    };
  }, []);

  const handleDragStart = (lead: LeadData) => {
    setDraggedLead(lead);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setDraggedLead(null);
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent, lead: LeadData) => {
    setTouchStartTime(Date.now());
    setTouchStartLead(lead);
  };

  const handleTouchEnd = (e: React.TouchEvent, targetStage: IPipelineStage) => {
    const touchDuration = Date.now() - touchStartTime;
    if (
      touchDuration > 500 &&
      touchStartLead &&
      touchStartLead.pipeline_stage !== targetStage.name.toLowerCase().replace(/\s+/g, '_')
    ) {
      onLeadMove(touchStartLead.id, targetStage.id);
    }
    setTouchStartTime(0);
    setTouchStartLead(null);
  };

  const handleLeadClick = (lead: LeadData) => {
    if (!lead.converted_to_customer_id && !isDragging) {
      setSelectedLead(selectedLead?.id === lead.id ? null : lead);
    }
  };

  const handleStageClick = (stage: IPipelineStage) => {
    if (
      selectedLead &&
      selectedLead.pipeline_stage !== stage.name.toLowerCase().replace(/\s+/g, '_')
    ) {
      onLeadMove(selectedLead.id, stage.id);
      setSelectedLead(null);
    }
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      onLeadMove(leadId, stageId);
    }
  };

  const leadsByStage: { stage: IPipelineStage; leads: LeadData[] }[] = stages.map(stage => ({
    stage,
    leads: leads.filter(
      lead => lead.pipeline_stage === stage.name.toLowerCase().replace(/\s+/g, '_')
    )
  }));

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        overflowY: 'hidden',
        pb: 2,
        px: 1,
        minHeight: '100%',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {leadsByStage.map(({ stage, leads: stageLeads }) => (
        <PipelineStage
          key={stage.id}
          stage={stage}
          leads={stageLeads}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={(e) => handleDrop(e, stage.id)}
          selectedLeads={selectedLeads}
          onLeadSelect={onLeadSelect}
          onSelectAll={onSelectAll}
          isDragging={isDragging}
          activeLead={selectedLead}
          onTouchStart={handleTouchStart}
          onTouchEnd={(e) => handleTouchEnd(e, stage)}
          onLeadClick={handleLeadClick}
          onStageClick={() => handleStageClick(stage)}
          onInteractionClick={onInteractionClick}
          onDetailsClick={onDetailsClick}
          onConvertClick={onConvertClick}
          onAssignClick={onAssignClick}
          onDropStage={(e) => handleDrop(e, stage.id)}
          onDropLead={onDropLead}
          teamMembers={teamMembers}
          isCollapsed={collapsedStages.has(stage.id)}
          onToggleCollapse={() => toggleCollapse(stage.id)}
        />
      ))}
    </Box>
  );
};
