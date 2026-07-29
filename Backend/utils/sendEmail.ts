import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER;
const SENDER_NAME = process.env.BREVO_SENDER_NAME || "Employee Management";

console.log("Brevo email config:", {
  apiKey: !!BREVO_API_KEY,
  senderEmail: !!SENDER_EMAIL,
});

const sendViaBrevoAPI = async (
  toEmail: string,
  toName: string,
  subject: string,
  html: string,
): Promise<boolean> => {
  if (!BREVO_API_KEY || !SENDER_EMAIL) {
    console.warn(
      "BREVO_API_KEY or sender email is not set. Skipping email delivery.",
      { toEmail },
    );
    return false;
  }

  try {
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: toEmail, name: toName }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    console.log("Brevo email sent successfully:", response.data?.messageId);
    return true;
  } catch (err: any) {
    console.error("Failed to send email via Brevo:", {
      message: err?.message,
      status: err?.response?.status,
      data: err?.response?.data,
    });
    return false;
  }
};

export const sendOTPEmail = async (email: string, otp: string) => {
  console.log("Sending OTP via Brevo to", email);
  const html = `<h2>Your OTP is ${otp}</h2>`;
  return sendViaBrevoAPI(
    email,
    email,
    "Employee Management - Email Verification",
    html,
  );
};

export const sendEmployeeCredentialsEmail = async (
  email: string,
  employeeName: string,
  tempPassword: string,
) => {
  console.log("========== sendEmployeeCredentialsEmail CALLED ==========");
  console.log("Target:", { email, employeeName, tempPassword });

  const subject = "Employee Account Created";
  const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello ${employeeName},</h2>
        <p>Your employee account has been created successfully.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p>Please login using these credentials and change your password after first login.</p>
        <br/>
        <p>Regards,<br/>Employee Management Team</p>
      </div>
    `;

  console.log("Sending employee credentials via Brevo to", email);
  const sent = await sendViaBrevoAPI(email, employeeName, subject, html);
  console.log("Employee credentials email sent:", sent);
  return sent;
};