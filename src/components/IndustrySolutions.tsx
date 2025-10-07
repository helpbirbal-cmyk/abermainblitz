// components/IndustrySolutions.tsx
"use client"

import { useState } from "react"
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material'

const bfsiSolutions = [
  {
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    title: "Accelerated Digital App Releases",
    description: "Quickly launch new app features with confidence while saving up to 90% on test-infrastructure management and achieving a 65% increase in testing efficiency"
  },
  {
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
      </svg>
    ),
    title: "Real-Time Diagnostics",
    description: "Actionable, real-time dashboards that track key KPIs, detect bottlenecks, and offer in-depth diagnostics across all user journeys, locations, devices, and networks"
  },
  {
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 8H16c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5h1v5h2z" />
      </svg>
    ),
    title: "Experience Benchmarking",
    description: "Direct benchmarking against competitors and monitoring performance across geographies to deliver consistent, high-quality user experiences & improve customer satisfaction and digital trust."
  }
]

const ottSolutions = [
  {
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
      </svg>
    ),
    title: "Digital Experience Monitoring",
    description: "Realtime measurement of app performance & user experience on real devices, covering mobile, smart TVs & STBs across networks & geographies, including live sports and events"
  },
  {
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
      </svg>
    ),
    title: "Synthetic Observability & Analytics",
    description: "Proactively detects & diagnoses buffering, playback errors, video/audio quality issues & bottlenecks, even in DRM-protected streams, using advanced AI-driven video analytics"
  },
  {
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" />
      </svg>
    ),
    title: "Enhanced Monetization Tracking",
    description: "AI-driven tracking of ad placement and completion rates, optimizing ad revenue and delivery without affecting user experience"
  }
]

export default function IndustrySolutions() {
  const [activeTab, setActiveTab] = useState<"bfsi" | "ott">("bfsi")
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const handleTabChange = (
    event: React.MouseEvent<HTMLElement>,
    newTab: "bfsi" | "ott",
  ) => {
    if (newTab !== null) {
      setActiveTab(newTab)
    }
  }

  const solutions = activeTab === "bfsi" ? bfsiSolutions : ottSolutions
  const primaryColor = activeTab === "bfsi" ? "primary.main" : "error.main"
  const backgroundColor = activeTab === "bfsi" ? "blue.50" : "red.50"
  const darkBackgroundColor = activeTab === "bfsi" ? "blue.900" : "red.900"

  return (
    <Box
      id="solutions"
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
            Solutions
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              color: isDarkMode ? 'grey.300' : 'grey.600',
              maxWidth: '672px',
              mx: 'auto',
              fontWeight: 400
            }}
          >
            Tailored AI-powered solutions addressing unique challenges
          </Typography>
        </Box>

        {/* Tab Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <ToggleButtonGroup
            value={activeTab}
            exclusive
            onChange={handleTabChange}
            aria-label="industry solutions"
            sx={{
              backgroundColor: isDarkMode ? 'grey.800' : 'grey.100',
              borderRadius: 2,
              p: 0.5,
              gap: 0.5,
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
              '& .MuiToggleButton-root': {
                px: { xs: 4, md: 6 },
                py: 1.5,
                border: 'none',
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                color: isDarkMode ? 'grey.300' : 'grey.700',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'grey.700' : 'grey.200',
                  color: isDarkMode ? 'white' : 'black',
                },
                '&.Mui-selected': {
                  background: activeTab === 'bfsi'
                    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  boxShadow: 2,
                  '&:hover': {
                    background: activeTab === 'bfsi'
                      ? 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
                      : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  }
                }
              }
            }}
          >
            <ToggleButton value="bfsi" aria-label="BFSI solutions">
              BFSI Solutions
            </ToggleButton>
            <ToggleButton value="ott" aria-label="OTT solutions">
              OTT Solutions
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Solutions Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)'
            },
            gap: 3
          }}
        >
          {solutions.map((solution, index) => (
            <Card
              key={index}
              sx={{
                backgroundColor: isDarkMode ? 'grey.900' : 'white',
                borderRadius: 2,
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                boxShadow: 1,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    backgroundColor: isDarkMode ? darkBackgroundColor : backgroundColor,
                    borderRadius: 2,
                    display: 'inline-flex',
                    p: 1.5,
                    mb: 2,
                    '& svg': {
                      color: primaryColor
                    }
                  }}
                >
                  {solution.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: isDarkMode ? 'white' : 'black',
                    mb: 1.5,
                    fontSize: '1.25rem'
                  }}
                >
                  {solution.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode ? 'grey.300' : 'grey.600',
                    lineHeight: 1.6
                  }}
                >
                  {solution.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
