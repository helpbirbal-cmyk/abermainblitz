// components/DemoModal.tsx inframe version
"use client"

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
  demoType?: 'general' | 'bfsi' | 'ott' | 'payment'
}

export default function DemoModal({ isOpen, onClose, demoType = 'general' }: DemoModalProps) {
  // Replace these with your actual Calendly URLs
  const calendlyUrls = {
    bfsi: 'https://calendly.com/helpbirbal/15-minute-bfsi-demo-clone',
    general: 'https://calendly.com/helpbirbal/15-minute-bfsi-demo-clone',
    ott: 'https://calendly.com/helpbirbal/15-minute-bfsi-demo-clone',
    payment: 'https://calendly.com/helpbirbal/15-minute-bfsi-demo-clone'
  }

  const demoLabels = {
    general: 'General Demo',
    bfsi: 'BFSI Demo',
    ott: 'OTT Streaming Demo',
    payment: 'Payment Systems Demo'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div>
            <h2 className="text-2xl font-bold mb-1">Schedule Your Demo</h2>
            <p className="text-blue-100">{demoLabels[demoType]}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        {/* Calendly Iframe */}
        <div className="flex-1 min-h-[600px]">
          <iframe
            src={calendlyUrls[demoType]}
            width="100%"
            height="100%"
            style={{
              minHeight: '600px',
              border: 'none',
              display: 'block'
            }}
            title="Schedule Demo with MozarkAI"
            loading="lazy"
          />
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>Secure & encrypted booking powered by Calendly</span>
          </div>
        </div>
      </div>
    </div>
  )
}
