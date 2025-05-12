const nodemailer = require('nodemailer');

// Send email using nodemailer
const sendEmail = async (to, subject, html) => {
  try {
    // Create a test account on ethereal.email for development
    let testAccount = await nodemailer.createTestAccount();
    
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"SkinGenie" <noreply@skingenie.com>',
      to,
      subject,
      html
    });
    
    console.log(`Email sent to ${to}`);
    console.log(`Message ID: ${info.messageId}`);
    
    // Preview URL (only works with Ethereal)
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    
    return {
      success: true,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send password reset OTP email
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
  
  const result = await sendEmail(email, subject, html);
  
  // For development, log the preview URL
  if (result.previewUrl) {
    console.log(`Password reset email preview: ${result.previewUrl}`);
  }
  
  return result.success;
};

module.exports = {
  sendEmail,
  sendPasswordResetOTP
};