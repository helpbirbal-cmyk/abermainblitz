// components/IndustrySolutions.tsx
"use client"

import { useState } from "react"

const bfsiSolutions = [
  {
    icon: (
      <svg className="text-blue-600" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    title: "Accelerated Digital App Releases",
    description: "Quickly launch new app features with confidence while saving up to 90% on test-infrastructure management and achieving a 65% increase in testing efficiency"
  },
  {
    icon: (
      <svg className="text-blue-600" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
      </svg>
    ),
    title: "Real-Time Diagnostics",
    description: "Actionable, real-time dashboards that track key KPIs, detect bottlenecks, and offer in-depth diagnostics across all user journeys, locations, devices, and networks"
  },
  {
    icon: (
      <svg className="text-blue-600" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 8H16c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5h1v5h2z" />
      </svg>
    ),
    title: "Experience Benchmarking",
    description: "Direct benchmarking against competitors and monitoring performance  across geographies tp deliver consistent, high-quality user experiences & improve customer satisfaction and digital trust."
  }
]

const ottSolutions = [
  {
    icon: (
      <svg className="text-red-600" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
      </svg>
    ),
    title: "Digital Experience Monitoring",
    description: "Realtime measurement of app performance & user experience on real devices, covering mobile, smart TVs &  STBs across networks & geographies, including live sports and event "
  },
  {
    icon: (
      <svg className="text-red-600" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
      </svg>
    ),
    title: "Synthetic Observability & Analytics",
    description: "Proactively detects & diagnoses buffering, playback errors, video/audio quality issues & bottlenecks, even in DRM-protected streams, using advanced AI-driven video analytics"
  },
  {
    icon: (
      <svg className="text-red-600" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" />
      </svg>
    ),
    title: "Enhanced Monetization Tracking",
    description: "AI-driven tracking of ad placement and completion rates, optimizing ad revenue and delivery without effecting user experience"
  }
]

export default function IndustrySolutions() {
  const [activeTab, setActiveTab] = useState("bfsi")

  return (
    <section id="solutions" className="py-16 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-4">Solutions</h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Tailored AI-powered solutions addressing unique challenges
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-lg p-1 inline-flex">
            <button
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                activeTab === "bfsi"
                  ? "bg-gradient-finance text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("bfsi")}
            >
              BFSI Solutions
            </button>
            <button
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                activeTab === "ott" ? "bg-gradient-media text-white shadow-md" : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("ott")}
            >
              OTT Solutions
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {(activeTab === "bfsi" ? bfsiSolutions : ottSolutions).map((solution, index) => (
            <div key={index} className="bg-dark/30 dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className={`${activeTab === "bfsi" ? "bg-blue-50" : "bg-red-50"} rounded-lg inline-flex p-3 mb-4`}>
                {solution.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{solution.title}</h3>
              <p className="text-gray-900 dark:text-white">{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
