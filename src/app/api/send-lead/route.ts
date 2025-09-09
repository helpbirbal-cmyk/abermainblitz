// app/api/send-lead/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

// Create a transporter using SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, phone, calculatorResults } = await request.json();

    // Validate required fields
    if (!name || !email || !company) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400 }
      );
    }

    const transporter = createTransporter();

    // Send email to sales team
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SALES_EMAIL || 'sales@yourcompany.com',
      subject: `New ROI Calculator Lead: ${name} from ${company}`,
      html: `
        <h2>New Lead from ROI Calculator</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <h3>ROI Calculation Results:</h3>
        <pre>${JSON.stringify(calculatorResults, null, 2)}</pre>
        <p><em>Received: ${new Date().toLocaleString()}</em></p>
      `
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Your ROI Analysis Report',
      html: `
        <h2>Thank you for using our ROI Calculator!</h2>
        <p>Hi ${name},</p>
        <p>We've received your information and will contact you shortly to discuss your personalized ROI analysis.</p>
        <h3>Your Estimated Results:</h3>
        <ul>
          <li>Annual Savings: ${calculatorResults.annualSavings}</li>
          <li>ROI: ${calculatorResults.roiPercentage}</li>
          <li>Payback Period: ${calculatorResults.paybackPeriod} months</li>
          <li>Current Buffering Rate: ${calculatorResults.currentBufferRate}</li>
          <li>Improved Buffering Rate: ${calculatorResults.improvedBufferRate}</li>
        </ul>
        <p>Our sales team will reach out within 24 hours to discuss these results in detail.</p>
        <p>Best regards,<br/>Your Sales Team</p>
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Emails sent successfully'
    });
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json(
      { error: 'Failed to send emails. Please try again later.' },
      { status: 500 }
    );
  }
}
