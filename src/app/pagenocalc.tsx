"use client"

import { useState } from "react"
import Image from 'next/image';


export default function HomePage() {
  const [activeTab, setActiveTab] = useState("bfsi")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between w-full h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">ABERDEEN</span>
              <span className="ml-2 text-sm text-gray-500">| MozarkAI </span>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              <a href="#solutions" className="text-gray-600 hover:text-blue-600 transition-colors">
                Industry Solutions
              </a>
              <a href="#results" className="text-gray-600 hover:text-blue-600 transition-colors">
                Case Studies
              </a>
              <a href="#technology" className="text-gray-600 hover:text-blue-600 transition-colors">
                Technology
              </a>
              <a href="#partnership" className="text-gray-600 hover:text-blue-600 transition-colors">
                Partnership
              </a>
            </div>

            <div className="hidden lg:block">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Book Demo
              </button>
            </div>

            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12M6 12l12-12"
                    />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <a
                  href="#solutions"
                  className="text-gray-600 hover:text-blue-600 transition-colors px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Industry Solutions
                </a>
                <a
                  href="#results"
                  className="text-gray-600 hover:text-blue-600 transition-colors px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Case Studies
                </a>
                <a
                  href="#technology"
                  className="text-gray-600 hover:text-blue-600 transition-colors px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Technology
                </a>
                <a
                  href="#partnership"
                  className="text-gray-600 hover:text-blue-600 transition-colors px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Partnership
                </a>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full mt-2">
                  Book Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4" style={{ paddingTop: "40px" }}>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-2 bg-gradient-finance text-white text-sm font-medium rounded-full">
                For BFSI & OTT Industries
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Transform Customer Experience with AI-Powered Insights
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Aberdeen partners with MozarkAI to deliver cutting-edge solutions that drive engagement, reduce churn,
                and increase revenue for financial services and media companies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                  Get Industry Demo
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
                  View Case Studies
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gray-100 rounded-2xl relative overflow-hidden" style={{ height: "320px" }}>
                <div
                  className="absolute top-3 left-3 bg-gradient-finance rounded-lg opacity-80"
                  style={{ width: "120px", height: "120px" }}
                ></div>
                <div
                  className="absolute bottom-3 right-3 bg-gradient-media rounded-lg opacity-80"
                  style={{ width: "120px", height: "120px" }}
                ></div>
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-500 font-medium">AI-Powered Customer Insights Platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-gray-500 mb-8">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <Image
                  src="/images/ICICI_Bank_Logo.svg"
                  alt="Global Bank Logo"
                  width={128}
                  height={48}
              />
              <Image
                  src="/images/PhonePe_Logo.svg"
                  alt="Insurance Group Logo"
                  width={128}
                  height={48}
              />
              <Image
                  src="/images/UOB_Logo.svg"
                  alt="Wealth Management Logo"
                  width={128}
                  height={48}
              />
              <Image
                  src="/images/sonyliv.jpg"
                  alt="Streaming Service Logo"
                  width={128}
                  height={48}
              />
              <Image
                  src="/images/DisneyHotstar_2024.png"
                  alt="Media Company Logo"
                  width={128}
                  height={48}
              />
            </div>
        </div>
      </section>

    { /* Analyzers */ }



      {/* Industry Solutions */}
      <section id="solutions" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Industry-Specific Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored AI-powered solutions addressing unique challenges in BFSI and OTT industries
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

          {activeTab === "bfsi" && (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="bg-blue-50 rounded-lg inline-flex p-3 mb-4">
                  <svg className="text-blue-600" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalized Financial Products</h3>
                <p className="text-gray-600">
                  AI-driven recommendation engine for personalized banking, insurance, and investment products.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="bg-blue-50 rounded-lg inline-flex p-3 mb-4">
                  <svg className="text-blue-600" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Fraud Detection & Prevention</h3>
                <p className="text-gray-600">
                  Advanced AI algorithms to detect and prevent fraudulent activities in real-time.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="bg-blue-50 rounded-lg inline-flex p-3 mb-4">
                  <svg className="text-blue-600" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 8H16c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5h1v5h2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Retention Analytics</h3>
                <p className="text-gray-600">
                  Predictive analytics to identify at-risk customers and develop targeted retention strategies.
                </p>
              </div>
            </div>
          )}

          {activeTab === "ott" && (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="bg-red-50 rounded-lg inline-flex p-3 mb-4">
                  <svg className="text-red-600" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Content Personalization</h3>
                <p className="text-gray-600">
                  AI-powered content recommendations to increase viewer engagement and retention.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="bg-red-50 rounded-lg inline-flex p-3 mb-4">
                  <svg className="text-red-600" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Subscriber Analytics</h3>
                <p className="text-gray-600">
                  Comprehensive analytics to understand viewer behavior and reduce churn rates.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="bg-red-50 rounded-lg inline-flex p-3 mb-4">
                  <svg className="text-red-600" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Ad Performance Optimization</h3>
                <p className="text-gray-600">
                  AI-driven ad placement and optimization to maximize revenue and viewer experience.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Proven Results for Industry Leaders</h2>
            <p className="text-xl text-gray-600">Driving measurable growth and ROI for our BFSI and OTT clients</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <div
                  className="bg-gradient-finance text-white rounded-lg flex items-center justify-center mr-4 text-sm font-bold"
                  style={{ width: "48px", height: "48px" }}
                >
                  BFSI
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Global Bank Increases Cross-Sell Revenue</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Implemented AI-powered recommendation engine for personalized financial products.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">37%</div>
                  <div className="text-sm text-gray-600">Increase in cross-sell conversion</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">$42M</div>
                  <div className="text-sm text-gray-600">Additional annual revenue</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <div
                  className="bg-gradient-media text-white rounded-lg flex items-center justify-center mr-4 text-sm font-bold"
                  style={{ width: "48px", height: "48px" }}
                >
                  OTT
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Streaming Service Reduces Churn</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Deployed predictive analytics to identify at-risk subscribers and implement retention campaigns.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-1">28%</div>
                  <div className="text-sm text-gray-600">Reduction in churn rate</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-1">$18M</div>
                  <div className="text-sm text-gray-600">Saved annually</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
              View All Case Studies
            </button>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Powered by MozarkAI Technology</h2>
            <p className="text-xl text-gray-600">
              Advanced AI and machine learning capabilities tailored for your industry
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8">MozarkAI Differentiators</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div
                    className="bg-green-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0"
                    style={{ width: "24px", height: "24px", fontSize: "12px" }}
                  >
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Industry-Specific Models</h4>
                    <p className="text-sm text-gray-600">Pre-trained models customized for BFSI and OTT use cases</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div
                    className="bg-green-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0"
                    style={{ width: "24px", height: "24px", fontSize: "12px" }}
                  >
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Real-time Processing</h4>
                    <p className="text-sm text-gray-600">
                      Millisecond response times for immediate insights and actions
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div
                    className="bg-green-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0"
                    style={{ width: "24px", height: "24px", fontSize: "12px" }}
                  >
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Compliance Ready</h4>
                    <p className="text-sm text-gray-600">
                      Built-in compliance with GDPR, CCPA, and financial regulations
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div
                    className="bg-green-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0"
                    style={{ width: "24px", height: "24px", fontSize: "12px" }}
                  >
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Seamless Integration</h4>
                    <p className="text-sm text-gray-600">
                      API-first architecture for easy integration with existing systems
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl flex items-center justify-center" style={{ height: "320px" }}>
              <span className="text-gray-500 font-medium">MozarkAI Technology Architecture</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Transform Your Customer Experience?</h2>
          <p className="text-xl mb-10 leading-relaxed">
            Partner with Aberdeen and leverage the power of MozarkAI to drive growth, reduce churn, and increase
            revenue.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
              Book BFSI Demo
            </button>
            <button className="bg-white text-red-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
              Book OTT Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ABERDEEN</h3>
              <p className="text-gray-400">MozarkAI for BFSI & OTT</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Industry Solutions</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Banking & Financial Services
                  </a>
                </li>

                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    OTT & Streaming Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Media Companies
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    White Papers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Webinars
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>aberdeenassociates@aol.com</li>
                <li>+1 (555) 123-4567</li>
                <li>India | USA | Middle East | Singapore</li>
              </ul>
            </div>
          </div>
          <hr className="border-gray-700 my-8" />
          <div className="text-center text-gray-400">
            <p>© 2023 Aberdeen. All rights reserved. | MozarkAI </p>
          </div>
        </div>
      </footer>
    </>
  )
}
