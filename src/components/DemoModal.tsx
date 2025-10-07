// src/app/DemoModal.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  TextField,
  useMediaQuery,
  CircularProgress,
  ThemeProvider,
  createTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorType?: 'general' | 'bfsi' | 'ott' | 'payment';
}

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
}

// Custom hook to detect dark mode
function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Initial check
    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return isDarkMode;
}

export default function DemoModal({ isOpen, onClose, calculatorType = 'general' }: DemoModalProps) {
  const isDarkMode = useDarkMode();
  const isMobile = useMediaQuery('(max-width:900px)');
  const [currentStep, setCurrentStep] = useState<'choice' | 'form' | 'calendly'>('choice');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  // Create MUI theme based on dark mode
  const muiTheme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#2563eb',
      },
      background: {
        default: isDarkMode ? '#111827' : '#ffffff',
        paper: isDarkMode ? '#1f2937' : '#ffffff',
      },
    },
  });

  const calendlyUrls = {
    general: 'https://calendly.com/helpbirbal/q-a-call',
    bfsi: 'https://calendly.com/helpbirbal/q-a-call',
    ott: 'https://calendly.com/helpbirbal/q-a-call',
    payment: 'https://calendly.com/helpbirbal/q-a-call'
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-assessment-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'demo_request',
          demoType: calculatorType
        }),
      });

      if (response.ok) {
        alert('Thank you! We\'ll contact you shortly to schedule your demo.');
        handleClose();
      } else {
        alert('There was an error submitting your request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      message: ''
    });
    setCurrentStep('choice');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Go back to choice screen
  const handleBackToOptions = () => {
    setCurrentStep('choice');
  };

  // Choice Screen
  const renderChoiceScreen = () => (
    <Box sx={{ textAlign: 'center', py: 2 }}>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Choose as per your preference
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3, maxWidth: 600, mx: 'auto' }}>
        {/* Request Form Option */}
        <Card
          sx={{
            flex: 1,
            cursor: 'pointer',
            border: `2px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#2563eb',
              transform: 'translateY(-4px)',
              boxShadow: 4
            }
          }}
          onClick={() => setCurrentStep('form')}
        >
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <EmailIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Via Email Form
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              We'll contact you to find the perfect time
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ✅ Get email confirmation<br/>
              ✅ Personalized follow-up<br/>
              ✅ Flexible
            </Typography>
          </CardContent>
        </Card>

        {/* Calendly Option */}
        <Card
          sx={{
            flex: 1,
            cursor: 'pointer',
            border: `2px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#2563eb',
              transform: 'translateY(-4px)',
              boxShadow: 4
            }
          }}
          onClick={() => setCurrentStep('calendly')}
        >
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <ScheduleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Book Via Calendly
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Pick a time that works for you
            </Typography>
            <Typography variant="caption" color="text.secondary">
              🗓️ Instant booking<br/>
              ⏱️ 15-30 minute slots<br/>
              📅 Self Service
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
        Both options include a personalized demo tailored to your needs
      </Typography>
    </Box>
  );

  // Request Form Screen with Back Button
  const renderFormScreen = () => (
    <Box component="form" onSubmit={handleFormSubmit} sx={{ py: 2 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBackToOptions}
        sx={{
          mb: 3,
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
          }
        }}
      >
        Back to Options
      </Button>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Request a Demo
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Share your details and we'll contact you to schedule
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
          <TextField
            required
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
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
              shrink: true,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
          <TextField
            name="company"
            label="Company"
            value={formData.company}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
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
              shrink: true,
            }}
          />
        </Box>

        <TextField
          name="message"
          label="Additional Information"
          value={formData.message}
          onChange={handleChange}
          multiline
          rows={3}
          variant="outlined"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Tell us about your project or specific requirements..."
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ flex: 1, py: 1.5 }}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? 'Submitting...' : 'Request Demo'}
        </Button>
      </Box>
    </Box>
  );

  // Calendly Screen with Back Button
  const renderCalendlyScreen = () => (
    <Box sx={{ py: 2 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBackToOptions}
        sx={{
          mb: 3,
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
          }
        }}
      >
        Back to Options
      </Button>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Book Your Demo
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select a time that works for you
      </Typography>

      <Box sx={{
        height: isMobile ? '70vh' : '600px',
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb'
      }}>
        <iframe
          src={calendlyUrls[calculatorType]}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          title="Schedule Demo"
        />
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          '& .MuiDialog-paper': {
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            borderRadius: '12px',
            overflow: 'hidden',
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {currentStep === 'choice' && 'Schedule Your Demo'}
            {currentStep === 'form' && 'Request Demo'}
            {currentStep === 'calendly' && 'Book Your Time'}
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              '&:hover': {
                color: isDarkMode ? '#ffffff' : '#000000',
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{
          padding: '24px',
          backgroundColor: isDarkMode ? '#111827' : '#ffffff'
        }}>
          {currentStep === 'choice' && renderChoiceScreen()}
          {currentStep === 'form' && renderFormScreen()}
          {currentStep === 'calendly' && renderCalendlyScreen()}
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
