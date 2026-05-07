import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      password,
      role,
      bio,
      profileImage,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: "Name, email and password are required",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 6 characters",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User already exists",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const normalizedRole =
      role?.toUpperCase() === "OWNER"
        ? "OWNER"
        : "USER";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,

        role: normalizedRole,

        bio: bio || null,
        profileImage: profileImage || null,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        profileImage: true,
        createdAt: true,
      },
    });

    const token = signToken(user);

    return NextResponse.json({
      message: "Signup successful",

      token,

      user,
    });
  } catch (error: any) {
    console.error("SIGNUP ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}