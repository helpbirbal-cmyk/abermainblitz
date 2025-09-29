// app/api/send-lead/route.tsx

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// NOTE: You can keep these global, but the key initialization must be checked carefully.
// The best practice is to initialize the client *inside* the function,
// after verifying the environment variables.

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;

  try {
    // 1. Check for required environment variables first
    if (!resendApiKey || !emailFrom) {
      console.error('Server configuration error: Missing required environment variables');
      return NextResponse.json(
        {
          error: 'Server configuration error: Missing required environment variables'
        },
        { status: 500 } // This 500 status causes "email failed" on the client
      );
    }

    // 2. Initialize Resend here, after validation
    const resend = new Resend(resendApiKey);

    // 3. Get the request body
    const { name, email, company, phone, calculatorResults } = await request.json();

    // 4. Send email to sales team
    const salesEmail = await resend.emails.send({
      from: emailFrom, // Use the checked variable
      to: 'aberdeenassociate@gmail.com',
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

    // 5. Send confirmation email to user
    const userEmail = await resend.emails.send({
      from: emailFrom, // Use the checked variable
      to: email,
      subject: 'Your Resend Analysis Report',
      html: `
        <h2>Thank you for using our ROI Calculator!</h2>
        <p>Hi ${name},</p>
        <p>We've received your information and will contact you shortly to discuss your personalized ROI analysis.</p>
        <h3>Your Estimated Impact:</h3>
        <pre>${JSON.stringify(calculatorResults, null, 2)}</pre>
        <p>Our sales team may reach out within 24 hours to discuss these results in detail.</p>
        <p>Best regards,<br/>Your Sales Team</p>
      `
    });

    // 6. Return success
    return NextResponse.json({
      success: true,
      message: 'Emails sent successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error sending emails (Resend API likely failed):', error);
    // This 500 status is what the client-side ROICalculator.tsx receives.
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
