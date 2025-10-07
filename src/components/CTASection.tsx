// src/components/CTASection.tsx
'use client'

import {
  Box,
  Button,
  Typography,
  Container,
  useTheme
} from '@mui/material'

interface CtaSectionProps {
  title: string;
  description: string;
  openModal: (type?: 'general' | 'bfsi' | 'ott' | 'payment') => void;
}

export default function CTASection({
  title,
  description,
  openModal
}: CtaSectionProps) {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  return (
    <Box
      component="section"
      sx={{
        p: { xs: 6, md: 10, lg: 15 }, // Responsive padding: 48px, 80px, 120px
        backgroundColor: isDarkMode ? 'grey.900' : 'white',
        color: isDarkMode ? 'white' : 'black',
        border: '2px solid',
        borderColor: 'primary.main', // Uses your theme's primary color (#2563eb)
        borderRadius: 2,
        width: '100%',
        m: 0.5, // Equivalent to m-1 (4px)
        boxShadow: 3
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          textAlign: 'center'
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' }, // text-4xl, text-5xl, text-6xl
            fontWeight: 'bold',
            mb: 3, // 24px
            color: isDarkMode ? 'white' : 'black',
            background: isDarkMode
              ? 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)'
              : 'linear-gradient(135deg, #000000 0%, #475569 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.2
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1.125rem', md: '1.25rem' }, // text-xl
            mb: 5, // 40px
            maxWidth: '672px', // max-w-3xl
            mx: 'auto',
            color: isDarkMode ? 'gray.300' : 'gray.700',
            lineHeight: 1.6,
            fontWeight: 400
          }}
        >
          {description}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 2, sm: 2 } // space-y-4 and space-x-4 equivalents
          }}
        >
          <Button
            onClick={() => openModal('ott')}
            variant="contained"
            size="large"

          >
            Book Demo
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
