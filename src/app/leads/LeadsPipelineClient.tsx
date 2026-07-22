// src/app/leads/LeadsPipelineClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { createClient } from '@/lib/supabase/client';
import { useTenant } from '@/lib/supabase/tenant-context';
import { usePipelineData } from '@/hooks/usePipelineData';
import { useLeadMutations } from '@/hooks/useLeadMutations';
import { PipelineKanban } from '@/components/leads/PipelineKanban';
import { ListView } from '@/components/leads/ListView';
import { LeadDetailsDialog } from '@/components/leads/LeadDetailsDialog';
import { PipelineHeader } from '@/components/leads/PipelineHeader';
import { FiltersDialog } from '@/components/leads/FiltersDialog';
import { utils, writeFile } from 'xlsx';
import { LeadImportDialog } from '@/components/leads/LeadImportDialog';
import { AddLeadDialog } from '@/components/leads/AddLeadDialog';

import type { LeadData, PipelineStage, TeamMember } from '@/types';

export function LeadsPipelineClient() {
  const theme = useTheme();
  const { organization } = useTenant();
  const orgId = organization?.id;

  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  const [showLeadDialog, setShowLeadDialog] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('lead_filters');
    if (stored) setFilters(JSON.parse(stored));
  }, []);


//  const [showImportDialog, setShowImportDialog] = useState(false);

  const [showImport, setShowImport] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);

  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [savedPresets, setSavedPresets] = useState<{ name: string; filters: any }[]>([]);

  const [view, setView] = useState<'pipeline' | 'list'>('pipeline');
  const [detailsState, setDetailsState] = useState<{ open: boolean; lead: LeadData | null }>({
    open: false,
    lead: null
  });


  type CollapseMode = 'manual' | 'auto' | 'global';

  const [collapsedStages, setCollapsedStages] = useState<Set<string>>(new Set());

  const [collapseMode, setCollapseMode] = useState<CollapseMode>('manual');

  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);


  const toggleCollapse = (stageId: string) => {
  setCollapseMode('manual'); // ✅ mark as user intent
  setCollapsedStages((prev) => {
    const updated = new Set(prev);
    if (updated.has(stageId)) {
      updated.delete(stageId);
    } else {
      updated.add(stageId);
    }
    return updated;
  });
};


const expandAllStages = () => {
  setCollapseMode('global'); // ✅ prevent auto-collapse override
  setCollapsedStages(new Set());
};

const collapseAllStages = () => {
  setCollapseMode('global');
  setCollapsedStages(new Set(stages.map((s) => s.id)));
};


  const [activeTab, setActiveTab] = useState(0); // 0 = Pipeline, 1 = List

  const defaultFilters = {
    search: '',
    source: 'all',
    leadType: 'all',
    scoreMin: 0,
    scoreMax: 100,
    dateRange: 'all',
    assignedTo: 'all',
    startDate: null,
    endDate: null
  };
  type Filters = typeof defaultFilters;
  const [filters, setFilters] = useState<Filters>(defaultFilters);


