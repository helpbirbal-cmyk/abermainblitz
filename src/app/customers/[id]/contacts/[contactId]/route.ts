// src/app/api/customers/[id]/contacts/[contactId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; contactId: string } }
) {
  try {
    // Replace with your actual data fetching logic
    const contact = {
      id: params.contactId,
      name: 'Contact Name',
      email: 'contact@example.com',
      phone: '+1234567890',
      position: 'Manager',
      created_at: new Date().toISOString()
    };

    return NextResponse.json(contact);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; contactId: string } }
) {
  try {
    const body = await request.json();

    // Replace with your actual update logic
  //  console.log('Updating contact:', params.contactId, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}
