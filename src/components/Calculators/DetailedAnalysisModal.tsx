// components/calculators/DetailedAnalysisModal.tsx
'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';

interface UserInfo {
  name: string;
  email: string;
  company: string;
  phone: string;
}

interface ImpactMetric {
  label: string;
  value: string;
  change: number;
  isPositive: boolean;
  description: string;
}

interface DetailedAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  impactMetrics: ImpactMetric[];
  onFormSubmit: (userInfo: UserInfo) => Promise<void>;
  initialUserInfo?: UserInfo;
}

export default function DetailedAnalysisModal({
  isOpen,
  onClose,
  impactMetrics,
  onFormSubmit,
  initialUserInfo
}: DetailedAnalysisModalProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>(
    initialUserInfo || { name: '', email: '', company: '', phone: '' }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onFormSubmit(userInfo);
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Failed to submit your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={formSubmitted ? "Detailed ROI Analysis Report" : "Get Detailed Analysis"}
    >
      <div className="space-y-6">
        {formSubmitted ? (
          <>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-700 text-sm text-center">
                Thank you for your information! Our team will contact you shortly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {impactMetrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">{metric.label}</h4>
                  <p className="text-lg font-bold text-gray-800">{metric.value}</p>
                  <p className={`text-sm font-medium mt-1 ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.isPositive ? '+' : ''}{metric.change}% with optimization
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Next Steps</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Our sales team will contact you within 24 hours</li>
                <li>• We'll provide a customized implementation plan</li>
                <li>• You'll receive a detailed proposal with exact pricing</li>
              </ul>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="font-semibold text-gray-800">Provide your details to download the full report</h4>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userInfo.name}
                onChange={handleUserInfoChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userInfo.email}
                onChange={handleUserInfoChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={userInfo.company}
                onChange={handleUserInfoChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={userInfo.phone}
                onChange={handleUserInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number (optional)"
              />
            </div>

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{submitError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition duration-200"
            >
              {isSubmitting ? 'Processing...' : 'Download Full Report'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By submitting this form, you agree to our Privacy Policy and consent to contact from our sales team.
            </p>
          </form>
        )}
      </div>
    </Modal>
  );
}
