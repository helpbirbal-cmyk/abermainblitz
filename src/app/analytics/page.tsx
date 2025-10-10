// src/app/analytics/page.tsx
import { createClient } from '@supabase/supabase-js';
import { AnalyticsClient } from './AnalyticsClient';
import { requireAuth } from '@/lib/auth';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export default async function AnalyticsPage() {

  // This will redirect to login if not authenticated
   await requireAuth();


  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get leads data for analytics
  const { data: leads } = await supabase
    .from('lead_assessment_reports')
    .select('status, timeline, source, created_at');

  // Get interactions data
  const { data: interactions } = await supabase
    .from('lead_interactions')
    .select('interaction_type, interaction_date')
    .order('interaction_date', { ascending: false })
    .limit(100);

  return <AnalyticsClient leads={leads || []} interactions={interactions || []} />;
}
