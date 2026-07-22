'use client';
import { useState } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  Typography,
  Box,
  Chip
} from '@mui/material';
import type { PipelineStage } from '@/types';

interface UpdateStageDialogProps {
  open: boolean;
  onClose: () => void;
  stages: PipelineStage[];
  selectedCount: number;
  onUpdate: (stageId: string) => Promise<void>;
}

export const UpdateStageDialog = ({
  open,
  onClose,
  stages,
  selectedCount,
  onUpdate
}: UpdateStageDialogProps) => {
  const [selectedStageId, setSelectedStageId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedStageId) {
      setError('Please select a stage');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onUpdate(selectedStageId);
      onClose();
    } catch (err) {
      console.error('Error updating stages:', err);
      setError('Failed to update stages. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Update Pipeline Stage</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Alert severity="info">
            You are about to update the stage for {selectedCount} lead{selectedCount !== 1 ? 's' : ''}.
          </Alert>

          <FormControl fullWidth>
            <InputLabel>New Stage</InputLabel>
            <Select
              value={selectedStageId}
              label="New Stage"
              onChange={(e) => setSelectedStageId(e.target.value)}
            >
              {stages.map((stage) => (
                <MenuItem key={stage.id} value={stage.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{stage.name}</Typography>
                    <Chip
                      label={`${stage.leads.length} leads`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedStageId && (
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Selected Stage Details
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Current Leads
                  </Typography>
                  <Typography variant="caption">
                    {stages.find(s => s.id === selectedStageId)?.leads.length || 0}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Probability
                  </Typography>
                  <Typography variant="caption">
                    {stages.find(s => s.id === selectedStageId)?.probability || 0}%
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !selectedStageId}
        >
          {submitting ? 'Updating...' : 'Update Stage'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
