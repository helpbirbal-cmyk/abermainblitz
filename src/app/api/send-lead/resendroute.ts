// app/api/send-lead/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Get the request body using await request.json()
    const { name, email, company, phone, calculatorResults } = await request.json();

    // Send email to sales team
    const salesEmail = await resend.emails.send({
      from: 'ROI Calculator <aberdeenassociates@aol.com>',
      to: 'absatya@aol.com',
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
    const userEmail = await resend.emails.send({
      from: 'Sales Team <noreply@yourdomain.com>',
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
        </ul>
        <p>Our sales team will reach out within 24 hours to discuss these results in detail.</p>
        <p>Best regards,<br/>Your Sales Team</p>
      `
    });

    // Return a NextResponse with the success message
    return NextResponse.json({
      success: true,
      message: 'Emails sent successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error sending emails:', error);
    // Return a NextResponse with the error message and a 500 status code
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
