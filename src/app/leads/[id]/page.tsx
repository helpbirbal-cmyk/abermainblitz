// src/app/leads/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { LeadBriefPanel } from '@/components/leads/LeadBriefPanel';
import { fetchBrief } from '@/lib/fetchBrief';
import type { Brief } from '@/types';  // ✅ import unified Brief type from types

export default function LeadPage({ params }: { params: { id: string } }) {
  const [brief, setBrief] = useState<Brief | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBrief = async (force = false) => {
    setLoading(true);
    try {
      const { brief, updated_at } = await fetchBrief(params.id, force);
      setBrief(brief); // ✅ now matches Brief type
      setUpdatedAt(updated_at ?? null);
      setError(null);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load brief');
      setBrief(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrief();
  }, [params.id]);

  return (
    <LeadBriefPanel
      brief={brief}
      updatedAt={updatedAt}
      error={error}
      loading={loading}
      onRetry={() => loadBrief(true)}
    />
  );
}
