// components/Navigation.tsx
"use client"

import { useState } from "react"
import Image from 'next/image'

interface NavigationProps {
  openModal: (type?: 'general' | 'bfsi' | 'ott' | 'payment') => void
}

export default function Navigation({ openModal }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "#solutions", label: "Solutions" },
    { href: "#results", label: "Benifits" },
    { href: "#technology", label: "Tech" },
    { href: "#calculator", label: "ROI Tools" }
  ]

  return (
    <nav className="bg-black shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between w-full h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/aberdeenicon.png" // Make sure the file extension is correct
                alt="Aberdeen"
                width={120}
                height={32}
                className="h-8 w-auto"
              /> Mojo
              <span className="text-white">|</span>
              <Image
                src="/images/mozarkicon.png" // Make sure the file extension is correct
                alt="MozarkAI"
                width={150}
                height={48}
                className="h-8 w-auto"
              />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white hover:text-blue-600 transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Book Demo Button */}
          <div className="hidden lg:block">
            <button
              onClick={() => openModal('general')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Book Demo
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-blue-600 focus:outline-none focus:text-blue-600"
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white hover:text-blue-600 transition-colors px-2 py-1 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  openModal('general')
                  setIsMobileMenuOpen(false)
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full mt-2 font-medium"
              >
                Book Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
