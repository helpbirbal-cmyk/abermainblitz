// components/emails/ROILeadEmail.tsx
import { Html, Head, Body, Container, Section, Text, Heading } from '@react-email/components';

// src/components/emails/ROILeadEmail.tsx
// Add the missing style definitions at the top of the file

const bodyStyle = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: 0
}

const containerStyle = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '100%'
}

const headingStyle = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#333333',
  margin: '0 0 20px',
  textAlign: 'center' as const
}
const subheadingStyle = {
  fontSize: '18px',
  fontWeight: '400',
  color: '#333333',
  margin: '0 0 20px',
  textAlign: 'center' as const
}

const sectionStyle = {
  padding: '0 48px'
}

const textStyle = {
  color: '#666666',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px'
}

const strongStyle = {
  color: '#333333',
  fontWeight: '600'
}

// ... rest of your component code

interface ROILeadEmailProps {
  name: string;
  email: string;
  company: string;
  phone?: string;
  results: any;
}

export const ROILeadEmail = ({ name, email, company, phone, results }: ROILeadEmailProps) => (
  <Html>
    <Head />
    <Body style={bodyStyle}>
      <Container style={containerStyle}>
        <Heading style={headingStyle}>New ROI Calculator Lead</Heading>
        <Section style={sectionStyle}>
          <Text><strong>Name:</strong> {name}</Text>
          <Text><strong>Email:</strong> {email}</Text>
          <Text><strong>Company:</strong> {company}</Text>
          {phone && <Text><strong>Phone:</strong> {phone}</Text>}
        </Section>
        <Section style={sectionStyle}>
          <Heading as="h3" style={subheadingStyle}>ROI Results</Heading>
          <Text>Annual Savings: {results.annualSavings}</Text>
          <Text>ROI: {results.roiPercentage}</Text>
          <Text>Payback Period: {results.paybackPeriod} months</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
