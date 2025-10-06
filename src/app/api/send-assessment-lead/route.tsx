// /Users/abhijitbarua/Documents/aberdeena/abermainblitz/src/app/api/send-assessment-lead/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  // Environment variables
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;

  // Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  try {
    // 1. Check for required environment variables
    if (!resendApiKey || !emailFrom) {
      console.error('Server configuration error: Missing Resend environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: Missing Resend environment variables' },
        { status: 500 }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Server configuration error: Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: Missing Supabase environment variables' },
        { status: 500 }
      );
    }

    // 2. Initialize Resend and Supabase clients
    const resend = new Resend(resendApiKey);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Get the request body from modal form
    const {
      name,
      email,
      company,
      phone,
      projectType,
      timeline,
      message
    } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required fields' },
        { status: 400 }
      );
    }

    // 4. Store lead data in Supabase
    const leadData = {
      name: name,
      email: email,
      company: company || null,
      phone: phone || null,
      project_type: projectType || null,
      timeline: timeline || null,
      message: message || null,
      created_at: new Date().toISOString(),
      source: 'website_modal'
    };

    const { data: supabaseData, error: supabaseError } = await supabase
      .from('lead_assessment_reports')
      .insert([leadData])
      .select();

    if (supabaseError) {
      console.error('Supabase insert error:', supabaseError);
      // Continue with email even if Supabase fails, but log the error
    }

    // 5. Send confirmation email to user
    const userEmail = await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: 'Your Assessment Request Has Been Received',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Assessment Request Confirmed</h1>
                </div>
                <div class="content">
                    <p>Hi <strong>${name}</strong>,</p>

                    <p>Thank you for requesting an assessment with AberCXO! We've received your details and our team will review your requirements.</p>

                    <div class="details">
                        <h3>Request Details:</h3>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
                        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                        ${projectType ? `<p><strong>Project Type:</strong> ${projectType}</p>` : ''}
                        ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
                    </div>

                    <p><strong>What happens next?</strong></p>
                    <ul>
                        <li>Our technical team will review your project requirements</li>
                        <li>We'll schedule a discovery call to understand your specific needs</li>
                        <li>You'll receive a customized assessment proposal</li>
                    </ul>

                    <p>We typically respond within 24 working hours. If you have any urgent questions, please don't hesitate to reply to this email.</p>

                    <p>Best regards,<br>
                    <strong>Managing Partner</strong><br>
                    AberCXO</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} AberCXO. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `
    });

    // 6. Optional: Send internal notification email to your team
    const internalEmail = await resend.emails.send({
      from: emailFrom,
      to: emailFrom, // Send to yourself/your team
      subject: `New Assessment Lead: ${name} from ${company || 'Unknown Company'}`,
      html: `
        <h2>New Assessment Lead Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Project Type:</strong> ${projectType || 'Not specified'}</p>
        <p><strong>Timeline:</strong> ${timeline || 'Not specified'}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `
    });

    // 7. Return success response
    return NextResponse.json({
      success: true,
      message: 'Assessment request submitted successfully',
      data: {
        supabaseId: supabaseData?.[0]?.id,
        emailId: userEmail.id
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing assessment request:', error);
    return NextResponse.json(
      { error: 'Failed to process assessment request' },
      { status: 500 }
    );
  }
}
