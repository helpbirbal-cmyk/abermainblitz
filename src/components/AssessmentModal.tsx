// components/AssessmentModal.tsx
"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from 'next-themes'

interface AssessmentModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  name: string
  email: string
  company: string
  phone: string
  projectType: string
  timeline: string
  message: string
}

// Project type options
const projectTypes = [
  { value: 'web-app', label: 'Web Application' },
  { value: 'mobile-app', label: 'Mobile Application' },
  { value: 'ecommerce', label: 'E-commerce Platform' },
  { value: 'enterprise', label: 'Enterprise Software' },
  { value: 'other', label: 'Other' },
]

// Timeline options
const timelines = [
  { value: 'immediate', label: 'Immediately' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '3-months', label: 'Within 3 months' },
  { value: '6-months', label: 'Within 6 months' },
  { value: 'flexible', label: 'Flexible' },
]

export default function AssessmentModal({ isOpen, onClose }: AssessmentModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectType: "",
    timeline: "",
    message: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { theme, systemTheme } = useTheme()

  // Determine the current theme - use system theme if theme is 'system'
  const currentTheme = theme === 'system' ? systemTheme : theme

  // Create MUI theme based on current theme
  const muiTheme = createTheme({
    palette: {
      mode: currentTheme as 'light' | 'dark',
      primary: {
        main: '#2563eb',
      },
      background: {
        default: currentTheme === 'dark' ? '#111827' : '#ffffff',
        paper: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#2563eb',
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          outlined: {
            borderColor: currentTheme === 'dark' ? '#4b5563' : '#d1d5db',
            color: currentTheme === 'dark' ? '#e5e7eb' : '#374151',
            '&:hover': {
              borderColor: currentTheme === 'dark' ? '#6b7280' : '#9ca3af',
              backgroundColor: currentTheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
            },
          },
        },
      },
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

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
        console.log('Assessment booked successfully!', result)
        alert('Thank you! Your assessment request has been submitted successfully.')
        onClose()
        resetForm()
      } else {
        console.error('Failed to book assessment:', result.error)
        alert(`Sorry, there was an error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      projectType: "",
      timeline: "",
      message: ""
    })
  }

  if (!isOpen) return null

  return (
    <ThemeProvider theme={muiTheme}>
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
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Book Your Assessment
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form content */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: '0 0 12px 12px'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                required
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true, // This forces the label to always be in the "shrink" (floated) position
                }}
              />

              <TextField
                required
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true, // This forces the label to always be in the "shrink" (floated) position
                }}
              />

              <TextField
                name="company"
                label="Company"
                value={formData.company}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true, // This forces the label to always be in the "shrink" (floated) position
                }}
              />

              <TextField
                name="phone"
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true, // This forces the label to always be in the "shrink" (floated) position
                }}
              />

              <TextField
                select
                name="projectType"
                label="Project Type"
                value={formData.projectType}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true, // This forces the label to always be in the "shrink" (floated) position
                }}
              >
                {projectTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                name="timeline"
                label="Expected Timeline"
                value={formData.timeline}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true, // This forces the label to always be in the "shrink" (floated) position
                }}
              >
                {timelines.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                name="message"
                label="Additional Information"
                value={formData.message}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true, // This forces the label to always be in the "shrink" (floated) position
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                <Button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  variant="outlined"
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="contained"
                  fullWidth
                  sx={{ py: 1.5 }}
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isSubmitting ? 'Submitting...' : 'Send'}
                </Button>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </motion.div>
    </ThemeProvider>
  )
}
