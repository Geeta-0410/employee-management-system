import { FirebaseRequest } from "../middleware/verifyFirebaseToken";
import { Request, Response } from "express";
import User from "../models/user";
import { generateToken } from "../utils/jwt";
import { generateOTP } from "../utils/generateOtp";
import { sendOTPEmail } from "../utils/sendEmail";
import { z } from "zod";
import Otp from "../models/otps";
import crypto from "crypto";
import Employee from "../models/employee";
import bcrypt from "bcrypt";

// Zod Schemas

const SignupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const EmployeeLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// SIGNUP

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = SignupSchema.parse(req.body);

    const existingUser = await User.findOne({ email });

    const otp = generateOTP();

    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    if (existingUser) {
      res.status(409).json({
        message: "User already exists with this email",
      });
      return;
    }

    await Otp.findOneAndDelete({ email });

    await Otp.create({
      name,
      email,
      password,
      otp,
      expiresAt: otpExpires,
    });

    console.log("Generated OTP:", otp);

    await sendOTPEmail(email, otp);

    console.log("OTP Email Sent");

    res.status(201).json({
      success: true,
      message: "OTP sent successfully",
      email,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
      return;
    }

    console.error("Signup Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
};
// LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const user = await User.findOne({ email }).select("+password");

    console.log("User Found:", user);

    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        message: "User account is inactive",
      });
      return;
    }
    const isPasswordValid = await user.comparePassword(password);

    console.log("Entered Password:", password);
    console.log("Password Match:", isPasswordValid);

    if (!isPasswordValid) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }
    const token = await generateToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,

      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    // console.log("Generated Token:", token);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
      return;
    }

    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
};

export const getCurrentUser = async (
  req: Request & { user?: any },
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        employeeId: user._id,

        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Get Current User Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
};

const tokenBlacklist = new Set<string>();

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      tokenBlacklist.add(token);
    }

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
};
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}, "name email role");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const otpData = await Otp.findOne({ email });

    if (!otpData) {
      res.status(404).json({
        success: false,
        message: "OTP not found. Please signup again.",
      });
      return;
    }

    if (otpData.otp !== otp) {
      res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
      return;
    }

    if (otpData.expiresAt < new Date()) {
      await Otp.deleteOne({ email });

      res.status(400).json({
        success: false,
        message: "OTP has expired",
      });

      return;
    }

    await User.create({
      name: otpData.name,
      email: otpData.email,
      password: otpData.password,
      role: "user",
      isVerified: true,
    });

    await Otp.deleteOne({ email });

    res.status(200).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "OTP Verification Failed",
    });
  }
};
export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: "Resend OTP API Working",
  });
};

export const uploadProfileImage = async (
  req: Request & { user?: any },
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
      return;
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        profileImage: imagePath,
      },
      {
        new: true,
      },
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Upload Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload profile image.",
    });
  }
};
export const employeeLogin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = EmployeeLoginSchema.parse(req.body);

    const employee = await Employee.findOne({
      email,
    });

    console.log("Employee Found:", employee);

    if (!employee) {
      res.status(401).json({
        message: "Invalid credentials",
      });

      return;
    }

    const isMatch = await bcrypt.compare(password, employee.password);

    console.log("Entered Password:", password);

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      res.status(401).json({
        message: "Invalid credentials",
      });

      return;
    }

    const token = await generateToken({
      userId: employee._id.toString(),

      email: employee.email,

      name: employee.name,

      role: employee.role,
    });

    res.status(200).json({
      success: true,

      token,

      role: employee.role,

      isFirstLogin: employee.isFirstLogin,

      employee: {
        employeeId: employee.employeeId,

        name: employee.name,

        email: employee.email,
      },
    });
  } catch (error) {
    console.error("Employee Login Error:", error);

    res.status(500).json({
      message: "Employee Login Failed",
    });
  }
};
export const changeEmployeePassword = async (
  req: Request & { user?: any },
  res: Response,
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    const employee = await Employee.findById(req.user.userId);

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    const isMatch = await bcrypt.compare(currentPassword, employee.password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid current password" });
      return;
    }

    employee.password = await bcrypt.hash(newPassword, 10);
    employee.isFirstLogin = false;

    await employee.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch {
    res.status(500).json({ message: "Change password failed" });
  }
};

export const googleLogin = async (
  req: FirebaseRequest,
  res: Response,
): Promise<void> => {
  try {
    const firebaseUser = req.firebaseUser;

    if (!firebaseUser) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    let user = await User.findOne({
      email: firebaseUser.email,
    });

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");

      user = await User.create({
        name: firebaseUser.name || "Google User",
        email: firebaseUser.email!,
        password: randomPassword,
        role: "user",
        isVerified: true,
        isActive: true,
        profileImage: firebaseUser.picture || "",
      });
    }

    const token = await generateToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: "Google Login Successful",
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Google Login Failed",
    });
  }
};

export { tokenBlacklist };
