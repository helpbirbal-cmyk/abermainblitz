// components/DemoModal.tsx
"use client"

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
  demoType?: 'general' | 'bfsi' | 'ott' | 'payment'
}

export default function DemoModal({ isOpen, onClose, demoType = 'general' }: DemoModalProps) {
  // Calendly URLs for different demo types
  const calendlyUrls = {
    general: 'https://calendly.com/helpbirbal/q-a-call',
    bfsi: 'hhttps://calendly.com/helpbirbal/15-minute-ott-demo-clone?month=2025-08',
    ott: 'https://calendly.com/helpbirbal/15-minute-ott-demo-clone',
    payment: 'https://calendly.com/helpbirbal/15-minute-ott-demo-clone?month=2025-08'
  }

  const demoLabels = {
    general: 'General Demo',
    bfsi: 'BFSI Demo',
    ott: 'OTT Demo',
    payment: 'Payment Systems Demo'
  }

  const handleBookDemo = () => {
    window.open(calendlyUrls[demoType], '_blank', 'noopener,noreferrer')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Book Your Demo
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {demoLabels[demoType]}
            </h3>
            <p className="text-gray-600">
              Schedule a personalized demo with our experts to see how MozarkAI can transform your business.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleBookDemo}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Book on Calendly
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            You'll be redirected to Calendly to choose a time that works for you.
          </p>
        </div>
      </div>
    </div>
  )
}
