import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserFromRequest } from "@/lib/getUser";

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

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,

        role:
          role &&
          ["USER", "OWNER", "ADMIN"].includes(role)
            ? role
            : "USER",

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

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("CREATE USER ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to create user",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const authUser = getUserFromRequest(req);

    const body = await req.json();

    const {
      name,
      email,
      bio,
      profileImage,
      password,
    } = body;

    const currentUser = await prisma.user.findUnique({
      where: {
        id: authUser.id,
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id: authUser.id,
          },
        },
      });

      if (existingEmail) {
        return NextResponse.json(
          {
            error: "Email already in use",
          },
          { status: 400 }
        );
      }
    }

    let hashedPassword;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: authUser.id,
      },

      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(bio !== undefined && { bio }),
        ...(profileImage !== undefined && {
          profileImage,
        }),
        ...(hashedPassword && {
          password: hashedPassword,
        }),
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,

        _count: {
          select: {
            followers: true,
            following: true,
            createdMatches: true,
          },
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("UPDATE USER ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to update user",
      },
      { status: 500 }
    );
  }
}