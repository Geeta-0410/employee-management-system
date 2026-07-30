import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
  name?: string;
  role: "user" | "admin" | "employee";
}

export const generateToken = (payload: JwtPayload): string => {

  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export const verifyToken = (token: string): JwtPayload => {

  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
};
