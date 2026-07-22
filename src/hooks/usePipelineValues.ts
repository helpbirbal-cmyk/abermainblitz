// hooks/usePipelineValues.ts
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface PipelineStageValue {
  id: string;
  organization_id: string | null;
  stage_name: string;
  probability_percentage: number;
  created_at: string;
  updated_at: string;
}

interface UsePipelineValuesProps {
  organizationId?: string;
  averageDealSize?: number; // User-set average deal value
}

export function usePipelineValues({ organizationId, averageDealSize = 100000 }: UsePipelineValuesProps) {
  const [stageValues, setStageValues] = useState<PipelineStageValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [dealSize, setDealSize] = useState(averageDealSize);

  useEffect(() => {
    if (organizationId) {
      loadPipelineValues();
    } else {
      // Load default values if no organization
      loadDefaultValues();
    }
  }, [organizationId]);

  const loadPipelineValues = async () => {
    if (!organizationId) return;

    setLoading(true);
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('pipeline_stage_values')
        .select('*')
        .or(`organization_id.eq.${organizationId},organization_id.is.null`)
        .order('probability_percentage', { ascending: true });

      if (error) throw error;

      setStageValues(data || []);
    } catch (error) {
      console.error('Error loading pipeline values:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultValues = () => {
      // Set default stage values when no organization
      const defaultStages: PipelineStageValue[] = [
        { id: '1', organization_id: null, stage_name: 'new', probability_percentage: 10, created_at: '', updated_at: '' },
        { id: '2', organization_id: null, stage_name: 'contacted', probability_percentage: 25, created_at: '', updated_at: '' },
        { id: '3', organization_id: null, stage_name: 'qualified', probability_percentage: 50, created_at: '', updated_at: '' },
        { id: '4', organization_id: null, stage_name: 'proposal', probability_percentage: 75, created_at: '', updated_at: '' },
        { id: '5', organization_id: null, stage_name: 'negotiation', probability_percentage: 90, created_at: '', updated_at: '' },
        { id: '6', organization_id: null, stage_name: 'closed_won', probability_percentage: 100, created_at: '', updated_at: '' },
        { id: '7', organization_id: null, stage_name: 'closed_lost', probability_percentage: 0, created_at: '', updated_at: '' },
      ];
      setStageValues(defaultStages);
      setLoading(false);
    };

  // In hooks/usePipelineValues.ts - update getStageValue function
  const getStageValue = (stageName: string): number => {
    // Add safety check for undefined/null stage names
    if (!stageName || typeof stageName !== 'string') {
      console.warn('Invalid stage name:', stageName);
      return (10 / 100) * dealSize; // Default to 10% for invalid stages
    }

    const normalizedStageName = stageName.toLowerCase().trim();
    const stage = stageValues.find(s =>
      s.stage_name.toLowerCase() === normalizedStageName
    );

    if (!stage) {
      // Fallback to default percentages if not found
      const defaultPercentages: Record<string, number> = {
        'new': 10,
        'contacted': 25,
        'qualified': 50,
        'proposal': 75,
        'negotiation': 90,
        'closed_won': 100,
        'closed_lost': 0,
        'converted': 100 // Add any other possible stage names
      };
      return (defaultPercentages[normalizedStageName] || 10) / 100 * dealSize;
    }

    return (stage.probability_percentage / 100) * dealSize;
  };

  const updateStageValue = async (stageName: string, percentage: number) => {
    if (!organizationId) return;

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('pipeline_stage_values')
        .upsert({
          organization_id: organizationId,
          stage_name: stageName,
          probability_percentage: percentage,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      await loadPipelineValues(); // Reload values
    } catch (error) {
      console.error('Error updating pipeline value:', error);
      throw error;
    }
  };

  const updateDealSize = (newDealSize: number) => {
    setDealSize(newDealSize);
  };

  return {
    stageValues,
    dealSize,
    setDealSize: updateDealSize,
    getStageValue,
    updateStageValue,
    loading
  };
}
