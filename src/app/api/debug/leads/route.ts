import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🔍 Checking Supabase connection...');

    // First, let's check if the table exists by getting row count
    const { count, error: countError } = await supabase
      .from('lead_assessment_reports')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return NextResponse.json(
        { error: `Table error: ${countError.message}` },
        { status: 500 }
      );
    }

    console.log('✅ Table exists. Row count:', count);

    // Now get all leads with their IDs
    const { data: leads, error } = await supabase
      .from('lead_assessment_reports')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: `Query error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      table: 'lead_assessment_reports',
      totalLeads: count,
      leads: leads || []
    });

  } catch (error: any) {
    console.error('❌ Debug error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
