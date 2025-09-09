'use client';

import { InlineWidget } from 'react-calendly';

interface CalendlyEmbedProps {
  calendlyUrl: string;
}

export default function CalendlyEmbed({ calendlyUrl }: CalendlyEmbedProps) {
  return (
    <div className="h-[600px] w-full">
      <InlineWidget
        url={calendlyUrl}
        styles={{
          height: '100%',
          width: '100%',
        }}
        pageSettings={{
          backgroundColor: 'ffffff',
          hideEventTypeDetails: false,
          hideLandingPageDetails: false,
          primaryColor: '00a2ff',
          textColor: '4d5055'
        }}
      />
    </div>
  );
}