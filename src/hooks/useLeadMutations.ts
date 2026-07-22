// src/hooks/useLeadMutations.ts
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LeadData } from '@/types';

export const useLeadMutations = () => {
  const updateLeadStage = async (leadId: string, newStageSlug: string) => {
    const normalizedStage = newStageSlug.toLowerCase();
    const supabase = createClient();

    // ✅ Fetch current user for attribution
//    const {
//      data: { user },
//      error: userError
//    } = await supabase.auth.getUser();
const { data: { session }, error: sessionError } = await supabase.auth.getSession();
const user = session?.user;



    // Ensure userError exists before accessing its message
      if (sessionError || !user) {
          if (sessionError) { // Only log message if userError exists
              console.warn('⚠️ Could not fetch current user:', sessionError.message);
          } else {
              // Handle the case where !user is true but userError is null/undefined
              console.warn('⚠️ Could not fetch current user: No error object provided.');
          }
      }

      // ✅ Fetch lead metadata
    const { data: lead, error: fetchError } = await supabase
      .from('unified_leads')
      .select('id, pipeline_stage, created_by, source_table')
      .eq('id', leadId)
      .single();

    if (fetchError || !lead) {
      console.error('❌ Failed to fetch lead metadata:', fetchError?.message);
      throw new Error('Lead not found');
    }

    // ✅ Skip if stage is unchanged
  //  const normalizedStage = newStageSlug.toLowerCase();
    if (lead.pipeline_stage === normalizedStage) {
      console.warn('⏭️ Stage unchanged — skipping update and log');
      return;
    }

    // ✅ Update pipeline stage
    const tableName = lead.source_table || 'lead_assessment_reports';
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ pipeline_stage: normalizedStage })
      .eq('id', leadId);

    if (updateError) {
      console.error('❌ Failed to update stage:', updateError.message);
      throw new Error('Stage update failed');
    }

    // ✅ Log stage change
    const changedBy = user?.id || lead.created_by || 'unknown';
    const changedByName = user?.user_metadata?.full_name || user?.email || 'Unknown';

    const { error: logError } = await supabase
      .from('lead_stage_changes')
      .insert({
        lead_id: leadId,
        from: lead.pipeline_stage,
        to: normalizedStage,
        changed_at: new Date().toISOString(),
        changed_by_user_id: changedBy,
        changed_by_name: changedByName,
        source_table: tableName,
        notes: ''
      });

    if (logError) {
      console.error('❌ Failed to log stage change:', logError.message);
    }

  };



  const updateLeadAssignment = async (leadId: string, userId: string | null) => {
    const supabase = createClient();


    const { error } = await supabase
      .from('lead_assessment_reports')
      .update({
        assigned_to: userId,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId);

    if (error) {
      throw new Error(`Error assigning lead: ${error.message}`);
    }
  };

  const deleteLead = async (leadId: string) => {
    const supabase = createClient();

    const { error } = await supabase
      .from('lead_assessment_reports')
      .delete()
      .eq('id', leadId);

    if (error) {
      throw new Error(`Error deleting lead: ${error.message}`);
    }
  };

  const convertLeadToCustomer = async (lead: LeadData) => {
    const supabase = createClient();

    // Start a transaction
    const { error: conversionError } = await supabase.rpc('convert_lead_to_customer', {
      p_lead_id: lead.id,
      p_customer_name: lead.name,
      p_customer_email: lead.email,
      p_customer_phone: lead.phone,
      p_customer_company: lead.company
    });

    if (conversionError) {
      throw new Error(`Error converting lead: ${conversionError.message}`);
    }
  };

  const addInteraction = async (
    leadId: string,
    type: 'call' | 'email' | 'meeting' | 'note',
    notes: string
  ) => {
    const supabase = createClient();

    const { error } = await supabase
      .from('lead_interactions')
      .insert({
        lead_id: leadId,
        type,
        notes,
        created_at: new Date().toISOString()
      });

    if (error) {
      throw new Error(`Error adding interaction: ${error.message}`);
    }
  };


  const updateLead = async (leadId: string, updates: Partial<LeadData>) => {
  const supabase = createClient();

  // ✅ Fetch source_table from unified_leads
  const { data: meta, error: metaError } = await supabase
    .from('unified_leads')
    .select('source_table')
    .eq('id', leadId)
    .single();

  if (metaError || !meta) {
    console.error('❌ Could not resolve source_table:', metaError?.message);
    throw new Error('Failed to resolve source table');
  }

  const tableName = meta.source_table || 'lead_assessment_reports';

  const { error } = await supabase
    .from(tableName)
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', leadId);

  if (error) {
    console.error('❌ Failed to update lead:', error.message);
    throw new Error('Lead update failed');
  }
};



  return {
    updateLeadStage,
    updateLeadAssignment,
    deleteLead,
    convertLeadToCustomer,
    addInteraction,
    updateLead
  };
};
