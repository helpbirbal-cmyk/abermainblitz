// src/app/leads/page.tsx - FIXED VERSION
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LeadsPipelineClient } from './LeadsPipelineClient';

export default async function LeadsPage() {
  const supabase = createClient();

  try {
    // Check authentication with better error handling
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('Auth issue, redirecting to login');
      redirect('/auth/login');
    }

    // Organizations are handled by TenantContext in the client component
    // No need to fetch or pass them as props

    return (
      <LeadsPipelineClient />
    );

  } catch (error) {
    console.error('Unexpected error in leads page:', error);
    redirect('/auth/login');
  }
}
