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
      "ADMIN"
    );

    const bookings =
      await prisma.matchParticipant.findMany(
        {
          include: {
            user: true,

            match: {
              include: {
                venue: true,

                slot: true,

                creator: true,
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
      "ADMIN BOOKINGS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to fetch bookings",
      },
      {
        status: 500,
      }
    );
  }
}