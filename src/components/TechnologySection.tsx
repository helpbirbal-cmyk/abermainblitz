// components/TechnologySection.tsx
'use client'

import {
  Box,
  Typography,
  Paper,
  useTheme
} from '@mui/material'
import Image from 'next/image'

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
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  return (
    <Box
      id="technology"
      component="section"
      sx={{
        py: 8,
        backgroundColor: isDarkMode ? 'black' : 'white',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          width: '100%',
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
          maxWidth: '100%',
          mx: 'auto'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '3rem', lg: '3.5rem' },
              fontWeight: 'bold',
              mb: 2,
              color: isDarkMode ? 'white' : 'black',
              background: isDarkMode
                ? 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)'
                : 'linear-gradient(135deg, #000000 0%, #475569 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            MozarkAI Technology
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              color: isDarkMode ? 'grey.300' : 'grey.600',
              fontWeight: 400
            }}
          >
            Advanced AI & machine learning capabilities tailored for your industry
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: '1fr 1fr'
            },
            gap: { xs: 4, lg: 6 },
            alignItems: 'center'
          }}
        >
          {/* Differentiators Card */}
          <Paper
            elevation={0}
            sx={{
              backgroundColor: isDarkMode ? 'grey.900' : 'white',
              borderRadius: 2,
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: 3,
              p: { xs: 3, md: 4 },
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: 6
              }
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: isDarkMode ? 'white' : 'black',
                mb: 4,
                fontSize: { xs: '1.5rem', md: '1.75rem' }
              }}
            >
              MozarkAI Differentiators
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {differentiators.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      backgroundColor: 'success.main',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mr: 2,
                      flexShrink: 0,
                      width: 24,
                      height: 24,
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  >
                    ✓
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: isDarkMode ? 'white' : 'black',
                        mb: 0.5,
                        fontSize: '1rem'
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDarkMode ? 'grey.300' : 'grey.600',
                        lineHeight: 1.6
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Image Section */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              height: { xs: '400px', md: '500px', lg: '640px' },
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: 3,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: 6,
                transform: 'scale(1.02)'
              }
            }}
          >
            <Image
              src="/images/mozarkarch.jpg"
              alt="MozarkAI Technology Architecture"
              fill={true}
              style={{
                objectFit: 'contain',
                backgroundColor: isDarkMode ? 'grey.900' : 'white'
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
