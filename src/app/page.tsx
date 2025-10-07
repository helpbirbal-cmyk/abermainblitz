// src/app/page.tsx
"use client"

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import LogoCloud from '@/components/LogoCloud'
import CostCalculators from '@/components/CostCalculators'
import IndustrySolutions from '@/components/IndustrySolutions'
import ResultsSection from '@/components/ResultsSection'
import TechnologySection from '@/components/TechnologySection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import DemoModal from '@/components/DemoModal'
import HalftoneWaves from "@/components/halftonewaves"
import FloatingPaths from "@/components/BackgroundPaths"
import { ROICalculator } from '@/components/Calculators/ROICalculator' //new agenticaitest


export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [demoType, setDemoType] = useState<'general' | 'bfsi' | 'ott' | 'payment'>('general')

  const openModal = (type: 'general' | 'bfsi' | 'ott' | 'payment' = 'general') => {
    setDemoType(type)
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <Navigation openModal={openModal} />
      <HeroSection />

      <LogoCloud />
      <IndustrySolutions />

      <TechnologySection />
      <CostCalculators openModal={openModal} />
      <CTASection
        title="Revolutionize Your Customer Experience Now"
        description="Get the AI Leverage to Do More, Cut Costs & Scale Profitably"
        openModal={openModal} />
        <Footer />

      <DemoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        calculatorType={demoType}
      />
    </>
  )
}
