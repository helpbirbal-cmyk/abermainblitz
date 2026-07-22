// src/hooks/useRealtimePipeline.tsx
import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function useRealtimePipeline(orgId: string, reload: () => void) {
  const supabase = createClient();
  const reloadTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!orgId) return;

    const channel = supabase.channel(`pipeline-${orgId}`);

    const handleChange = () => {
      // Debounce rapid changes
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
      reloadTimeoutRef.current = setTimeout(() => {
        console.log('🔄 Realtime update detected, reloading data...');
        reload();
      }, 500); // Wait 500ms for multiple changes
    };

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lead_reports',
          filter: `organization_id=eq.${orgId}`
        },
        handleChange
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lead_assessment_reports',
          filter: `organization_id=eq.${orgId}`
        },
        handleChange
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime pipeline subscription active for org:', orgId);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime pipeline subscription failed');
        }
      });

    return () => {
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
      channel.unsubscribe();
    };
  }, [orgId, reload, supabase]);
}