const handleExport = (format: 'csv' | 'xlsx') => {
  const data = filteredLeads.map(lead => ({
    Name: lead.name,
    Email: lead.email,
    Company: lead.company,
    Score: lead.lead_score,
    Source: lead.source,
    Stage: lead.pipeline_stage,
    AssignedTo: lead.assigned_to,
    CreatedAt: lead.created_at
  }));

  const sheet = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, sheet, 'Leads');

  writeFile(wb, `leads_export.${format}`);
};


  useEffect(() => {
    const stored = localStorage.getItem('lead_filters');
    if (stored) {
      try {
        setFilters(JSON.parse(stored));
      } catch {
        console.warn('Invalid stored filters — resetting');
        setFilters(defaultFilters);
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('lead_filters', JSON.stringify(filters));
  }, [filters]);

  const {
    stages,
    leads,
    teamMembers,
    loading,
    reloadPipeline
  } = usePipelineData(orgId ?? '');

  const filteredLeads = leads.filter((lead) => {
    const score = Number(lead.lead_score);
    const matchesScore =
      !isNaN(score) &&
      score >= filters.scoreMin &&
      score <= filters.scoreMax;

    const matchesSearch =
      filters.search === '' ||
      lead.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.company?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesSource =
      filters.source === 'all' || lead.source === filters.source;

    const matchesType =
      filters.leadType === 'all' || lead.lead_type === filters.leadType;

    const matchesAssigned =
      filters.assignedTo === 'all' ||
      (filters.assignedTo === 'unassigned' && !lead.assigned_to) ||
      lead.assigned_to === filters.assignedTo;

    const result =
      matchesScore &&
      matchesSearch &&
      matchesSource &&
      matchesType &&
      matchesAssigned;



    return result;
  });


  const { updateLeadStage } = useLeadMutations();

let lastMove = { leadId: '', toStage: '' };

  const handleLeadMove = async (leadId: string, newStageId: string) => {

    if (lastMove.leadId === leadId && lastMove.toStage === newStageId) {
        console.warn('⏭️ Duplicate move detected — skipping');
        return;
      }

      lastMove = { leadId, toStage: newStageId };

    const stage = stages.find(s => s.id === newStageId);
    if (!stage || !stage.slug) {
      console.error('Invalid stage ID or missing slug:', newStageId);
      return;
    }

    await updateLeadStage(leadId, stage.slug);
    await reloadPipeline();
  };



  const { updateLead } = useLeadMutations();

const handleUpdateLead = async (leadId: string, updates: Partial<LeadData>) => {
  try {
    await updateLead(leadId, updates);
    await reloadPipeline();
    setDetailsState({ open: false, lead: null });
  } catch (error) {
    console.error('Error updating lead:', error);
  }
};


  const handleImportedLeads = async (leads: any[]) => {
    try {
      const res = await fetch('/api/leads/import', {
        method: 'POST',
        body: JSON.stringify(leads),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error('Failed to import leads');

      // Optionally refresh pipeline or show toast
      await reloadPipeline(); // if you have this
    } catch (err) {
      console.error('❌ Import failed:', err);
    }
  };

  const selectedStage = selectedLead
  ? stages.find(s => s.id === selectedLead.pipeline_stage)
  : stages[0]; // ✅ fallback to first stage


const [autoCollapsed, setAutoCollapsed] = useState<Set<string>>(new Set());
useEffect(() => {
  if (collapseMode !== 'auto') return; // ✅ skip if user or global triggered

  const emptyStageIds = stages
    .filter((stage) => !filteredLeads.some((lead) => lead.pipeline_stage === stage.id))
    .map((s) => s.id);

  setCollapsedStages((prev) => {
    const updated = new Set(prev);
    emptyStageIds.forEach((id) => updated.add(id));
    return updated;
  });
}, [filteredLeads, stages, collapseMode]);


useEffect(() => {
  setCollapsedStages((prev) => {
    const updated = new Set(prev);
    autoCollapsed.forEach((id) => {
      if (!prev.has(id)) {
        updated.add(id);
      }
    });
    return updated;
  });
}, [autoCollapsed]);


  if (!orgId) return null;

  return (
    <Container maxWidth={false}>
      {selectedStage && (
      <PipelineHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filters={filters}
        setFilters={setFilters}
        defaultFilters={defaultFilters}
        leads={filteredLeads} // ✅ use filtered leads here
        selectedLeads={selectedLeads}
        teamMembers={teamMembers}
          onAddLead={() => setShowAddLead(true)}
        onExport={handleExport}
        onApplyPreset={(preset) => setFilters(preset)}
        savedPresets={savedPresets}
        setSavedPresets={setSavedPresets}
        onImportCSV={() => setShowImport(true)}

        stage={selectedStage}
        isCollapsed={collapsedStages.has(selectedStage?.id ?? '')}
        toggleCollapse={toggleCollapse}

        collapseAllStages={collapseAllStages}   // ✅ new
        expandAllStages={expandAllStages}       // ✅ new
      />
    )}
     {activeTab === 0  && (
        <PipelineKanban
          leads={filteredLeads}
          stages={stages}
          teamMembers={teamMembers}
          selectedLeads={new Set()}
          onLeadSelect={() => {}}
          onSelectAll={() => {}}
          onDropLead={handleLeadMove}
          onLeadMove={handleLeadMove}
          onLeadClick={(lead) => setSelectedLead(lead)}
          onDetailsClick={(lead) => setDetailsState({ open: true, lead })}
          collapsedStages={collapsedStages}
          toggleCollapse={toggleCollapse}
        />
      )}

       {activeTab === 1  && (
        <ListView
          leads={filteredLeads}
          teamMembers={teamMembers}
          selectedLeads={new Set()}
          onLeadSelect={() => {}}
          onDetailsClick={(lead) => setDetailsState({ open: true, lead })}
          onSelectAll={() => {}}
        />
      )}

      <LeadDetailsDialog
        open={detailsState.open}
        onClose={() => setDetailsState({ open: false, lead: null })}
        lead={detailsState.lead}
        onUpdateLead={handleUpdateLead}
      />
      <LeadImportDialog
        open={showImport}
        onClose={() => setShowImport(false)}
        onImport={(leads) => handleImportedLeads(leads)}
      />

      <AddLeadDialog
          open={showAddLead}
          onClose={() => setShowAddLead(false)}
          organizationId={orgId} // pass your org ID here
          onLeadAdded={reloadPipeline}
        />
    </Container>
  );
}
