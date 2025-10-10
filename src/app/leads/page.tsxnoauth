import { createClient } from '@supabase/supabase-js';
import { LeadsClient } from './LeadsClient';

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
  created_at?: string;
}

export default async function LeadsPage() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: leads, error } = await supabase
    .from('lead_assessment_reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    throw new Error('Failed to fetch leads');
  }

  return <LeadsClient leads={leads || []} />;
}
