import { createClient } from '@supabase/supabase-js';
import { LeadDetailClient } from './LeadDetailClient';
import { notFound } from 'next/navigation';

// Server-side only - uses service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  timeline: string;
  message: string;
  source: string;
  demoType: string;
  created_at: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: PageProps) {
  // Await the params in Next.js 14
  const { id } = await params;

  console.log('🔍 LeadDetailPage: Fetching lead with ID:', id);

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { data: lead, error } = await supabase
      .from('lead_assessment_reports')
      .select('*')
      .eq('id', id)
      .single();

    console.log('🔍 Query result for ID', id, ':', {
      leadFound: !!lead,
      error: error?.message
    });

    if (error) {
      console.error('❌ Supabase error:', error);

      if (error.code === 'PGRST116') {
        console.log('❌ Lead not found in database');
        notFound();
      }

      throw new Error(`Database error: ${error.message}`);
    }

    if (!lead) {
      console.log('❌ No lead data returned');
      notFound();
    }

    console.log('✅ Lead found:', lead.name);
    return <LeadDetailClient lead={lead} />;

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    notFound();
  }
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: leads } = await supabase
    .from('lead_assessment_reports')
    .select('id');

  return (leads || []).map((lead) => ({
    id: lead.id,
  }));
}
