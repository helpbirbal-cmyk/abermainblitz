import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

// GET - Fetch all customers
export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: customers, error } = await supabase
      .from('customers')
      .select(`
        *,
        contacts:contacts(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ customers });

  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: `Failed to fetch customers: ${error.message}` },
      { status: 500 }
    );
  }
}

// POST - Create new customer
export async function POST(request: Request) {
  try {
    const customerData = await request.json();

    if (!customerData.name) {
      return NextResponse.json(
        { error: 'Customer name is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('customers')
      .insert([{
        name: customerData.name,
        email: customerData.email || null,
        phone: customerData.phone || null,
        company: customerData.company || null,
        industry: customerData.industry || null,
        website: customerData.website || null,
        address: customerData.address || null,
        city: customerData.city || null,
        state: customerData.state || null,
        country: customerData.country || null,
        postal_code: customerData.postal_code || null,
        status: customerData.status || 'active',
        customer_type: customerData.customer_type || 'business',
        notes: customerData.notes || null
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'A customer with this email already exists' },
          { status: 400 }
        );
      }
      throw error;
    }

    return NextResponse.json({ customer: data });

  } catch (error: any) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: `Failed to create customer: ${error.message}` },
      { status: 500 }
    );
  }
}
