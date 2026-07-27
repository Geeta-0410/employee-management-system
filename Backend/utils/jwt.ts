import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
  name?: string;
  role: "user" | "admin" | "employee";
}

export const generateToken = (payload: JwtPayload): string => {
  // console.log("Signing Secret:", process.env.JWT_SECRET);

  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export const verifyToken = (token: string): JwtPayload => {
  // console.log("JWT_SECRET:", process.env.JWT_SECRET);

  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
};
