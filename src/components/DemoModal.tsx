// components/DemoModal.tsx (simpler loading)
"use client"

import { useState } from 'react'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
  demoType?: 'general' | 'bfsi' | 'ott' | 'payment'
}

export default function DemoModal({ isOpen, onClose, demoType = 'general' }: DemoModalProps) {
  const [isLoading, setIsLoading] = useState(true)

  const calendlyUrls = {
    general: 'https://calendly.com/helpbirbal/q-a-call',
    bfsi: 'https://calendly.com/helpbirbal/q-a-call',
    ott: 'https://calendly.com/helpbirbal/q-a-call',
    payment: 'https://calendly.com/helpbirbal/q-a-call'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <h2 className="text-2xl font-bold">Schedule Your Demo</h2>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="flex-1 min-h-[600px] flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading booking calendar...</p>
              <p className="text-sm text-gray-500 mt-1">This may take a few seconds</p>
            </div>
          </div>
        )}

        {/* Calendly Iframe */}
        <div className="flex-1 min-h-[600px]">
          <iframe
            src={calendlyUrls[demoType]}
            width="100%"
            height="100%"
            style={{
              minHeight: '600px',
              border: 'none',
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out'
            }}
            title="Schedule Demo"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t text-center text-sm text-gray-600">
          Secure booking powered by Calendly
        </div>
      </div>
    </div>
  )
}
