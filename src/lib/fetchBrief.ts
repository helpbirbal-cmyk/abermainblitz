// src/lib/fetchBrief.ts
// src/lib/fetchBrief.ts
import type { Brief } from '@/types';

export async function fetchBrief(
  id: string,
  force = false
): Promise<{ brief: Brief; updated_at?: string }> {
  const url = `/api/perplexity/brief/${id}${force ? '?force=true' : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch brief: ${res.status}`);
  }

  const data = await res.json();

  // Defensive: ensure advisor_summary is always present
  const brief: Brief =
    typeof data.brief === 'object' && data.brief !== null
      ? { advisor_summary: data.brief.advisor_summary ?? '', ...data.brief }
      : { advisor_summary: String(data.brief) };


  return {
    brief,
    updated_at: data.updated_at,
  };
}
