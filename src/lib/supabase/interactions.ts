// src/lib/supabase/interactions.ts

import { createClient } from '@/lib/supabase/client';

const supabase = createClient();


export async function fetchInteractionsWithCreator(leadId: string) {
  const { data, error } = await supabase
    .from('interaction_with_creator')
    .select('*')
    .eq('related_to_type', 'lead')
    .eq('related_to_id', leadId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch interactions: ${error.message}`);
  return data;
}

function isValidUUID(value: string | null | undefined): boolean {
  return typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function logInteraction(
  relatedToId: string,
  organizationId: string | null,
  createdBy: string | null,
  assignedTo: string | null,
  interaction: {
    type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'follow_up' | 'note';
    subject: string;
    description?: string;
    outcome?: string;
    scheduledAt?: string; // ISO string
    completedAt?: string; // ISO string
    durationMinutes?: number;
  }
) {

  const safeOrgId = isValidUUID(organizationId) ? organizationId : null;
  const safeCreatedBy = isValidUUID(createdBy) ? createdBy : null;
  const safeAssignedTo = isValidUUID(assignedTo) ? assignedTo : null;


  console.log('🧪 Logging interaction with:', {
    relatedToId,
    organizationId,
    createdBy,
    assignedTo
  });


  const { error } = await supabase.from('interactions').insert([
  {
    organization_id: safeOrgId,
    related_to_type: 'lead',
    related_to_id: relatedToId,
    interaction_type: interaction.type,
    subject: interaction.subject,
    description: interaction.description || null,
    outcome: interaction.outcome || null,
    scheduled_at: interaction.scheduledAt || null,
    completed_at: interaction.completedAt || null,
    duration_minutes: interaction.durationMinutes || null,
    assigned_to: safeAssignedTo,
    created_by: safeCreatedBy,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]);


  if (error) {
    console.error('Failed to log interaction:', error.message);
    throw error;
  }
}
export async function fetchInteractionsForLead(leadId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('interactions')
    .select(`
        id,
        interaction_type,
        subject,
        description,
        created_at,
        created_by,
        creator_name,
        creator_email,
        users:created_by (
          user_metadata
        )
      `)
    .eq('related_to_type', 'lead')
    .eq('related_to_id', leadId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch interactions:', error.message);
    return [];
  }

  return data.map(i => ({
    id: i.id,
    type: i.interaction_type,
    summary: i.subject,
    timestamp: i.created_at,
    created_by: i.created_by,
    user_name: i.users?.[0]?.user_metadata?.full_name ?? 'Unknown'
  }));
}
