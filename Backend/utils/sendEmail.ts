import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: process.env.EMAIL_USER && process.env.EMAIL_PASS
    ? {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    : undefined,
  secure: false,
  authMethod: "LOGIN",
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
  debug: process.env.NODE_ENV !== "production",
});

console.log("Email transporter config:", {
  emailUser: !!process.env.EMAIL_USER,
  emailPass: !!process.env.EMAIL_PASS,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter verification failed:", error);
  } else {
    console.log("Email transporter verified successfully.", success);
  }
});
export const sendOTPEmail = async (email: string, otp: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      "EMAIL_USER or EMAIL_PASS is not set. Skipping OTP email delivery.",
      { email, otp },
    );
    return;
  }

  try {
    console.log("Sending OTP...");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Employee Management - Email Verification",
      html: `<h2>Your OTP is ${otp}</h2>`,
    });

    console.log("Mail sent:", info.messageId);
  } catch (err) {
    console.error("SendMail Error:", err);
    console.warn(
      "OTP email delivery failed, but signup will continue. Verify OTP manually or fix email config.",
    );
  }
};
export const sendEmployeeCredentialsEmail = async (
  email: string,
  employeeName: string,
  tempPassword: string,
) => {
  console.log("Preparing to send employee credentials to:", email);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      "EMAIL_USER or EMAIL_PASS not set. Skipping sending employee credentials.",
      { email },
    );
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Employee Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Employee Account Created",
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello ${employeeName},</h2>
        <p>Your employee account has been created successfully.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p>Please login using these credentials and change your password after first login.</p>
        <br/>
        <p>Regards,<br/>Employee Management Team</p>
      </div>
    `,
    });

    console.log(
      "Employee Credential Mail Sent Successfully",
      info.messageId,
      info.response,
    );
    return true;
  } catch (err: any) {
    console.error("Failed to send employee credentials email:", {
      message: err.message,
      code: err.code,
      response: err.response,
      responseCode: err.responseCode,
      stack: err.stack,
    });
    return false;
  }
};
