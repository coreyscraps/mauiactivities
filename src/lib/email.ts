import sgMail from '@sendgrid/mail';
import { supabaseAdmin } from './supabase';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@mauiactivitieshu.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(email: string, userName: string): Promise<void> {
  const html = `
    <h2>Welcome to Maui Activities Hub, ${userName}!</h2>
    <p>We're excited to have you join our community.</p>
    <p>Your 180-day pass is now active. Start exploring amazing activities in Maui!</p>
    <p>Questions? Contact us at ${FROM_EMAIL}</p>
  `;

  await logAndSendEmail(
    {
      to: email,
      subject: 'Welcome to Maui Activities Hub',
      html,
      text: `Welcome to Maui Activities Hub, ${userName}! Your 180-day pass is now active.`,
    },
    email,
    'welcome'
  );
}

/**
 * Send pass expiry reminder (30 days before)
 */
export async function sendPassExpiry30DaysEmail(
  email: string,
  userName: string,
  daysRemaining: number
): Promise<void> {
  const html = `
    <h2>Your Pass Expires Soon</h2>
    <p>Hi ${userName},</p>
    <p>Your Maui Activities Hub pass will expire in ${daysRemaining} days.</p>
    <p>Don't miss out! Renew now for just $10 and continue enjoying exclusive discounts on activities.</p>
    <a href="${process.env.NEXT_PUBLIC_API_URL}/renew" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Renew Your Pass</a>
  `;

  await logAndSendEmail(
    {
      to: email,
      subject: 'Your Pass Expires in 30 Days',
      html,
      text: `Hi ${userName}, your pass expires in ${daysRemaining} days. Renew now for just $10.`,
    },
    email,
    'pass_expiry_30'
  );
}

/**
 * Send pass expiry reminder (7 days before)
 */
export async function sendPassExpiry7DaysEmail(
  email: string,
  userName: string,
  daysRemaining: number
): Promise<void> {
  const html = `
    <h2>Urgent: Your Pass Expires Soon!</h2>
    <p>Hi ${userName},</p>
    <p>Your Maui Activities Hub pass will expire in just ${daysRemaining} days.</p>
    <p>Act now to maintain your exclusive discounts. Renew for only $10!</p>
    <a href="${process.env.NEXT_PUBLIC_API_URL}/renew" style="background-color: #ff6b6b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Renew Now</a>
  `;

  await logAndSendEmail(
    {
      to: email,
      subject: 'URGENT: Your Pass Expires in 7 Days',
      html,
      text: `Hi ${userName}, your pass expires in ${daysRemaining} days. Renew now!`,
    },
    email,
    'pass_expiry_7'
  );
}

/**
 * Send renewal offer email
 */
export async function sendRenewalOfferEmail(
  email: string,
  userName: string
): Promise<void> {
  const html = `
    <h2>Your Pass Has Expired</h2>
    <p>Hi ${userName},</p>
    <p>Your Maui Activities Hub pass has expired, but don't worry!</p>
    <p>Renew your pass today for just $10 and unlock exclusive discounts again.</p>
    <a href="${process.env.NEXT_PUBLIC_API_URL}/renew" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Renew Your Pass</a>
  `;

  await logAndSendEmail(
    {
      to: email,
      subject: 'Renew Your Maui Activities Hub Pass',
      html,
      text: `Hi ${userName}, your pass has expired. Renew now for just $10!`,
    },
    email,
    'renewal_offer'
  );
}

/**
 * Send vendor onboarding email
 */
export async function sendVendorOnboardingEmail(
  email: string,
  businessName: string,
  activationLink: string
): Promise<void> {
  const html = `
    <h2>Welcome to Maui Activities Hub Vendor Program</h2>
    <p>Dear ${businessName},</p>
    <p>Congratulations! Your vendor account has been created.</p>
    <p>Click below to complete your profile and start adding activities:</p>
    <a href="${activationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Activate Your Account</a>
    <p>If you have any questions, contact our vendor support team.</p>
  `;

  await logAndSendEmail(
    {
      to: email,
      subject: 'Welcome to Maui Activities Hub Vendor Program',
      html,
      text: `Welcome to Maui Activities Hub Vendor Program, ${businessName}!`,
    },
    email,
    'vendor_onboarding'
  );
}

/**
 * Send generic email and log it
 */
export async function logAndSendEmail(
  mailOptions: EmailTemplate,
  recipientEmail: string,
  emailType: string,
  userId?: string
): Promise<void> {
  try {
    // Log email to database
    const { error: logError } = await supabaseAdmin.from('email_logs').insert({
      user_id: userId || null,
      email_type: emailType,
      recipient_email: recipientEmail,
      status: 'pending',
    });

    if (logError) {
      console.error('Error logging email:', logError);
    }

    // Send email
    if (SENDGRID_API_KEY) {
      const msg = {
        to: mailOptions.to,
        from: FROM_EMAIL,
        subject: mailOptions.subject,
        html: mailOptions.html,
        text: mailOptions.text || mailOptions.html,
      };

      const response = await sgMail.send(msg);

      // Update email log with success
      if (response[0].statusCode === 202) {
        await supabaseAdmin
          .from('email_logs')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            sendgrid_message_id: response[0].headers['x-message-id'],
          })
          .eq('recipient_email', recipientEmail)
          .eq('email_type', emailType);
      }
    }
  } catch (error) {
    console.error('Error sending email:', error);

    // Update email log with error
    await supabaseAdmin
      .from('email_logs')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('recipient_email', recipientEmail)
      .eq('email_type', emailType);
  }
}

/**
 * Send a custom email
 */
export async function sendCustomEmail(
  to: string,
  subject: string,
  html: string,
  userId?: string
): Promise<void> {
  await logAndSendEmail(
    {
      to,
      subject,
      html,
    },
    to,
    'custom',
    userId
  );
}
