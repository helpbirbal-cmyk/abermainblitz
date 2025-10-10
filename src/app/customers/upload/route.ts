import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export async function POST(request: Request) {
  try {
    const { customers } = await request.json();

    if (!customers || !Array.isArray(customers)) {
      return NextResponse.json(
        { error: 'Invalid customers data' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let imported = 0;
    const errors: string[] = [];

    for (const customer of customers) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .insert([{
            name: customer.name,
            email: customer.email || null,
            phone: customer.phone || null,
            company: customer.company || null,
            industry: customer.industry || null,
            website: customer.website || null,
            status: customer.status || 'active',
            customer_type: customer.customer_type || 'business'
          }])
          .select()
          .single();

        if (error) {
          if (error.code === '23505') { // Unique violation
            errors.push(`Duplicate email: ${customer.email}`);
          } else {
            errors.push(`Failed to import ${customer.name}: ${error.message}`);
          }
        } else {
          imported++;
        }
      } catch (error) {
        errors.push(`Failed to import ${customer.name}`);
      }
    }

    return NextResponse.json({
      imported,
      total: customers.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
