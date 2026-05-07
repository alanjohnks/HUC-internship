import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      where: {
        visibility: "PUBLIC",
        status: "OPEN",
      },

      include: {
        creator: true,
        venue: true,
        participants: {
          include: {
            user: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(matches);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}