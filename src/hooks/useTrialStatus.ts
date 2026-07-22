// hooks/useTrialStatus.ts
'use client';

import { useTenant } from '@/lib/supabase/tenant-context';
import { useMemo } from 'react';

export function useTrialStatus() {
  const { organization } = useTenant();

  return useMemo(() => {
    if (!organization) return null;

    const now = new Date();
    const trialEnds = organization.trial_ends_at ? new Date(organization.trial_ends_at) : null;
    const isTrial = organization.plan_type === 'trial';
    const isTrialActive = isTrial && trialEnds && trialEnds > now;
    const daysRemaining = trialEnds ? Math.ceil((trialEnds.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    return {
      isTrial,
      isTrialActive,
      trialEnds,
      daysRemaining,
      isExpired: isTrial && trialEnds && trialEnds <= now,
      canExtend: isTrial && daysRemaining < 7 // Allow extension when less than 7 days left
    };
  }, [organization]);
}
