import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendPasswordResetEmailOptions {
  email: string;
  name: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({
  email,
  name,
  resetUrl,
}: SendPasswordResetEmailOptions) {
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Reset Your Password - Admin Panel",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #111827; padding: 32px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Admin Panel</h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 32px;">
                        <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 20px; font-weight: 600;">Password Reset Request</h2>
                        <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          Hi ${name},
                        </p>
                        <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          We received a request to reset your password for your admin account. Click the button below to create a new password:
                        </p>
                        
                        <!-- CTA Button -->
                        <table role="presentation" style="border-collapse: collapse;">
                          <tr>
                            <td style="border-radius: 6px; background-color: #111827;">
                              <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 24px 0 0 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
                          This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 24px 32px; text-align: center;">
                        <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                          This is an automated message. Please do not reply to this email.
                        </p>
                        <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
                          If you need help, contact your system administrator.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Failed to send password reset email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

interface SendAnnouncementEmailOptions {
  to: string;
  name: string;
  subject: string;
  body: string;
  unsubscribeToken: string;
}

export async function sendAnnouncementEmail({
  to,
  name,
  subject,
  body,
  unsubscribeToken,
}: SendAnnouncementEmailOptions) {
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const unsubscribeUrl = `${baseUrl}/api/subscribers/unsubscribe/${unsubscribeToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #111827; padding: 32px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Newsletter</h1>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 32px;">
                        <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          Hi ${name},
                        </p>
                        <div style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                          ${body.replace(/\n/g, "<br>")}
                        </div>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 24px 32px; text-align: center;">
                        <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                          You received this email because you subscribed to our newsletter.
                        </p>
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                          <a href="${unsubscribeUrl}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Failed to send announcement email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending announcement email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
