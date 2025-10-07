// components/AssessmentModal.tsx
"use client"

import { motion } from "framer-motion"
import { useState } from "react"

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader onClose={onClose} />
        <Form
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onClose={onClose}
        />
      </motion.div>
    </motion.div>
  )
}

// Sub-components for better organization
function ModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
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
  )
}

interface FormProps {
  formData: FormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  onClose: () => void
}

function Form({ formData, onChange, onSubmit, isSubmitting, onClose }: FormProps) {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-6">
      <MaterialInputField
        label="Full Name *"
        id="name"
        name="name"
        type="text"
        value={formData.name}
        onChange={onChange}
        required
      />

      <MaterialInputField
        label="Email Address *"
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={onChange}
        required
      />

      <MaterialInputField
        label="Company"
        id="company"
        name="company"
        type="text"
        value={formData.company}
        onChange={onChange}
      />

      <MaterialInputField
        label="Phone Number"
        id="phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={onChange}
      />

      <MaterialSelectField
        label="Project Type"
        id="projectType"
        name="projectType"
        value={formData.projectType}
        onChange={onChange}
        options={[
          { value: "", label: "" },
          { value: "web-app", label: "Web Application" },
          { value: "mobile-app", label: "Mobile Application" },
          { value: "ecommerce", label: "E-commerce Platform" },
          { value: "enterprise", label: "Enterprise Software" },
          { value: "other", label: "Other" },
        ]}
      />

      <MaterialSelectField
        label="Expected Timeline"
        id="timeline"
        name="timeline"
        value={formData.timeline}
        onChange={onChange}
        options={[
          { value: "", label: "" },
          { value: "immediate", label: "Immediately" },
          { value: "1-month", label: "Within 1 month" },
          { value: "3-months", label: "Within 3 months" },
          { value: "6-months", label: "Within 6 months" },
          { value: "flexible", label: "Flexible" },
        ]}
      />

      <MaterialTextAreaField
        label="Additional Information"
        id="message"
        name="message"
        value={formData.message}
        onChange={onChange}
        rows={4}
      />

      <FormActions onClose={onClose} isSubmitting={isSubmitting} />
    </form>
  )
}

interface MaterialInputFieldProps {
  label: string
  id: string
  name: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

function MaterialInputField({ label, id, name, type, value, onChange, required }: MaterialInputFieldProps) {
  const isFilled = value.length > 0

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className="peer w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200 outline-none"
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none
          peer-focus:text-blue-600 peer-focus:dark:text-blue-400
          ${isFilled
            ? 'top-1 text-xs text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900 px-1 -translate-y-1/2'
            : 'top-3 text-gray-500 dark:text-gray-400 bg-transparent'
          }
          peer-focus:top-1 peer-focus:text-xs peer-focus:bg-white peer-focus:dark:bg-gray-900 peer-focus:px-1 peer-focus:-translate-y-1/2`}
      >
        {label}
      </label>
    </div>
  )
}

interface MaterialSelectFieldProps {
  label: string
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Array<{ value: string; label: string }>
}

function MaterialSelectField({ label, id, name, value, onChange, options }: MaterialSelectFieldProps) {
  const isFilled = value.length > 0

  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`peer w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200 outline-none appearance-none
          ${isFilled ? 'pt-5 pb-1' : 'py-3'}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none
          peer-focus:text-blue-600 peer-focus:dark:text-blue-400
          ${isFilled
            ? 'top-1 text-xs text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900 px-1 -translate-y-1/2'
            : 'top-3 text-gray-500 dark:text-gray-400 bg-transparent'
          }
          peer-focus:top-1 peer-focus:text-xs peer-focus:bg-white peer-focus:dark:bg-gray-900 peer-focus:px-1 peer-focus:-translate-y-1/2`}
      >
        {label}
      </label>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

interface MaterialTextAreaFieldProps {
  label: string
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
}

function MaterialTextAreaField({ label, id, name, value, onChange, rows = 4 }: MaterialTextAreaFieldProps) {
  const isFilled = value.length > 0

  return (
    <div className="relative">
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        className={`peer w-full px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200 outline-none resize-none
          ${isFilled ? 'pt-5 pb-3' : 'py-3'}`}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none
          peer-focus:text-blue-600 peer-focus:dark:text-blue-400
          ${isFilled
            ? 'top-1 text-xs text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900 px-1 -translate-y-1/2'
            : 'top-3 text-gray-500 dark:text-gray-400 bg-transparent'
          }
          peer-focus:top-1 peer-focus:text-xs peer-focus:bg-white peer-focus:dark:bg-gray-900 peer-focus:px-1 peer-focus:-translate-y-1/2`}
      >
        {label}
      </label>
    </div>
  )
}

interface FormActionsProps {
  onClose: () => void
  isSubmitting: boolean
}

function FormActions({ onClose, isSubmitting }: FormActionsProps) {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          'Send Now!'
        )}
      </button>
    </div>
  )
}
