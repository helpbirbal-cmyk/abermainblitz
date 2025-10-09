import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export async function POST(request: Request) {
  try {
    const { lead_id, interaction_type, description, notes } = await request.json();

    if (!lead_id || !interaction_type || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: lead_id, interaction_type, description' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('lead_interactions')
      .insert([
        {
          lead_id,
          interaction_type,
          description,
          notes: notes || null,
          interaction_date: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating interaction:', error);
      return NextResponse.json(
        { error: `Failed to create interaction: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ interaction: data });

  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
