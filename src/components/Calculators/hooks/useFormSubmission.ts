// src/components/Calculators/hooks/useFormSubmission.ts
import { useState } from 'react';
import { UserInfo, CalculatorInputs, CalculatorResults } from '../types/ROITypes';

export const useFormSubmission = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendEmails = async (userData: UserInfo, inputs: CalculatorInputs, results: CalculatorResults) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, calculatorInputs: inputs, calculatorResults: results }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'No body provided' }));
        throw new Error('Failed to send information');
      }

      return await response.json();
    } catch (error) {
      setSubmitError('Failed to send your information. Please try again.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmission = async (userInfo: UserInfo, results: CalculatorResults, inputs: CalculatorInputs) => {
    if (!userInfo.name || !userInfo.email || !userInfo.company) {
      setSubmitError('Please fill in all required fields');
      return;
    }

    if (!isValidEmail(userInfo.email)) {
      setSubmitError('Please enter a valid email address');
      return;
    }

    try {
      await sendEmails(userInfo, inputs, results);
      setFormSubmitted(true);
      setShowDetailedAnalysis(true);
      closeModal();
    } catch (error) {
      // Error already handled in sendEmails
    }
  };

  return {
    isModalOpen,
    isSubmitting,
    submitError,
    formSubmitted,
    showDetailedAnalysis,
    openModal,
    closeModal,
    handleFormSubmission
  };
};
