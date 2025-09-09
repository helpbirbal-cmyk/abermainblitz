// components/HeroSection.tsx
"use react"

import { useState, useEffect, useRef } from 'react'
import HalftoneWaves from "@/components/halftonewaves"

interface HeroSectionProps {
  openModal: (type?: 'general' | 'bfsi' | 'ott' | 'payment') => void
}

export default function HeroSection({ openModal }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth;
        // Calculate height for a 4:3 aspect ratio
        const newHeight = newWidth * 0.75;
        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    updateDimensions(); // Initial calculation
    window.addEventListener('resize', updateDimensions); // Listen for window resize

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4" style={{ paddingTop: "40px" }}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-2 bg-gradient-finance text-white text-sm font-medium rounded-full">
              For All Online Industries
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            AI-Powered Observability for Flawless Digital Experiences
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
Mozark helps enterprises monitor, test, and optimize digital journeys across mobile, web, TV, and cloud—without SDKs, backend access, or privacy trade-offs. From fintech apps to streaming platforms, telecom networks to e-commerce portals, we ensure zero-defect performance at scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => openModal('general')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Book Exec Q&A
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
                View Case Studies
              </button>
            </div>
          </div>

          {/* Enhanced GIF Section */}
          <div className="relative">
            {/* Container with shadow and border */}
            <div
              ref={containerRef}
              className="bg-white rounded-4xl shadow-xl border border-gray-200 overflow-hidden"
            >
              <div className="relative rounded-2xl overflow-hidden" style={{ paddingTop: '90%' }}>
                <div className="absolute inset-0">
                  {dimensions.width > 0 && (
                    <HalftoneWaves width={dimensions.width} height={dimensions.height} />
                  )}
                </div>
              </div>
            </div>

            {/* Floating elements removed */}

            {/* Badge */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-200 px-4 py-2 rounded-full shadow-md border border-gray-100">
             <span className="text-sm font-medium text-gray-700">Deep Tech AI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
