import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP VERIFY ERROR:");
    console.error(error);
  } else {
    console.log("SMTP SERVER IS READY");
  }
});

export const sendOTPEmail = async (email: string, otp: string) => {
  console.log("Sending OTP to:", email);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Employee Management - Email Verification",
    html: `
      <h2>Email Verification</h2>
      <h1>${otp}</h1>
    `,
  });

  console.log("Mail Sent Successfully");
};

export const sendEmployeeCredentialsEmail = async (
  email: string,
  employeeName: string,
  tempPassword: string,
) => {
  console.log("Sending Employee Credentials To:", email);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: email,

    subject: "Employee Account Created",

    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        
        <h2>Hello ${employeeName},</h2>

        <p>
          Your employee account has been created successfully.
        </p>

        <p>
          <strong>Email:</strong>
          ${email}
        </p>

        <p>
          <strong>Temporary Password:</strong>
          ${tempPassword}
        </p>

        <p>
          Please login using these credentials and
          change your password after first login.
        </p>

        <br/>

        <p>
          Regards,<br/>
          Employee Management Team
        </p>

      </div>
    `,
  });

  console.log("Employee Credential Mail Sent Successfully");
};
