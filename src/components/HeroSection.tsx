// components/HeroSection.tsx (polished version)
interface HeroSectionProps {
  openModal: (type?: 'general' | 'bfsi' | 'ott' | 'payment') => void
}

export default function HeroSection({ openModal }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4" style={{ paddingTop: "40px" }}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-2 bg-gradient-finance text-white text-sm font-medium rounded-full">
              For BFSI & OTT Industries
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Revolutionize Digital Experience with AI-Driven Assurance
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
            Aberdeen and MozarkAI empower financial services and media companies to unlock deep customer insights, accelerate innovation, and deliver flawless, engaging experiences that boost loyalty and growth.
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
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* GIF with subtle frame */}
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/images/aberdeenhero.gif"
                  alt="AI-Powered Customer Insights Platform showing real-time analytics and data visualization"
                  className="w-full h-auto max-h-80 object-cover"
                  loading="eager"
                />

                {/* Overlay gradient for better text visibility if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-3 -left-3 w-20 h-20 bg-gradient-finance rounded-lg opacity-90 shadow-lg"></div>
            <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-gradient-media rounded-lg opacity-90 shadow-lg"></div>

            {/* Badge */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-100">
             <span className="text-sm font-medium text-gray-700">Deep Tech AI Insights</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
