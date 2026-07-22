// src/components/leads/PipelineStage.tsx
'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Stack,
  useTheme,
  alpha,
  IconButton
} from '@mui/material';
import type { LeadData, PipelineStage as IPipelineStage, TeamMember } from '@/types';
import { LeadCard } from './LeadCard';

import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';



interface PipelineStageProps {
  stage: IPipelineStage;
  leads: LeadData[];
  onDragStart: (lead: LeadData) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent) => void;
  selectedLeads: Set<string>;
  onLeadSelect: (leadId: string) => void;
  onSelectAll?: (leads: LeadData[]) => void;
  isDragging?: boolean;
  activeLead?: LeadData | null;
  onTouchStart: (e: React.TouchEvent, lead: LeadData) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onLeadClick: (lead: LeadData) => void;
  onStageClick: () => void;
  onInteractionClick?: (lead: LeadData) => void;
  onDetailsClick?: (lead: LeadData) => void;
  onConvertClick?: (lead: LeadData) => void;
  onAssignClick?: (lead: LeadData, event: React.MouseEvent<HTMLButtonElement>) => void;
  onDropStage: (e: React.DragEvent) => void;
  onDropLead: (leadId: string, newStageId: string) => void;
  teamMembers: TeamMember[];
  isCollapsed: boolean;
  onToggleCollapse: () => void
}

export const PipelineStage = ({
  stage,
  leads,
  onDragStart,
  onDragEnd,
  onDrop,
  selectedLeads,
  onLeadSelect,
  onSelectAll,
  isDragging,
  activeLead,
  onTouchStart,
  onTouchEnd,
  onLeadClick,
  onStageClick,
  onInteractionClick,
  onDetailsClick,
  onConvertClick,
  onAssignClick,
  onDropLead,
  onDropStage,
  teamMembers,
  isCollapsed,
  onToggleCollapse
}: PipelineStageProps) => {
  const theme = useTheme();
  const [isOver, setIsOver] = useState(false);

  const filteredLeads = leads;
  const selectedInStage = filteredLeads.filter(lead => selectedLeads.has(lead.id)).length;
  const isActiveStage = activeLead && filteredLeads.some(l => l.id === activeLead.id);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    onDrop(e);
  };
  //console.log('🧪 Stage object:', JSON.stringify(stage, null, 2));
  //console.log('📦 isCollapsed for', stage.name, ':', isCollapsed);

    return (
        <Card
            sx={{
                minWidth: {xs: 300, md: 350},
                flexShrink: 0,
                transition: 'all 0.2s ease',
                backgroundColor: isActiveStage
                    ? alpha(theme.palette.primary.main, 0.8)
                    : 'background.default',
                cursor: isActiveStage ? 'pointer' : 'default',
                display: 'flex',
                flexDirection: 'column',
                p: 1
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={onStageClick}
        >
            <CardContent
                sx={{
                    border: '1px solid gray',
                    p: 2,
                    flex: 1,
                    overflowY: 'auto',
                    minHeight: 0
                }}
            >
                {/* Stage Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'background.paper',
                        zIndex: 1,
                        py: 2
                    }}
                >
                    <Box sx={{m: 2, display: 'flex', alignItems: 'center', gap: 1}}>
                        <Typography
                            variant="h6"
                            sx={{fontSize: {xs: '1rem', md: '1.25rem'}}}
                            fontWeight="600"
                        >
                            {stage.name}
                        </Typography>
                        <Chip
                            label={filteredLeads.length}
                            size="small"
                            sx={{
                                backgroundColor: stage.color || theme.palette.primary.contrastText,
                                color: 'white'
                            }}
                        />
                        <IconButton size="small" onClick={onToggleCollapse}>
                          {isCollapsed ? <UnfoldLessIcon/> : <UnfoldMoreIcon/>}
                        </IconButton>
                    </Box>
                    {filteredLeads.length > 0 && onSelectAll && (
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                            <Checkbox
                                size="small"
                                checked={
                                    selectedInStage === filteredLeads.length && filteredLeads.length > 0
                                }
                                indeterminate={
                                    selectedInStage > 0 &&
                                    selectedInStage < filteredLeads.length
                                }
                                onChange={() => onSelectAll(filteredLeads)}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {selectedInStage}/{filteredLeads.length}
                            </Typography>
                        </Box>
                    )}
                </Box>
                {isCollapsed ? (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 3,
                      color: 'text.secondary',
                      backgroundColor: alpha(theme.palette.background.default, 0.8),
                      borderRadius: 1,
                      border: `1px dashed ${theme.palette.divider}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Typography variant="body2">Stage collapsed</Typography>
                    <Chip label={`${filteredLeads.length} leads`} size="small" />
                    <UnfoldLessIcon fontSize="small" color="disabled" />
                  </Box>
                ) : (
                    <>
                        {/* Leads List */}
                        <Stack
                            spacing={1}
                            sx={{
                                border: '1px solid gray-300',
                                pr: 1,
                                mr: -1,
                                pb: 2
                            }}
                        >
                            {filteredLeads.map((lead) => (
                                <LeadCard
                                    key={lead.id}
                                    lead={lead}
                                    isSelected={selectedLeads.has(lead.id)}
                                    isActive={activeLead?.id === lead.id}
                                    onSelect={onLeadSelect}
                                    onDragStart={() => onDragStart(lead)}
                                    onDragEnd={onDragEnd}
                                    onTouchStart={(e) => onTouchStart(e, lead)}
                                    onTouchEnd={onTouchEnd}
                                    onClick={() => onLeadClick(lead)}
                                    onInteractionClick={() => onInteractionClick?.(lead)}
                                    onDetailsClick={() => onDetailsClick?.(lead)}
                                    onConvertClick={() => onConvertClick?.(lead)}
                                    onAssignClick={(e) => onAssignClick?.(lead, e)}
                                    stageId={stage.id}
                                    onDrop={(leadId, newStageId) => onDropLead(leadId, newStageId)}
                                    teamMembers={teamMembers}
                                    sx={{border: '1px solid white', flexShrink: 0, minHeight: 120}}
                                />
                            ))}
                        </Stack>

                        {filteredLeads.length === 0 && (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 3,
                                    color: 'text.secondary',
                                    backgroundColor: alpha(theme.palette.background.default, 0.8),
                                    borderRadius: 1,
                                    border: `1px dashed ${theme.palette.divider}`
                                }}
                            >
                                <Typography variant="body2">No leads in this stage</Typography>
                            </Box>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};
