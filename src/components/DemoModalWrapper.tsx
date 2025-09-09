// components/DemoModalWrapper.tsx
"use client"

import React from 'react' 
import { useState } from 'react'
import DemoModal from './DemoModal'

interface DemoModalWrapperProps {
  children: React.ReactNode
}

export default function DemoModalWrapper({ children }: DemoModalWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [demoType, setDemoType] = useState<'general' | 'bfsi' | 'ott' | 'payment'>('general')

  const openModal = (type: 'general' | 'bfsi' | 'ott' | 'payment' = 'general') => {
    setDemoType(type)
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      {/* Clone children and pass openModal as a prop */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { openModal })
        }
        return child
      })}
      <DemoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        demoType={demoType}
      />
    </>
  )
}
