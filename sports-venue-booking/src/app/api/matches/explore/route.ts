import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // fetch open matches with slot
    const openMatches = await prisma.match.findMany({
      where: {
        status: "OPEN",
      },

      include: {
        slot: true,
      },
    });

    // filter expired matches
    const expiredMatches = openMatches.filter(
      (match) =>
        match.slot?.endTime &&
        new Date(match.slot.endTime) < new Date()
    );

    // update them to COMPLETED
    if (expiredMatches.length > 0) {
      await prisma.match.updateMany({
        where: {
          id: {
            in: expiredMatches.map((m) => m.id),
          },
        },

        data: {
          status: "COMPLETED",
        },
      });
    }

    // fetch public matches
    const matches = await prisma.match.findMany({
      where: {
        visibility: "PUBLIC",
      },

      include: {
        creator: true,
        venue: true,

        slot: true,

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