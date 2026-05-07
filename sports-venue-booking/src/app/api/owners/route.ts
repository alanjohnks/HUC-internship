import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      password,
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

    const owner = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "OWNER",

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

    return NextResponse.json(owner);
  } catch (error: any) {
    console.error("OWNER REGISTER ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to create owner",
      },
      { status: 500 }
    );
  }
}