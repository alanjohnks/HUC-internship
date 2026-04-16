import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  role: string;
}


const SECRET = process.env.JWT_SECRET!;

export function signToken(user: any) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, SECRET) as JwtPayload;

  return {
    id: decoded.id as string,
    role: decoded.role as string,
  };
}
