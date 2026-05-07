import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest } from "next/server";

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
export async function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  const user = verifyToken(token);

  return user;
}