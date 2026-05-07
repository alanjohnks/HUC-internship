import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";
import { requireRole } from "@/lib/requireRole";

export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req);

    await requireRole(user.id, "OWNER");

    const body = await req.json();

    const {
      venueId,
      startTime,
      endTime,
    } = body;

    if (!venueId || !startTime || !endTime) {
      return NextResponse.json(
        {
          error:
            "venueId, startTime and endTime are required",
        },
        { status: 400 }
      );
    }

    const venue = await prisma.venue.findUnique({
      where: {
        id: venueId,
      },
    });

    if (!venue) {
      return NextResponse.json(
        {
          error: "Venue not found",
        },
        { status: 404 }
      );
    }

    if (venue.ownerId !== user.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const parsedStart = new Date(startTime);
    const parsedEnd = new Date(endTime);

    if (parsedStart >= parsedEnd) {
      return NextResponse.json(
        {
          error:
            "End time must be greater than start time",
        },
        { status: 400 }
      );
    }

    const existingSlot = await prisma.slot.findFirst({
      where: {
        venueId,

        OR: [
          {
            startTime: {
              lte: parsedStart,
            },

            endTime: {
              gt: parsedStart,
            },
          },

          {
            startTime: {
              lt: parsedEnd,
            },

            endTime: {
              gte: parsedEnd,
            },
          },

          {
            startTime: {
              gte: parsedStart,
            },

            endTime: {
              lte: parsedEnd,
            },
          },
        ],
      },
    });

    if (existingSlot) {
      return NextResponse.json(
        {
          error:
            "A slot already exists within this time range",
        },
        { status: 400 }
      );
    }

    const slot = await prisma.slot.create({
      data: {
        venueId,
        startTime: parsedStart,
        endTime: parsedEnd,
      },
    });

    return NextResponse.json(slot);
  } catch (error: any) {
    console.error("CREATE SLOT ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to create slot",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const venueId = searchParams.get("venueId");

    const slots = await prisma.slot.findMany({
      where: {
        ...(venueId && { venueId }),

        isActive: true,
      },

      include: {
        venue: true,

        matches: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
        },
      },

      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(slots);
  } catch (error: any) {
    console.error("GET SLOT ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to fetch slots",
      },
      { status: 500 }
    );
  }
}