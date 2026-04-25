import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserFromRequest } from "@/lib/getUser";

// CREATE USER
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // 🔒 FIXED
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//UPDATE
export async function PUT(req: Request) {
  try {
    const user = getUserFromRequest(req);

    const body = await req.json();
    const { name, email } = body;

    // 🔒 Basic validation
    if (!name || !email) {
      throw new Error("Name and email are required");
    }

    const existing = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: user.id },
      },
    });

    if (existing) {
      throw new Error("Email already in use");
    }

    // ✅ Update current user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Update failed" },
      { status: 400 },
    );
  }
}
