// components/BackgroundPaths.tsx
"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material'
import { useTheme as useNextTheme } from 'next-themes'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

function FloatingPaths({ position, isMobile }: { position: number; isMobile: boolean }) {
  const { resolvedTheme } = useNextTheme()
  const isDarkMode = resolvedTheme === 'dark'

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
    <div id="hero"className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="w-full h-full scale-150 md:scale-100"
        viewBox="0 0 1200 600"
        fill="none"
        preserveAspectRatio="none"
        style={{ color: isDarkMode ? 'white' : '#0f172a' }}
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

interface BackgroundPathsProps {
  title?: string
  openAssessmentModal: () => void
}

export default function BackgroundPaths({
  title = "MAKE APPS FLAWLESS ZERO DEFECTS",
  openAssessmentModal
}: BackgroundPathsProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0)
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const { resolvedTheme } = useNextTheme()
  const isDarkMode = resolvedTheme === 'dark'

  // Define rotating titles
  const rotatingTitles = [
    ["LAUNCH APPS,", "ZERO DEFECT"],
    ["SHIP FASTER,", "NO BUGS"],
    ["AI AUTOMATED", "QAT"],
    ["CATCH DEFECTS,", "BEFORE USERS"],
    ["AI-POWERED", "TESTING"],
  ]

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Rotate titles every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((prevIndex) =>
        prevIndex === rotatingTitles.length - 1 ? 0 : prevIndex + 1
      )
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [rotatingTitles.length])

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

  // Get current title lines
  const currentTitleLines = rotatingTitles[currentTitleIndex]

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: 'background.default'
        }}
      />
    )
  }

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: isDarkMode ? 'black' : 'white',
        overflowX: 'hidden'
      }}
    >
      {/* Background container with full width */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          top: { xs: '-40px', md: 0 },
          width: '100%'
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          <FloatingPaths position={1} isMobile={isMobile} />
          <FloatingPaths position={-1} isMobile={isMobile} />
        </Box>
      </Box>

      {/* Content container with improved mobile padding and text sizing */}
      <Container
        maxWidth={false}
        sx={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4,
          width: '100%'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          style={{
            maxWidth: '1024px',
            margin: '0 auto',
            width: '100%',
            padding: '0 8px'
          }}
        >
          {/* Improved title with better mobile handling and rotating titles */}
          <Box
            component="h1"
            sx={{
              fontSize: {
                xs: '2rem',
                sm: '3rem',
                md: '6rem',
                lg: '6rem',
                xl: '6rem'
              },
              fontWeight: 'bold',
              mb: { xs: 1, sm: 2, md: 4 },
              letterSpacing: 'tight',
              lineHeight: 'tight',
              minHeight: { xs: '120px', sm: '140px', md: '160px' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            {currentTitleLines.map((line, lineIndex) => (
              <Box
                key={`${currentTitleIndex}-${lineIndex}`}
                component="div"
                sx={{
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'visible'
                }}
              >
                {line.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${currentTitleIndex}-${lineIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: lineIndex * 0.2 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    style={{
                      display: 'inline-block',
                      background: isDarkMode
                        ? 'linear-gradient(to right, white, rgba(255,255,255,0.8))'
                        : 'linear-gradient(to right, #0f172a, rgba(15,23,42,0.7))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </Box>
            ))}
          </Box>

          {/* Content section with improved mobile spacing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              marginTop: '16px',
              width: '100%'
            }}
          >
            {/* Subtitle */}
            <Typography
              variant={isSmallScreen ? "h6" : "h5"}
              sx={{
                fontWeight: 500,
                color: isDarkMode ? 'white' : 'black',
                opacity: 0.9,
                lineHeight: 'relaxed',
                px: 1
              }}
            >
              Uncover App Issues, Before  Users See Them
            </Typography>

            {/* Description */}
            <Typography
              variant={isSmallScreen ? "body2" : "body1"}
              sx={{
                color: isDarkMode ? 'white' : 'black',
                opacity: 0.8,
                maxWidth: '672px',
                lineHeight: 'relaxed',
                textAlign: 'center',
                px: 1
              }}
            >
              AI-powered automated testing on real devices that catches defects early & delivers root cause insights, before you publish
            </Typography>

            {/* Divider */}
            <Box
              sx={{
                width: '100%',
                maxWidth: { xs: '384px', sm: '448px' },
                borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                my: 1
              }}
            />

            {/* Buttons - Single Width Layout */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                width: '100%',
                maxWidth: { xs: '384px', sm: '448px' },
                justifyContent: 'center'
              }}
            >
              {/* Book Assessment Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%' }}
              >
                <Button
                  onClick={openAssessmentModal}
                  variant="contained"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: '8px',
                    backgroundColor: '#1d4ed8',
                    opacity: 0.8,
                    border: '1px solid #2563eb',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#ef4444',
                      animation: 'pulse 2s infinite'
                    },
                    '&:hover': {
                      backgroundColor: '#1e40af',
                      fontWeight: 800,
                      border: '3px solid
                    },
                    width: '100%',
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    minWidth: { xs: '100%', sm: '200px' }
                  }}
                >
                  Book an Assessment
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ marginLeft: '8px' }}
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>

              {/* Savings Calculator Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%' }}
              >
                <Button
                  onClick={scrollToEstimator}
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: '6px',
                    opacity: 0.9,
                    color: isDarkMode ? '#ffffff' : '#000000',
                    border: `1px solid ${isDarkMode ? '#ffffff' : '#2563eb'}`,
                    '&:hover': {
                      backgroundColor : isDarkMode ? '#ff0000' : '#ffffff',
                      color: isDarkMode ? '#ffffff' : '#000000',
                      border: '3px solid', fontWeight: 700
                    },
                    width: '100%',
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 500,
                    minWidth: { xs: '100%', sm: '200px' }
                  }}
                >
                  Calculate your Savings
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ marginLeft: '8px' }}
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Typography
              variant="body2"
              sx={{
                color: isDarkMode ? 'grey.400' : 'grey.600',
                mb: 1
              }}
            >
              Scroll to Explore
            </Typography>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowDownwardIcon
                sx={{
                  color: isDarkMode ? 'grey.400' : 'grey.600',
                  fontSize: '1.5rem'
                }}
              />
            </motion.div>
          </motion.div>
        </Box>
      </Container>
    </Box>
  )
}
