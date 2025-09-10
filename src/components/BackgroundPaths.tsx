// components/BackgroundPaths.tsx
"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

function FloatingPaths({ position }: { position: number }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Adjust path complexity for mobile devices
  const pathCount = isMobile ? 18 : 36

  const paths = Array.from({ length: pathCount }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: isMobile ? 0.3 + i * 0.02 : 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <title>Revolutionize Digital Experience</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
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
  title = "Achieve Zero.Defects",
}: {
  title?: string
}) {
  const words = title.split(" ")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-black">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 tracking-tighter">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="block">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="inline-block text-transparent bg-clip-text
                                        bg-gradient-to-r from-neutral-900 to-neutral-700/80
                                        dark:from-white dark:to-white/80"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <div
            className="inline-block group relative rounded-2xl backdrop-blur-lg
                        overflow-hidden transition-shadow duration-300 mt-6 md:mt-8"
          >
            <button
              className="rounded-2xl px-6 py-4 md:px-8 md:py-6 text-sm md:text-base font-semibold
                          bg-transparent hover:bg-white/5 dark:hover:bg-black/5
                          text-black dark:text-white transition-all duration-300
                          group-hover:-translate-y-0.5 border border-black/20 dark:border-white/20
                          hover:shadow-md dark:hover:shadow-neutral-800/30"
            >
              <div className="flex flex-col items-center space-y-3">
                <span className="opacity-90 group-hover:opacity-100 transition-opacity font-medium">
                  Know Your App Performance, Before Your Users Complain
                </span>

                <span className="opacity-80 group-hover:opacity-100 transition-opacity text-xs md:text-sm max-w-2xl leading-tight md:leading-normal">
                  Mozark's synthetic monitoring proactively tests critical user journeys from a global network,
                  pinpointing front-end, network, and API issues with AI-powered root cause analysis
                </span>

                <div className="flex items-center mt-2">
                  <span className="opacity-90 group-hover:opacity-100 transition-opacity text-sm md:text-base font-medium">
                    Do More, Cut Time & Costs
                  </span>
                  <span
                    className="ml-2 md:ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5
                                    transition-all duration-300"
                  >
                    →
                  </span>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
