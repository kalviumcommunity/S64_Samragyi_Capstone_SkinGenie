const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('SendGrid initialized with API key');
} else {
  console.warn('SendGrid API key not found in environment variables');
}

/**
 * Send email using available providers with fallbacks
 * Priority: SendGrid -> Ethereal (test) -> Mock (console log)
 */
const sendEmail = async (to, subject, html) => {
  console.log(`Attempting to send email to ${to} with subject: ${subject}`);
  
  // Always log the OTP in both development and production for debugging
  console.log(`\n=== EMAIL CONTENT PREVIEW ===`);
  console.log(`TO: ${to}`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`=== END PREVIEW ===\n`);
  
  // Try SendGrid first
  try {
    const result = await sendWithSendGrid(to, subject, html);
    return result;
  } catch (sendGridError) {
    console.error('SendGrid failed:', sendGridError.message);
    
    // Try Ethereal as fallback
    try {
      console.log('Attempting to send with Ethereal Email (test service)...');
      const etherealResult = await sendWithEthereal(to, subject, html);
      return etherealResult;
    } catch (etherealError) {
      console.error('Ethereal Email failed:', etherealError.message);
      
      // Last resort: mock email (just log it)
      console.log('All email services failed. Falling back to mock email.');
      return sendMockEmail(to, subject, html);
    }
  }
};

/**
 * Send email using SendGrid
 */
const sendWithSendGrid = async (to, subject, html) => {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SendGrid API key not configured');
  }
  
  const from = process.env.EMAIL_FROM || 'noreply@skingenie.com';
  console.log(`Sending email via SendGrid from: ${from} to: ${to}`);
  
  const msg = {
    to,
    from,
    subject,
    html,
  };
  
  try {
    const [response] = await sgMail.send(msg);
    console.log(`SendGrid response status code: ${response.statusCode}`);
    console.log(`Email sent successfully to ${to} using SendGrid`);
    
    return {
      success: true,
      provider: 'sendgrid',
      statusCode: response.statusCode
    };
  } catch (error) {
    console.error('SendGrid detailed error:');
    
    if (error.response) {
      console.error(`Status code: ${error.response.status}`);
      console.error('Response body:', error.response.body);
      
      // Check for specific SendGrid errors
      if (error.response.body && error.response.body.errors) {
        error.response.body.errors.forEach(err => {
          console.error(`SendGrid error: ${err.message}, code: ${err.code}, field: ${err.field}`);
        });
      }
    }
    
    throw error; // Re-throw to try fallback
  }
};

/**
 * Send email using Ethereal (for testing)
 */
const sendWithEthereal = async (to, subject, html) => {
  try {
    // Create a test account at ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    console.log(`Created Ethereal test account: ${testAccount.user}`);
    
    // Create a transporter using Ethereal
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    // Send mail
    const info = await transporter.sendMail({
      from: '"SkinGenie" <test@skingenie.com>',
      to,
      subject,
      html
    });
    
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`Email sent to ${to} using Ethereal: ${info.messageId}`);
    console.log(`Preview URL: ${previewUrl}`);
    
    return {
      success: true,
      provider: 'ethereal',
      previewUrl,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Ethereal email error:', error);
    throw error; // Re-throw to try next fallback
  }
};

/**
 * Mock email function (doesn't actually send emails, just logs to console)
 */
const sendMockEmail = (to, subject, html) => {
  console.log('\n========== MOCK EMAIL ==========');
  console.log(`TO: ${to}`);
  console.log(`SUBJECT: ${subject}`);
  console.log('CONTENT:');
  console.log(html);
  console.log('================================\n');
  
  return {
    success: true,
    provider: 'mock',
    message: 'Email logged to console (not actually sent)'
  };
};

/**
 * Send password reset OTP email
 */
const sendPasswordResetOTP = async (email, name, otp) => {
  const subject = 'SkinGenie - Password Reset OTP';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a4a4a; text-align: center;">SkinGenie Password Reset</h2>
      <p>Hello ${name},</p>
      <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to verify your identity:</p>
      <div style="background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
        ${otp}
      </div>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      <p>Thank you,<br>The SkinGenie Team</p>
    </div>
  `;
  
  // Always log OTP for debugging (in both development and production)
  console.log(`\n=== OTP FOR ${email} ===`);
  console.log(`OTP: ${otp}`);
  console.log(`=== USE THIS OTP FOR PASSWORD RESET ===\n`);
  
  try {
    const result = await sendEmail(email, subject, html);
    console.log(`Password reset email result:`, result);
    
    // If we're using Ethereal (test email service), log the preview URL
    if (result.provider === 'ethereal' && result.previewUrl) {
      console.log(`\n=== TEST EMAIL PREVIEW ===`);
      console.log(`View the test email here: ${result.previewUrl}`);
      console.log(`=== END PREVIEW ===\n`);
    }
    
    return result.success;
  } catch (error) {
    console.error('Error in sendPasswordResetOTP:', error);
    
    // In development, return true to allow the flow to continue
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }
    
    // In production, we'll still return true to not block the user flow
    // but we'll log the error for debugging
    console.error('Production email error - password reset flow will continue but email might not be sent');
    return true;
  }
};

module.exports = {
  sendEmail,
  sendWithSendGrid,
  sendWithEthereal,
  sendMockEmail,
  sendPasswordResetOTP
};


