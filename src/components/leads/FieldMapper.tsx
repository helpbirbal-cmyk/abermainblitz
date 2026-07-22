import { useState } from 'react';
import { Box, FormControl,Select,Button,InputLabel, MenuItem } from '@mui/material';

export function FieldMapper({
        headers,
        onMap
      }: {
        headers: string[];
        onMap: (mapping: Record<string, string>) => void;
      }) {


  const crmFields = ['name', 'email', 'company', 'score', 'source', 'lead_type'];
  const [mapping, setMapping] = useState<Record<string, string>>({});

  return (
    <Box>
      {crmFields.map((field) => (
        <FormControl key={field} fullWidth margin="dense">
          <InputLabel>{field}</InputLabel>
          <Select
            value={mapping[field] || ''}
            onChange={(e) => setMapping(m => ({ ...m, [field]: e.target.value }))}
          >
            <MenuItem value="">None</MenuItem>
            {headers.map(h => (
              <MenuItem key={h} value={h}>{h}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
      <Button onClick={() => onMap(mapping)}>Confirm Mapping</Button>
    </Box>
  );
}
