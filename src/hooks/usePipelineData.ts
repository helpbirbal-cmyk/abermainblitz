// src/hooks/usePipelineData.ts
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { LeadData, PipelineStage, TeamMember, FilterState } from '@/types';
//import { fetchInteractionsForLead } from '@/lib/supabase/interactions';
import { fetchInteractionsWithCreator } from '@/lib/supabase/interactions';

// Add interface for user profiles data structure
interface UserProfile {
  email: string;
  full_name: string;
}

interface OrganizationMemberWithProfile {
  user_id: string;
  role: string;
  user_profiles: UserProfile;
}


export const usePipelineData = (organizationId: string) => {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    source: 'all',
    leadType: 'all',
    scoreMin: 0,
    scoreMax: 100,
    dateRange: 'all',
    assignedTo: 'all',
    startDate: null,
    endDate:    null
  });

  // Load pipeline data (stages and leads)
  const loadPipelineData = async () => {
    if (!organizationId || loading) return;

    console.log('🔄 Loading pipeline for org:', organizationId);

    setLoading(true);
    try {
      const supabase = createClient();

      // Load stages
      const { data: stagesData } = await supabase
        .from('pipeline_stages')
        .select('id, name, stage_order, organization_id, probability, color') // ✅ Explicitly include `id`
        .or(`organization_id.eq.${organizationId},organization_id.is.null`)
        .order('stage_order');

      // Load leads from unified view
      const { data: unifiedLeads, error: leadsError } = await supabase
        .from('unified_leads')
        .select(`
          id,
          name,
          email,
          company,
          phone,
          status,
          pipeline_stage,
          lead_score,
          probability,
          assigned_to,
          created_at,
          created_by,
          lead_type,
          source,
          calculator_results_data,
          website_id,
          form_id,
          page_url,
          utm_source,
          utm_medium,
          utm_campaign,
          converted_to_customer_id,
          converted_at,
          organization_name,
          website_name,
          form_name,
          stage_changes
        `)
        .eq('organization_id', organizationId);

      if (leadsError) {
        console.error('❌ Error loading leads:', leadsError);
        return;
      }

    //  console.log('✅ Loaded stage IDs:', stagesData?.map(s => s.id || s.stage_id));


      // Transform unified leads to LeadData type
      const transformedLeads: LeadData[] = (unifiedLeads || []).map(lead => ({
       ...lead,
       lead_type: lead.lead_type || 'assessment' // Default to 'assessment' if undefined
      }));

      const enrichedLeads: LeadData[] = await Promise.all(
          transformedLeads.map(async (lead) => {
            const interactions = await fetchInteractionsWithCreator(lead.id);
            return {
              ...lead,
              interactions
            };
          })
        );


      if (stagesData) {
        const stagesWithLeads = stagesData.map(stage => {
          const slug = stage.name.toLowerCase().replace(/\s+/g, '_');
          const stageLeads = enrichedLeads.filter(lead => lead.pipeline_stage === slug);
          return { ...stage, slug, leads: stageLeads }; // ✅ Add slug here
        });

        setStages(stagesWithLeads);
        setLeads(enrichedLeads);
      }



    } catch (error) {
      console.error('Error in loadPipelineData:', error);
    } finally {
      setLoading(false);
    }

  };

  // Load team members
useEffect(() => {
  const loadTeamMembers = async () => {
    if (!organizationId) {
      console.log('❌ No organization selected');
      return;
    }

    try {
      const supabase = createClient();

      console.log('🔍 Loading team members for organization:', organizationId);

      // Try loading from the view first
      const { data, error } = await supabase
        .from('organization_members_with_profiles')
        .select(`
          user_id,
          role,
          email,
          full_name
        `)
        .eq('organization_id', organizationId);

      if (error) {
        console.error('❌ Error loading team members from view:', error);

        // Fallback: Try the base table with proper type annotation
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('organization_members')
          .select(`
            user_id,
            role,
            user_profiles:user_profiles (
              email,
              full_name
            )
          `)
          .eq('organization_id', organizationId) as {
            data: OrganizationMemberWithProfile[] | null;
            error: any;
          };

        if (fallbackError) {
          console.error('❌ Error loading team members from base table:', fallbackError);
          return;
        }

        console.log('👥 Loaded team members from base table:', fallbackData);

        const transformedMembers: TeamMember[] = (fallbackData || []).map(item => ({
          user_id: item.user_id,
          role: item.role,
          users: {
            email: item.user_profiles?.email || 'No email',
            user_metadata: {
              full_name: item.user_profiles?.full_name || 'Unknown User'
            }
          }
        }));

        setTeamMembers(transformedMembers);
        return;
      }

      console.log('👥 Loaded team members from view:', data);

      // Transform the data to match TeamMember interface
      const transformedMembers: TeamMember[] = (data || []).map(item => ({
        user_id: item.user_id,
        role: item.role,
        users: {
          email: item.email || 'No email',
          user_metadata: {
            full_name: item.full_name || 'Unknown User'
          }
        }
      }));

      setTeamMembers(transformedMembers);

    } catch (error) {
      console.error('❌ Error loading team members:', error);

      // Ultimate fallback - create current user as team member
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const currentUserMember: TeamMember = {
          user_id: user.id,
          role: 'admin',
          users: {
            email: user.email || 'current@user.com',
            user_metadata: {
              full_name: user.user_metadata?.full_name || 'You',
              name: user.user_metadata?.name || 'Current User'
            }
          }
        };
        console.log('👥 Using current user as fallback team member:', currentUserMember);
        setTeamMembers([currentUserMember]);
      }
    }
  };

  loadTeamMembers();
}, [organizationId]);

  // Load initial pipeline data
  useEffect(() => {
      if (!organizationId) return;
      loadPipelineData();
    }, [organizationId]);


  return {
    stages,
    leads,
    teamMembers,
    loading,
    filters,
    setFilters,
    reloadPipeline: loadPipelineData
  };
};

export default usePipelineData;
