import { Request, Response, NextFunction } from "express";
import { firebaseAuth } from "../services/firebaseAdmin";

export interface FirebaseRequest extends Request {
  firebaseUser?: any;
}

export const verifyFirebaseToken = async (
  req: FirebaseRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
      return;
    }

    if (!authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
      return;
    }

    const idToken = authHeader.split("Bearer ")[1];

    const decodedToken = await firebaseAuth.verifyIdToken(idToken);

    req.firebaseUser = decodedToken;

    next();
  } catch (error) {
    console.error("Firebase Verify Error:", error);

    res.status(401).json({
      success: false,
      message: "Invalid Firebase Token",
    });
  }
};
