const nodemailer = require('nodemailer');
const { logger } = require('./logger');

// Email transporter configuration
const createTransporter = () => {
  // For development, use ethereal.email (fake SMTP service)
  // For production, configure with your actual email service
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || 'test@ethereal.email',
      pass: process.env.EMAIL_PASS || 'test-password'
    }
  });
};

// Send grievance submission confirmation email
const sendGrievanceConfirmation = async (userEmail, userName, grievanceId, category) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Grievance System" <noreply@grievance.edu>',
      to: userEmail,
      subject: 'Grievance Submitted Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4e73df;">Grievance Submitted Successfully</h2>
          <p>Dear ${userName},</p>
          <p>Your grievance has been successfully submitted and is being reviewed.</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>Grievance ID:</strong> #${grievanceId}<br>
            <strong>Category:</strong> ${category}<br>
            <strong>Status:</strong> Pending
          </div>
          <p>You can track the status of your grievance in your dashboard.</p>
          <p>We aim to respond within 48-72 hours.</p>
          <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info('Grievance confirmation email sent', { 
      messageId: info.messageId, 
      grievanceId, 
      recipient: userEmail 
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Failed to send grievance confirmation email', { 
      error: error.message, 
      grievanceId, 
      recipient: userEmail 
    });
    return { success: false, error: error.message };
  }
};

// Send status update notification email
const sendStatusUpdateEmail = async (userEmail, userName, grievanceId, newStatus, adminRemark) => {
  try {
    const transporter = createTransporter();
    
    const statusColors = {
      'Pending': '#ffc107',
      'In Progress': '#17a2b8',
      'Resolved': '#28a745',
      'Rejected': '#dc3545'
    };

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Grievance System" <noreply@grievance.edu>',
      to: userEmail,
      subject: `Grievance #${grievanceId} Status Update`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4e73df;">Grievance Status Updated</h2>
          <p>Dear ${userName},</p>
          <p>The status of your grievance has been updated.</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>Grievance ID:</strong> #${grievanceId}<br>
            <strong>New Status:</strong> <span style="color: ${statusColors[newStatus] || '#333'}; font-weight: bold;">${newStatus}</span>
          </div>
          ${adminRemark ? `
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <strong>Admin Remark:</strong><br>
              ${adminRemark}
            </div>
          ` : ''}
          <p>Please check your dashboard for more details.</p>
          <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info('Status update email sent', { 
      messageId: info.messageId, 
      grievanceId, 
      recipient: userEmail 
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Failed to send status update email', { 
      error: error.message, 
      grievanceId, 
      recipient: userEmail 
    });
    return { success: false, error: error.message };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (userEmail, userName, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Grievance System" <noreply@grievance.edu>',
      to: userEmail,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4e73df;">Password Reset Request</h2>
          <p>Dear ${userName},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #4e73df; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p style="color: #dc3545; font-weight: bold;">This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info('Password reset email sent', { 
      messageId: info.messageId, 
      recipient: userEmail 
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Failed to send password reset email', { 
      error: error.message, 
      recipient: userEmail 
    });
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendGrievanceConfirmation,
  sendStatusUpdateEmail,
  sendPasswordResetEmail
};
