// src/app/leads/StableLeadsWrapper.tsx
'use client';

import { useEffect, useState } from 'react';
import { LeadsPipelineClient } from './LeadsPipelineClient';

export function StableLeadsWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    console.log('🔴 STABLE WRAPPER MOUNTED');
    setIsClient(true);

    return () => {
      console.log('🔴 STABLE WRAPPER UNMOUNTED');
    };
  }, []);

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-500">Loading leads...</div>
      </div>
    );
  }

  // This key should prevent re-mounting during parent re-renders
  return <LeadsPipelineClient key="stable-leads-pipeline" />;
}
