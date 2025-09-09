// components/TechnologySection.tsx
import Image from 'next/image';

const differentiators = [
  {
    title: "AI-Powered Intelligent Test Automation",
    description: "AI-driven automation platform with intelligent agents autonomously author, script, execute & analyze tests. Agentic automation reduces dependency on skilled developers, boosts productivity by 10x"
  },
  {
    title: "No-Code, Visual Automation Engine",
    description: "Visual intelligence framework that simulates human-like gestures without any coding. Usable by non-technical QA teams, reducing time & effort drastically."
  },
  {
    title: "Compliance Ready",
    description: "Comprehensive Cross-Platform Support with Privacy and Security. Operates with zero impact on app performance & complies with stringent standards and governance"
  },
  {
    title: "Full-Stack, Real-World Digital Experience Assurance",
    description: "End-to-end visibility across apps, networks, and devices through a unified platform. Monitors apps in real network conditions on real cloud-connected devices"
  }
]

export default function TechnologySection() {
  return (
    <section id="technology" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">MozarkAI Technology</h2>
          <p className="text-xl text-gray-600">
            Advanced AI & machine learning capabilities tailored for your industry
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">MozarkAI Differentiators</h3>
            <div className="space-y-6">
              {differentiators.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div
                    className="bg-green-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0"
                    style={{ width: "24px", height: "24px", fontSize: "12px" }}
                  >
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Corrected image section */}
          <div className="relative rounded-2xl overflow-hidden" style={{ height: "640px" }}>
             <Image
                src="/images/mozarkarch.jpg"
                alt="MozarkAI Technology Architecture"
                fill={true}
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 1900px) 100vw, 100vw"
              />
          </div>
        </div>
      </div>
    </section>
  )
}
