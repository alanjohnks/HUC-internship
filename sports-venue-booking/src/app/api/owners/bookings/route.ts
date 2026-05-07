import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/getUser";

import { requireRole } from "@/lib/requireRole";

export async function GET(req: Request) {
  try {
    const user =
      getUserFromRequest(req);

    await requireRole(
      user.id,
      "OWNER"
    );

    const bookings =
      await prisma.matchParticipant.findMany(
        {
          where: {
            match: {
              venue: {
                ownerId:
                  user.id,
              },
            },
          },

          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
              },
            },

            match: {
              include: {
                venue: {
                  select: {
                    id: true,
                    name: true,
                    location: true,
                    sport: true,
                    images: true,
                  },
                },
              },
            },
          },
        }
      );

    return NextResponse.json(
      bookings
    );
  } catch (error: any) {
    console.error(
      "OWNER BOOKINGS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to fetch bookings",
      },
      { status: 500 }
    );
  }
}