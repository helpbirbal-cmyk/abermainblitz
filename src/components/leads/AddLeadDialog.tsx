// src/components/leads/AddLeadDialog.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { createClient } from '@/lib/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

type PipelineStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
type LeadType = 'assessment' | 'calculator';


interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  project_type: string;
  timeline: string;
  message: string;
  source: string;
  demo_type: string;
  status: string;
  assigned_to: string | null;
  lead_score: number;
  budget: number | null;  // Updated type to allow both number and null
  probability: number;
  pipeline_stage: PipelineStage;
  lead_type: 'assessment' | 'calculator';
}


export interface AddLeadDialogProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  onLeadAdded: () => Promise<void>;
}

export const AddLeadDialog = ({
  open,
  onClose,
  organizationId,
  onLeadAdded
}: AddLeadDialogProps) => {
  const initialFormState: FormData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    project_type: '',
    timeline: '',
    message: '',
    source: 'manual',
    demo_type: '',
    status: 'New',
    assigned_to: null,
    lead_score: 0,
    budget: null,
    probability: 0,
    pipeline_stage: 'new',
    lead_type: 'assessment'
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData(prev => ({
        ...prev,
        budget: value === '' ? null : Number(value)
      }));
    };

  // Get current user on component mount
   useEffect(() => {
     const fetchUser = async () => {
       const supabase = createClient();
       const { data: { user } } = await supabase.auth.getUser();
       setCurrentUser(user?.id || null);
     };
     fetchUser();
   }, []);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
  if (!currentUser) {
        setError('User session not found. Please log in again.');
        return;
      }

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const now = new Date().toISOString();

      if (formData.lead_type === 'assessment') {
        // Insert into lead_assessment_reports
        const { error: assessmentError } = await supabase
          .from('lead_assessment_reports')
          .insert({
            name: formData.name,
            email: formData.email,
            company: formData.company,
            phone: formData.phone,
            project_type: formData.project_type,
            timeline: formData.timeline,
            message: formData.message,
            source: formData.source,
            demo_type: formData.demo_type,
            status: formData.status,
            organization_id: organizationId,
            assigned_to: formData.assigned_to,
            lead_score: formData.lead_score,
            budget: formData.budget,
            probability: formData.probability,
            pipeline_stage: formData.pipeline_stage,
            created_at: now,
            created_by: 'helpbirbal-cmyk',  // Using provided user login
            updated_at: now,
            updated_by: 'helpbirbal-cmyk',  // Using provided user login

          });

        if (assessmentError) throw assessmentError;
      } else {
        // Insert into lead_reports
        const { error: reportError } = await supabase
          .from('lead_reports')
          .insert({
            name: formData.name,
            email: formData.email,
            company: formData.company,
            phone: formData.phone,
            source: 'calculator',
            status: formData.status,
            organization_id: organizationId,
            assigned_to: formData.assigned_to,
            lead_score: formData.lead_score,
            probability: formData.probability,
            pipeline_stage: formData.pipeline_stage,
            created_at: now,
            created_by: 'helpbirbal-cmyk',  // Using provided user login
              updated_at: now,
              updated_by: 'helpbirbal-cmyk',  // Using provided user login

            calculator_results_data: null // This would be populated when coming from actual calculator
          });

        if (reportError) throw reportError;
      }

      await onLeadAdded();
      onClose();
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        project_type: '',
        timeline: '',
        message: '',
        source: 'manual',
        demo_type: '',
        status: 'New',
        assigned_to: null,
        lead_score: 0,
        budget: null,
        probability: 0,
        pipeline_stage: 'new',
        lead_type: 'assessment'
      });
    } catch (err) {
    console.error('Error adding lead:', err);
    // Properly type check the error
    if (err instanceof Error) {
      setError(err.message);
    } else if ((err as PostgrestError)?.message) {
      setError((err as PostgrestError).message);
    } else {
      setError('Failed to add lead. Please try again.');
    }
  } finally {
    setSubmitting(false);
  }
};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Lead</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth>
            <InputLabel>Lead Type *</InputLabel>
            <Select
              value={formData.lead_type}
              label="Lead Type *"
              onChange={(e) => setFormData(prev => ({
                ...prev,
                lead_type: e.target.value as 'assessment' | 'calculator'
              }))}
              required
            >
              <MenuItem value="assessment">Assessment</MenuItem>
              <MenuItem value="calculator">Calculator</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Name *"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            fullWidth
            required
          />

          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            fullWidth
          />

          <TextField
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            fullWidth
          />

          <TextField
            label="Company"
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            fullWidth
          />

          {formData.lead_type === 'assessment' && (
            <>
              <TextField
                label="Project Type"
                value={formData.project_type}
                onChange={(e) => setFormData(prev => ({ ...prev, project_type: e.target.value }))}
                fullWidth
              />

              <TextField
                label="Timeline"
                value={formData.timeline}
                onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                fullWidth
              />

              <TextField
                label="Message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                fullWidth
                multiline
                rows={3}
              />

              <TextField
                label="Demo Type"
                value={formData.demo_type}
                onChange={(e) => setFormData(prev => ({ ...prev, demo_type: e.target.value }))}
                fullWidth
              />
            </>
          )}

          <FormControl fullWidth>
            <InputLabel>Pipeline Stage</InputLabel>
            <Select
              value={formData.pipeline_stage}
              label="Pipeline Stage"
              onChange={(e) => setFormData(prev => ({ ...prev, pipeline_stage: e.target.value }))}
            >
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="qualified">Qualified</MenuItem>
              <MenuItem value="proposal">Proposal</MenuItem>
              <MenuItem value="negotiation">Negotiation</MenuItem>
              <MenuItem value="closed_won">Closed Won</MenuItem>
              <MenuItem value="closed_lost">Closed Lost</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Lead Score</InputLabel>
            <Select
              value={formData.lead_score}
              label="Lead Score"
              onChange={(e) => setFormData(prev => ({
                ...prev,
                lead_score: Number(e.target.value)
              }))}
            >
              <MenuItem value={0}>0 - Cold Lead</MenuItem>
              <MenuItem value={25}>25 - Potential Interest</MenuItem>
              <MenuItem value={50}>50 - Moderate Interest</MenuItem>
              <MenuItem value={75}>75 - High Interest</MenuItem>
              <MenuItem value={100}>100 - Hot Lead</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Probability (%)"
            type="number"
            value={formData.probability}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              probability: Math.min(100, Math.max(0, Number(e.target.value)))
            }))}
            fullWidth
            InputProps={{
              inputProps: { min: 0, max: 100 }
            }}
          />

          {formData.lead_type === 'assessment' && (
                <TextField
                  label="Budget"
                  type="number"
                  value={formData.budget ?? ''}
                  onChange={handleBudgetChange}
                  fullWidth
                  InputProps={{
                    inputProps: {
                      min: 0,
                      step: "0.01"
                    }
                  }}
                />
              )}

        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !formData.name.trim()}
        >
          {submitting ? 'Adding...' : 'Add Lead'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
