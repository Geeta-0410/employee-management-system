import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { tokenBlacklist } from "../controllers/authController";

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        name: string;
        role: "user" | "admin" | "employee";
      };
    }
  }
}
// Verify Authentication
export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "No token provided",
      });
      return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Invalid authorization header",
      });
      return;
    }
    // Check blacklist
    if (tokenBlacklist.has(token)) {
      res.status(401).json({
        success: false,
        message: "Token has been revoked",
      });
      return;
    }
    const payload = await verifyToken(token);
    console.log("JWT Payload:", payload);
    req.user = {
      userId: payload.userId,
      email: payload.email,
      name: payload.name ?? "",
      role: payload.role,
    };
    console.log("req.user:", req.user);
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
// Role Based Authorization
export const checkRole = (
  allowedRoles: Array<"user" | "admin" | "employee">,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Forbidden: Insufficient permissions",
      });
      return;
    }
    next();
  };
};

// Admin Only Middleware
export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
  if (req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Admin access required",
    });
    return;
  }
  next();
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      if (token && !tokenBlacklist.has(token)) {
        const payload = await verifyToken(token);

        req.user = {
          userId: payload.userId,
          email: payload.email,
          name: payload.name ?? "",
          role: payload.role,
        };
      }
    }
    next();
  } catch {
    next();
  }
};
