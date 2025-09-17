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

export default function BackgroundPaths({
  title = "Achieve ZERO DEFECTS",
}: {
  title?: string
}) {
  const [isMobile, setIsMobile] = useState(false)

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

  // Split the title into lines for proper animation
  const titleLines = [
    "ZERO DEFECT",
    "Your App",
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
              Know Your App Performance, Before Your Users
            </div>

            <div className="text-sm md:text-base text-black dark:text-white opacity-80 max-w-2xl leading-relaxed text-center">
              AI-powered synthetic testing & monitoring that pinpoints application experience issues in realtime, with root cause analysis
            </div>

            <div className="w-full border-t border-gray-300 dark:border-gray-700 my-2"></div>

            <motion.button
              onClick={scrollToEstimator}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-blue-700 opacity-90 ring-2 ring-red-500 border border-blue-600 text-white font-semibold hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
            >
              <span className="font-bold">Calculate ROI</span>
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
            Scroll to explore
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
    </div>
  )
}
