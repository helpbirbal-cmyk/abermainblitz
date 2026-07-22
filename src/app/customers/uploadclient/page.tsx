// src/app/customers/uploadclient/page.tsx
'use client';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { Upload, Download, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export default function UploadCustomersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError('');
        setResult(null);
      } else {
        setError('Please select a CSV file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Read the CSV file
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      // Parse CSV (simple implementation)
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const customers = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const customer: any = {};
        headers.forEach((header, index) => {
          customer[header] = values[index] || '';
        });
        return customer;
      }).filter(customer => customer.name); // Only include customers with names

      if (customers.length === 0) {
        setError('No valid customer data found in CSV');
        setUploading(false);
        return;
      }

      // Make POST request to your API
      const response = await fetch('/api/customers/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customers: customers
        }),
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      setResult(result);

    } catch (err: any) {
      setError(err.message || 'Failed to upload customers');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `name,email,phone,company,industry,website,status,customer_type
John Doe,john@example.com,+1234567890,Acme Inc,Technology,https://acme.com,active,enterprise
Jane Smith,jane@example.com,+0987654321,Startup Co,Finance,https://startup.co,prospect,sme
Bob Johnson,bob@example.com,+1122334455,Local Store,Retail,,lead,individual`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth={false} sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/customers"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to Customers
        </Button>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Bulk Upload
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Upload a CSV file to import multiple customers in one go
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Upload Section */}
        <Grid size={{ xs: 12, md: 12 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Upload CSV File
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {result && (
                <Alert
                  severity={result.errors ? "warning" : "success"}
                  sx={{ mb: 3 }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Imported {result.imported} out of {result.total} customers
                  </Typography>
                  {result.errors && (
                    <Typography variant="body2">
                      {result.errors.length} error(s) occurred
                    </Typography>
                  )}
                </Alert>
              )}

              <Box sx={{ mb: 3 }}>
                <input
                  accept=".csv"
                  style={{ display: 'none' }}
                  id="csv-upload"
                  type="file"
                  onChange={handleFileSelect}
                />
                <label htmlFor="csv-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Upload />}
                    sx={{ mr: 2 }}
                  >
                    Select CSV File
                  </Button>
                </label>

                {file && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </Typography>
                )}
              </Box>

              {uploading && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Uploading and processing customers...
                  </Typography>
                  <LinearProgress />
                </Box>
              )}

              <Button
                variant="contained"
                startIcon={<Upload />}
                onClick={handleUpload}
                disabled={!file || uploading}
                sx={{ mr: 2 }}
              >
                {uploading ? 'Uploading...' : 'Upload Customers'}
              </Button>

              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={downloadTemplate}
              >
                Download Template
              </Button>
            </CardContent>
          </Card>

          {/* Show import results */}
          {result && result.errors && result.errors.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom color="error">
                  Import Errors ({result.errors.length})
                </Typography>
                <List dense>
                  {result.errors.slice(0, 10).map((error: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={error} />
                    </ListItem>
                  ))}
                  {result.errors.length > 10 && (
                    <ListItem>
                      <ListItemText
                        primary={`... and ${result.errors.length - 10} more errors`}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Instructions Section */}
        <Grid size={{ xs: 12, md: 12 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                CSV Format Instructions
              </Typography>

              <Typography variant="body2" paragraph>
                Your CSV file should include these columns (first row should be headers):
              </Typography>

              <List dense>
                <ListItem>
                  <Chip label="name" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Customer name (required)</Typography>
                </ListItem>
                <ListItem>
                  <Chip label="email" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Email address</Typography>
                </ListItem>
                <ListItem>
                  <Chip label="phone" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Phone number</Typography>
                </ListItem>
                <ListItem>
                  <Chip label="company" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Company name</Typography>
                </ListItem>
                <ListItem>
                  <Chip label="industry" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Industry</Typography>
                </ListItem>
                <ListItem>
                  <Chip label="website" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Website URL</Typography>
                </ListItem>
                <ListItem>
                  <Chip label="status" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">active/inactive/prospect/lead</Typography>
                </ListItem>
                <ListItem>
                  <Chip label="customer_type" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">enterprise/sme/startup/individual</Typography>
                </ListItem>
              </List>

              <Typography variant="body2" color="text.secondary">
                Download the template to get started with the correct format.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
