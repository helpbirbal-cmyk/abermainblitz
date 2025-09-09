// context/DemoModalContext.tsx
"use client"

import React, { createContext, useContext, useState } from 'react'

type DemoType = 'general' | 'bfsi' | 'ott' | 'payment'

interface DemoModalContextType {
  isModalOpen: boolean
  demoType: DemoType
  openModal: (type?: DemoType) => void
  closeModal: () => void
}

const DemoModalContext = createContext<DemoModalContextType | undefined>(undefined)

export function DemoModalProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [demoType, setDemoType] = useState<DemoType>('general')

  const openModal = (type: DemoType = 'general') => {
    setDemoType(type)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <DemoModalContext.Provider value={{ isModalOpen, demoType, openModal, closeModal }}>
      {children}
    </DemoModalContext.Provider>
  )
}

export function useDemoModal() {
  const context = useContext(DemoModalContext)
  if (context === undefined) {
    throw new Error('useDemoModal must be used within a DemoModalProvider')
  }
  return context
}
