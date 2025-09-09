// components/emails/ROILeadEmail.tsx
import { Html, Head, Body, Container, Section, Text, Heading } from '@react-email/components';

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
