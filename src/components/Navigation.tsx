// src/components/Navigation.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  useMediaQuery
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'

interface NavigationProps {
  openModal: (type?: 'general' | 'bfsi' | 'ott' | 'payment') => void
}

export default function Navigation({ openModal }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const isMobile = useMediaQuery('(max-width:1023px)') // lg breakpoint
  const router = useRouter();


  // Detect dark mode from html class
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }

    // Initial check
    checkDarkMode()

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  const navLinks = [
    { href: "#hero", label: "Home" },
    { href: "#solutions", label: "Solutions" },
    { href: "#results", label: "Benefits" },
    { href: "#technology", label: "Tech" },
    { href: "#calculator", label: "ROI Tools" }
  ]

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: isDarkMode ? '#000000' : '#ffffff', // bg-gray-900 in dark, white in light
        color: isDarkMode ? '#ffffff' : '#000000', // text-white in dark, text-black in light
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        zIndex: 1300
      }}
    >
      <Toolbar sx={{ maxWidth: '1200px', mx: 'auto', width: '100%', px: 2 }}>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Image
              src="/images/aberdeenicon.png"
              alt="Aberdeen"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
            <span style={{
              color: isDarkMode ? '#ffffff' : '#000000',
              fontWeight: 500
            }}>
              AberCXO |
            </span>
            <Image
              src="/images/mozarkicon.png"
              alt="MozarkAI"
              width={150}
              height={48}
              className="h-8 w-auto"
            />
          </Box>
        </Box>

        {/* Desktop Navigation Links */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 4 }}>
          {navLinks.map((link) => (
            <Button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              sx={{
                color: 'inherit',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.875rem',
                minWidth: 'auto',
                px: 1,
                '&:hover': {
                  color:  isDarkMode? '#ffe599' :'#076EFF', // blue-600
                  backgroundColor: 'transparent',
                }
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>

        {/* Desktop Book Demo Button */}
        <Box sx={{ display: { xs: 'none', lg: 'block' }, ml: 2 }}>
          <Button
            variant="contained"
            onClick={() => openModal('general')}
            sx={{
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: '6px',
              px: 3,
              py: 1,
              backgroundColor: '#2563eb', // blue-600
              color: 'white',
              '&:hover': {
                backgroundColor: '#1d4ed8', // blue-700
              }
            }}
          >
            Book Demo
          </Button>
          <Button
              onClick={() => router.push('/leads')}
              variant="outline"
              sx={{ py: 2,fontSize: '0.875rem',
              fontWeight: 300, }}
             >
              CLM
          </Button>
        </Box>

        {/* Mobile Menu Button */}
        <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
          <IconButton
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            sx={{
              color: 'inherit',
              '&:hover': {
                color: '#2563eb',
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="top"
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            backgroundColor: isDarkMode ? '#111827' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            marginTop: '64px', // Height of AppBar
            borderTop: '1px solid',
            borderColor: isDarkMode ? '#374151' : '#e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <Box sx={{ width: '100%', py: 2, px: 2 }}>
          <List sx={{ p: 0 }}>
            {navLinks.map((link) => (
              <ListItem key={link.href} disablePadding sx={{ mb: 1 }}>
                <Button
                  onClick={() => handleNavClick(link.href)}
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    color: 'inherit',
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1.5,
                    px: 2,
                    borderRadius: '6px',
                    '&:hover': {
                      color: '#2563eb',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  {link.label}
                </Button>
              </ListItem>
            ))}
            <ListItem disablePadding sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => {
                  openModal('general')
                  setIsMobileMenuOpen(false)
                }}
                fullWidth
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: '6px',
                  py: 1.5,
                  backgroundColor: '#2563eb',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                  }
                }}
              >
                Book Demo
              </Button>
              <Button
                  onClick={() => router.push('/leads')}
                  variant="contained"
                  sx={{ mt: 2 }}
                 >
                  CRM
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  )
}
