// src/app/DemoModal.tsx
'use client';

import { useState } from 'react';
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
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EmailIcon from '@mui/icons-material/Email';

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

export default function DemoModal({ isOpen, onClose, calculatorType = 'general' }: DemoModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentStep, setCurrentStep] = useState<'choice' | 'form' | 'calendly'>('choice');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
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
      // Submit to your API endpoint (same as assessment form)
      const response = await fetch('/api/send-assessment-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'demo_request',
          demo_type: calculatorType
        }),
      });

      if (response.ok) {
        alert('Thank you! We\'ll contact you shortly to schedule your demo.');
        onClose();
        resetForm();
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

  // Choice Screen
  const renderChoiceScreen = () => (
    <Box sx={{ textAlign: 'center', py: 2 }}>


      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3, maxWidth: 600, mx: 'auto' }}>
        {/* Request Form Option */}
        <Card
          sx={{
            flex: 1,
            cursor: 'pointer',
            border: `2px solid ${theme.palette.divider}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              transform: 'translateY(-4px)',
              boxShadow: 4
            }
          }}
          onClick={() => setCurrentStep('form')}
        >
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <EmailIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Request a Demo
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              We'll contact you to find the perfect time
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ✅ Get email confirmation<br/>
              ✅ Personalized follow-up<br/>
              ✅ No immediate commitment
            </Typography>
          </CardContent>
        </Card>

        {/* Calendly Option */}
        <Card
          sx={{
            flex: 1,
            cursor: 'pointer',
            border: `2px solid ${theme.palette.divider}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              transform: 'translateY(-4px)',
              boxShadow: 4
            }
          }}
          onClick={() => setCurrentStep('calendly')}
        >
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <ScheduleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Book Instantly
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Pick a time that works for you right now
            </Typography>
            <Typography variant="caption" color="text.secondary">
              🗓️ Instant booking<br/>
              ⏱️ 15-30 minute slots<br/>
              📅 Real-time availability
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
        Both options include a personalized demo tailored to your needs
      </Typography>
    </Box>
  );

  // Request Form Screen
  const renderFormScreen = () => (
    <Box component="form" onSubmit={handleFormSubmit} sx={{ py: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Share your details & we'll contact you to schedule
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Full Name *</Typography>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
              placeholder="Enter your full name"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Email *</Typography>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
              placeholder="Enter your email"
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Company</Typography>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
              placeholder="Enter company name"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Phone</Typography>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
              placeholder="Enter your phone number"
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Additional Information</Typography>
          <textarea
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors resize-none"
            placeholder="Tell us about your project or specific requirements..."
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          type="button"
          variant="outlined"
          onClick={() => setCurrentStep('choice')}
          sx={{ flex: 1 }}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ flex: 1 }}
        >
          {isSubmitting ? 'Submitting...' : 'Request Demo'}
        </Button>
      </Box>
    </Box>
  );

  // Calendly Screen
  const renderCalendlyScreen = () => (
    <Box sx={{ py: 2 }}>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select a time that works for you
      </Typography>

      <Box sx={{ height: isMobile ? '70vh' : '600px', borderRadius: 1, overflow: 'hidden' }}>
        <iframe
          src={calendlyUrls[calculatorType]}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          title="Schedule Demo"
        />
      </Box>

      <Button
        variant="outlined"
        onClick={() => setCurrentStep('choice')}
        sx={{ mt: 2 }}
        fullWidth
      >
        Back to Options
      </Button>
    </Box>
  );

  return (
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
          backgroundColor: theme.palette.background.paper,
          borderRadius: '12px',
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
          {currentStep === 'choice' && 'Schedule Your Demo'}
          {currentStep === 'form' && 'Request Demo'}
          {currentStep === 'calendly' && 'Book Your Time'}
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.action.hover,
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '0 24px 24px' }}>
        {currentStep === 'choice' && renderChoiceScreen()}
        {currentStep === 'form' && renderFormScreen()}
        {currentStep === 'calendly' && renderCalendlyScreen()}
      </DialogContent>
    </Dialog>
  );
}
