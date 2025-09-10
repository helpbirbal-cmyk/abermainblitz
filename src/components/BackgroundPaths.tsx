// components/BackgroundPaths.tsx
"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

function FloatingPaths({ position, isMobile }: { position: number; isMobile: boolean }) {
  // Adjust path complexity for mobile devices
  const pathCount = isMobile ? 12 : 36

  // Adjusted path coordinates to center the animation
  const paths = Array.from({ length: pathCount }, (_, i) => {
    const offsetX = isMobile ? 100 : 0;
    const offsetY = isMobile ? -50 : 0;

    return {
      id: i,
      d: `M${offsetX - 180 - i * 5 * position} ${offsetY - 89 + i * 6}C${
        offsetX - 180 - i * 5 * position
      } ${offsetY - 89 + i * 6} ${offsetX - 112 - i * 5 * position} ${offsetY + 316 - i * 6} ${
        offsetX + 352 - i * 5 * position
      } ${offsetY + 443 - i * 6}C${offsetX + 816 - i * 5 * position} ${offsetY + 570 - i * 6} ${
        offsetX + 884 - i * 5 * position
      } ${offsetY + 975 - i * 6} ${offsetX + 884 - i * 5 * position} ${offsetY + 975 - i * 6}`,
      width: isMobile ? 0.5 + i * 0.04 : 0.5 + i * 0.03,
      opacity: isMobile ? 0.15 + i * 0.04 : 0.1 + i * 0.03,
    }
  })

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="w-full h-full text-slate-950 dark:text-white scale-125 md:scale-100"
        viewBox="0 0 1000 600"
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
  title = "Achieve ZERO Defects",
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

  // Split the title into lines for proper animation
  const titleLines = [
    "Achieve",
    "ZERO Defects"
  ]

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-black">
      {/* Background container with adjusted positioning */}
      <div className="absolute inset-0 flex items-center justify-center -top-10 md:top-0">
        <div className="relative w-full h-full">
          <FloatingPaths position={1} isMobile={isMobile} />
          <FloatingPaths position={-1} isMobile={isMobile} />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center flex flex-col items-center justify-center min-h-screen py-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
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
            className="flex flex-col items-center space-y-5 mt-6 md:mt-8 px-4"
          >
            <div className="text-lg md:text-xl font-medium text-black dark:text-white opacity-90">
              Know Your App Performance, Before Users Complain
            </div>

            <div className="text-sm md:text-base text-black dark:text-white opacity-80 max-w-2xl leading-relaxed text-center">
              Mozark's AI-powered synthetic testing & monitoring to pinpoint front-end, network & API issues
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-blue-700 opacity-80
                         border border-black/30 dark:border-white/30 text-white dark:text-white hover:text-black
                         hover:bg-white /5 dark:hover:bg-white /5 transition-colors duration-300"
            >
              <span className="font-bold">Do MORE in Less</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-10 flex flex-col items-center"
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
