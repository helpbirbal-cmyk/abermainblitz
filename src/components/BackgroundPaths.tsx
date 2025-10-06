// components/BackgroundPaths.tsx
"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

function FloatingPaths({ position, isMobile }: { position: number; isMobile: boolean }) {
  // Adjust path complexity for mobile devices
  const pathCount = isMobile ? 12 : 36

  // Adjusted path coordinates to extend beyond screen edges
  const paths = Array.from({ length: pathCount }, (_, i) => {
    // Make paths extend further on mobile to prevent white space
    const extraWidth = isMobile ? 200 : 0;

    return {
      id: i,
      d: `M${-extraWidth - 180 - i * 5 * position} ${-89 + i * 6}C${
        -extraWidth - 180 - i * 5 * position
      } ${-89 + i * 6} ${-extraWidth - 112 - i * 5 * position} ${316 - i * 6} ${
        -extraWidth + 352 - i * 5 * position
      } ${443 - i * 6}C${-extraWidth + 816 - i * 5 * position} ${570 - i * 6} ${
        -extraWidth + 884 - i * 5 * position
      } ${975 - i * 6} ${-extraWidth + 884 - i * 5 * position} ${975 - i * 6}`,
      width: isMobile ? 0.5 + i * 0.04 : 0.5 + i * 0.03,
      opacity: isMobile ? 0.15 + i * 0.04 : 0.1 + i * 0.03,
    }
  })

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="w-full h-full text-slate-950 dark:text-white scale-150 md:scale-100" // Increased scale on mobile
        viewBox="0 0 1200 600" // Wider viewBox
        fill="none"
        preserveAspectRatio="none" // Changed to none to fill entire container
      >
        <title>Revolutionize Digital Experience</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// Assessment Modal Component
function AssessmentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectType: "",
    timeline: "",
    message: ""
  })

  // Update the handleSubmit function in your AssessmentModal component
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    const response = await fetch('/api/send-assessment-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const result = await response.json()

    if (response.ok) {
      // Handle success
      console.log('Assessment booked successfully!', result)
      // You can show a success message or redirect
      alert('Thank you! Your assessment request has been submitted successfully.')
      onClose()

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        projectType: "",
        timeline: "",
        message: ""
      })
    } else {
      // Handle API error
      console.error('Failed to book assessment:', result.error)
      alert('Sorry, there was an error submitting your request. Please try again.')
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Network error. Please check your connection and try again.')
  }
}

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Book Your Assessment
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Type
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
              >
                <option value="">Select project type</option>
                <option value="web-app">Web Application</option>
                <option value="mobile-app">Mobile Application</option>
                <option value="ecommerce">E-commerce Platform</option>
                <option value="enterprise">Enterprise Software</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expected Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
              >
                <option value="">Select timeline</option>
                <option value="immediate">Immediately</option>
                <option value="1-month">Within 1 month</option>
                <option value="3-months">Within 3 months</option>
                <option value="6-months">Within 6 months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Additional Information
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors resize-none"
                placeholder="Tell us about your project, challenges, or specific requirements..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Book Assessment
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function BackgroundPaths({
  title = "Achieve ZERO DEFECTS",
}: {
  title?: string
}) {
  const [isMobile, setIsMobile] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Smooth scroll function
  const scrollToEstimator = () => {
    const estimatorSection = document.getElementById('calculator');
    if (estimatorSection) {
      estimatorSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const openAssessmentModal = () => {
    setIsModalOpen(true)
  }

  const closeAssessmentModal = () => {
    setIsModalOpen(false)
  }

  // Split the title into lines for proper animation
  const titleLines = [
    "LAUNCH FLAWLESS APPS",
    "ZERO DEFECTS",
  ]

  return (
    // Added overflow-x-hidden to prevent horizontal scrolling
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-black overflow-x-hidden">
      {/* Background container with full width */}
      <div className="absolute inset-0 flex items-center justify-center -top-10 md:top-0 w-full">
        <div className="relative w-full h-full">
          <FloatingPaths position={1} isMobile={isMobile} />
          <FloatingPaths position={-1} isMobile={isMobile} />
        </div>
      </div>

      {/* Content container with proper padding */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center flex flex-col items-center justify-center min-h-screen py-10 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto w-full px-4" // Added px-4 for mobile padding
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 tracking-tighter">
            {titleLines.map((line, lineIndex) => (
              <div key={lineIndex} className="block whitespace-nowrap">
                {line.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${lineIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: lineIndex * 0.2 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="inline-block text-transparent bg-clip-text
                                        bg-gradient-to-r from-neutral-900 to-neutral-700/80
                                        dark:from-white dark:to-white/80"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </div>
            ))}
          </h1>

          {/* Content section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col items-center space-y-5 mt-6 md:mt-8 px-2 w-full" // Reduced padding on mobile
          >
            <div className="text-md md:text-xl font-medium text-black dark:text-white opacity-90">
              Uncover App Performance Issues—Before Your Users Ever See Them
            </div>

            <div className="text-sm md:text-base text-black dark:text-white opacity-80 max-w-2xl leading-relaxed text-center">
              AI-powered automated testing on real devices that simulates user journeys, catches defects early, and delivers root cause insights—before you publish
            </div>

            <div className="w-full border-t border-gray-300 dark:border-gray-700 my-2"></div>

            <motion.button
              onClick={openAssessmentModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-blue-700 opacity-90 ring-2 ring-red-500 border border-blue-600 text-white font-semibold hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
            >
              <span className="font-bold">Book an Assessment</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                →
              </motion.span>
            </motion.button>

            <motion.button
              onClick={scrollToEstimator}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-blue-500 opacity-90 ring-2 ring-blue-700 border border-blue-600 text-white  hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
            >
              <span className="font-bold">Calculate Your $200K+ Savings</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator - also links to Value Estimator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-10 flex flex-col items-center cursor-pointer"
          onClick={scrollToEstimator}
        >
          <span className="text-sm text-black/70 dark:text-white/70 mb-2">
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-black/70 dark:text-white/70"
            >
              <path
                d="M12 5V19M12 19L19 12M12 19L5 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Assessment Modal */}
      <AssessmentModal isOpen={isModalOpen} onClose={closeAssessmentModal} />
    </div>
  )
}
