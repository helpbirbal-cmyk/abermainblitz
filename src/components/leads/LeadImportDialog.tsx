// src/components/leads/LeadImportDialog.tsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Table, TableHead, TableRow,
  TableCell, TableBody, Alert
} from '@mui/material';
import { useState , useRef} from 'react';
import Papa from 'papaparse';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { FieldMapper } from '@/components/leads/FieldMapper';

type LeadImportDialogProps = {
  open: boolean;
  onClose: () => void;
  onImport: (leads: Record<string, any>[]) => void;
};

export function LeadImportDialog({ open, onClose, onImport }: LeadImportDialogProps) {
  const [rows, setRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const knownFields = ['name', 'email', 'company', 'lead_score', 'source', 'lead_type', 'assigned_to', 'created_at'];

  function autoMapHeaders(headers: string[]) {
    const mapping: Record<string, string> = {};

    headers.forEach((header) => {
      const normalized = header.trim().toLowerCase();
      const match = knownFields.find((field) => normalized.includes(field));
      if (match) mapping[header] = match;
    });

    return mapping;
  }

  function detectMalformedRows(rows: any[], headers: string[]) {
    return rows.filter((row) => {
      return headers.some((h) => !(h in row) || row[h] === undefined || row[h] === '');
    });
  }

  const malformed = detectMalformedRows(rows, headers);

  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      quoteChar: '"',
      complete: (results) => {
        const parsedRows = results.data as any[];
        const headers = Object.keys(parsedRows[0] || {});
        setHeaders(headers);
        setRows(parsedRows);

        const autoMapped = autoMapHeaders(headers);
        setMapping(autoMapped);
        setConfirmed(true);

        console.log('Parsed rows:', parsedRows);
        console.log('Auto-mapped fields:', autoMapped);
      }
    });
  };


  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const transformRows = () => {
    return rows
      .filter((row) => !malformed.includes(row))
      .map((row) => {
        const mappedRow: Record<string, any> = {};
        Object.entries(mapping).forEach(([csvHeader, crmField]) => {
          mappedRow[crmField] = row[csvHeader];
        });
        return mappedRow;
      });
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Leads from CSV</DialogTitle>
      <DialogContent>
        {rows.length === 0 ? (
          <Box
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <UploadFileIcon fontSize="large" />
            <Typography variant="body1" mt={2}>
              Drag and drop a CSV file here, or click to browse.
            </Typography>
            <input
                type="file"
                accept=".csv"
                hidden
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFile(e.target.files[0]);
                }}
              />

          </Box>
        ) : (
          <>
            {!confirmed && headers.length > 0 && (
              <FieldMapper
                headers={headers}
                onMap={(m) => {
                  setMapping(m);
                  setConfirmed(true);
                }}
              />
            )}

            <Box mt={2}>
              {malformed.length > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {malformed.length} row(s) appear malformed or incomplete. They will be skipped during import.
                </Alert>
              )}

              <Typography variant="subtitle2" gutterBottom>
                Preview ({rows.length} rows)
              </Typography>
              <Table size="small">
              <TableHead>

                <TableRow>

                  {headers.map((h) => (
                    <TableCell key={h}>
                      {h}
                      {mapping[h] && (
                        <Typography variant="caption" color="primary">
                          → {mapping[h]}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(0, 5).map((row, i) => (
                  <TableRow key={i}>
                    {headers.map((h) => (
                      <TableCell key={h}>{row[h]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            const transformed = transformRows();
            onImport(transformed);
            onClose();
          }}
          disabled={!confirmed}
          variant="contained"
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}
