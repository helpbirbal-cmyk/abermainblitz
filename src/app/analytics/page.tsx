// src/app/analytics/page.tsx
import { createClient } from '@supabase/supabase-js';
import { AnalyticsClient } from './AnalyticsClient';
import { requireAuth } from '@/lib/auth';
import { Suspense } from 'react';
//import { AnalyticsLoading } from './AnalyticsLoading';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

// Loading component
function AnalyticsLoading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div className="spinner"></div>
      <p>Loading analytics dashboard...</p>
    </div>
  );
}

export default async function AnalyticsPage() {
  // Show loading while auth check and data fetching happens
  await requireAuth();

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get leads data for analytics
  const { data: leads } = await supabase
    .from('lead_assessment_reports')
    .select('status, timeline, source, created_at')
    .order('created_at', { ascending: false });

  // Get interactions data
  const { data: interactions } = await supabase
    .from('lead_interactions')
    .select('interaction_type, interaction_date')
    .order('interaction_date', { ascending: false })
    .limit(500);

  return <AnalyticsClient leads={leads || []} interactions={interactions || []} />;
}
