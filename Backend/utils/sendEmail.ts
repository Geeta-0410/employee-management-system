import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("Email transporter config:", {
  emailUser: !!process.env.EMAIL_USER,
  emailPass: !!process.env.EMAIL_PASS,
});

transporter.verify((error: any, success: boolean) => {
  if (error) {
    console.error("Email transporter verification failed:", error);
    const code = (error && (error as any).code) || (error && (error as any).errno);
    if (code === "ENETUNREACH" || code === "EHOSTUNREACH") {
      console.error(
        "Network error when connecting to SMTP server (ENETUNREACH/EHOSTUNREACH). Host may block outbound SMTP. Consider using an API email provider or ensuring IPv4 access.",
      );
    }
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
    return false;
  }

  try {
    console.log("Sending OTP via SMTP to", email);
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Employee Management - Email Verification",
      html: `<h2>Your OTP is ${otp}</h2>`,
    });
    console.log("sendMail finished");
console.log(info);

    console.log("OTP Mail sent:", info.messageId, info.response);
    return true;
  } catch (err: any) {
    console.error("SendMail Error (OTP):", {
      message: err?.message,
      code: err?.code,
      response: err?.response,
      stack: err?.stack,
    });
    return false;
  }
};

export const sendEmployeeCredentialsEmail = async (
  email: string,
  employeeName: string,
  tempPassword: string,
) => {
  console.log("========== sendEmployeeCredentialsEmail CALLED ==========");
  console.log("Email:", email);
console.log("Employee Name:", employeeName);
console.log("Temp Password:", tempPassword);
  console.log("Preparing to send employee credentials to:", email);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      "EMAIL_USER or EMAIL_PASS not set. Skipping sending employee credentials.",
      { email },
    );
    return false;
  }

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

  try {
    console.log("Sending employee credentials via SMTP to", email);
    const info = await transporter.sendMail({
      // from: `"Employee Management" <${process.env.EMAIL_USER}>`,
      from: `"Employee Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
    });

    console.log(
      "Employee Credential Mail Sent Successfully",
      info.messageId,
      info.response,
    );
    return true;
  } catch (err: any) {
    console.error("Failed to send employee credentials email:", {
      message: err?.message,
      code: err?.code,
      response: err?.response,
      responseCode: err?.responseCode,
      stack: err?.stack,
    });
    return false;
  }
};
