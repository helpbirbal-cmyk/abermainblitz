// components/LogoCloud.tsx - Full Width Version
'use client'

import {
  Box,
  Typography,
  useTheme
} from '@mui/material'
import Image from 'next/image'

const logos = [
  {
    src: "/images/ICICI_Bank_Logo.svg",
    alt: "ICICI Bank Logo",
    height: 40,
    width: 128
  },
  {
    src: "/images/PhonePe_Logo.svg",
    alt: "PhonePe Logo",
    height: 48,
    width: 128
  },
  {
    src: "/images/UOB_Logo.svg",
    alt: "UOB Bank Logo",
    height: 40,
    width: 128
  },
  {
    src: "/images/sonyliv.jpg",
    alt: "SonyLiv Logo",
    height: 40,
    width: 128
  },
  {
    src: "/images/DisneyHotstar_2024.png",
    alt: "Disney+ Hotstar Logo",
    height: 40,
    width: 128
  }
]

export default function LogoCloud() {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  return (
    <Box
      id="results"
      component="section"
      sx={{
        py: 8,
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        backgroundColor: isDarkMode ? 'black' : 'white',
        color: isDarkMode ? 'white' : 'black',
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
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            fontSize: { xs: '2.5rem', md: '3rem', lg: '3.5rem' },
            fontWeight: 'bold',
            mb: 4,
            color: isDarkMode ? 'white' : 'black',
            background: isDarkMode
              ? 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)'
              : 'linear-gradient(135deg, #000000 0%, #475569 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Trusted by Customers
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDarkMode ? 'grey.900' : 'white',
            borderRadius: 2,
            gap: { xs: 4, md: 8 },
            p: 3,
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            boxShadow: 1
          }}
        >
          {logos.map((logo, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: '0 0 auto',
                filter: isDarkMode ? 'brightness(0) invert(1)' : 'none',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  filter: isDarkMode ? 'brightness(0) invert(1) drop-shadow(0 4px 8px rgba(255,255,255,0.2))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                style={{
                  objectFit: 'contain',
                  maxWidth: '128px',
                  height: 'auto',
                  transition: 'transform 0.3s ease-in-out'
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
