'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CSVRow {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  website: string;
  status: string;
  customer_type: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<CSVRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check if it's a CSV file
    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setMessage({ text: 'Please select a CSV file', type: 'error' });
      return;
    }

    setFile(selectedFile);
    parseCSV(selectedFile);
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          setMessage({ text: 'CSV file is empty or has no data rows', type: 'error' });
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));

        const data: CSVRow[] = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          // Handle quoted values and commas within quotes
          const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(v => v.trim().replace(/^"|"$/g, '')) || [];

          const row: any = {};

          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });

          // Map common column names
          const mappedRow: CSVRow = {
            name: row.name || row.company || row.customer || 'Unknown Customer',
            email: row.email || row['email address'] || '',
            phone: row.phone || row.telephone || row.mobile || row.contact || '',
            company: row.company || row.organization || row.business || '',
            industry: row.industry || row.sector || row.business_type || '',
            website: row.website || row.url || row.web || '',
            status: (row.status || 'active').toLowerCase(),
            customer_type: (row.customer_type || row.type || 'business').toLowerCase()
          };

          // Validate required fields
          if (!mappedRow.name || mappedRow.name === 'Unknown Customer') {
            setMessage({ text: `Row ${i+1}: Name is required`, type: 'error' });
            return;
          }

          data.push(mappedRow);
        }

        setPreview(data);
        setMessage(null);
      } catch (error) {
        setMessage({ text: 'Error parsing CSV file. Please check the format.', type: 'error' });
        console.error('CSV parsing error:', error);
      }
    };

    reader.onerror = () => {
      setMessage({ text: 'Error reading file', type: 'error' });
    };

    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!file || preview.length === 0) {
      setMessage({ text: 'Please select a valid CSV file', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/customers/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customers: preview }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload customers');
      }

      setMessage({
        text: `Successfully imported ${data.imported} out of ${data.total} customers${data.errors ? ` (${data.errors.length} errors)` : ''}`,
        type: data.imported > 0 ? 'success' : 'error'
      });

      if (data.errors && data.errors.length > 0) {
        console.log('Import errors:', data.errors);
      }

      if (data.imported > 0) {
        setTimeout(() => {
          router.push('/customers');
        }, 3000);
      }

    } catch (error: any) {
      console.error('Error uploading customers:', error);
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/customers"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Customers
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">Import Customers</h1>
          <p className="text-lg text-gray-600 mt-2">
            Upload a CSV file to import multiple customers at once
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer block"
            >
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">
                {file ? file.name : 'Choose CSV file'}
              </p>
              <p className="text-gray-500">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-400 mt-2">
                CSV files only
              </p>
            </label>
          </div>

          {/* CSV Template Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">CSV Format</h3>
            <p className="text-blue-800 text-sm mb-2">
              Your CSV should include these columns: <strong>name, email, phone, company, industry, website, status, customer_type</strong>
            </p>
            <p className="text-blue-700 text-xs mb-2">
              Status: active, inactive, or prospect<br />
              Customer Type: business or individual
            </p>
            <a
              href="/api/customers/template"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download template
            </a>
          </div>
        </div>

        {/* Preview Section */}
        {preview.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Preview ({preview.length} customers)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {preview.slice(0, 10).map((customer, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm">{customer.name}</td>
                      <td className="px-4 py-2 text-sm">{customer.email || '-'}</td>
                      <td className="px-4 py-2 text-sm">{customer.company || '-'}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.status === 'active' ? 'bg-green-100 text-green-800' :
                          customer.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 10 && (
                <p className="text-sm text-gray-500 mt-2">
                  ... and {preview.length - 10} more customers
                </p>
              )}
            </div>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Actions */}
        {preview.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setFile(null);
                  setPreview([]);
                  setMessage(null);
                  // Clear file input
                  const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
                  if (fileInput) fileInput.value = '';
                }}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Importing...' : `Import ${preview.length} Customers`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
