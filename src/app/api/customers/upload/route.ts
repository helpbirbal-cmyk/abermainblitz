import { NextResponse } from 'next/server';

export async function GET() {
  const csv = `name,email,phone,company,industry,website,status,customer_type
John Doe,john@example.com,555-0101,Acme Inc,Technology,https://acme.com,active,business
Jane Smith,jane@example.com,555-0102,Global Corp,Finance,https://global.com,prospect,business
Bob Johnson,bob@example.com,555-0103,Startup LLC,Healthcare,https://startup.com,active,business`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="customers-template.csv"',
    },
  });
}
