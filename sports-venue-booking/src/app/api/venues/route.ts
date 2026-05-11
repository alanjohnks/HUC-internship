import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/requireRole";
import { getUserFromRequest } from "@/lib/getUser";

export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req);

    await requireRole(user.id, "OWNER");

    const body = await req.json();

    const {
      name,
      sport,
      pricePerHour,
      location,
      description,
      images,
    } = body;

    if (!name || !sport || !pricePerHour) {
      return NextResponse.json(
        {
          error: "name, sport and pricePerHour are required",
        },
        { status: 400 }
      );
    }

    const today = new Date();

    const slotTemplates = [
      { start: 6, end: 7 },
      { start: 7, end: 8 },
      { start: 8, end: 9 },
      { start: 9, end: 10 },
      { start: 10, end: 11 },
      { start: 11, end: 12 },
      { start: 12, end: 13 },
      { start: 13, end: 14 },
      { start: 14, end: 15 },
      { start: 15, end: 16 },
      { start: 16, end: 17 },
      { start: 17, end: 18 },
      { start: 18, end: 19 },
      { start: 19, end: 20 },
      { start: 20, end: 21 },
    ];

    const slots = slotTemplates.map((slot) => {
      const startTime = new Date(today);
      startTime.setHours(slot.start, 0, 0, 0);

      const endTime = new Date(today);
      endTime.setHours(slot.end, 0, 0, 0);

      return {
        startTime,
        endTime,
      };
    });

    const venue = await prisma.venue.create({
      data: {
        name,
        sport,
        pricePerHour: Number(pricePerHour),
        location: location || null,
        description: description || null,
        images: images || [],
        ownerId: user.id,
        approved: false,

        slots: {
          create: slots,
        },
      },

      include: {
        slots: true,
        owner: true,
      },
    });

    return NextResponse.json(venue);
  } catch (error: any) {
    console.error("CREATE VENUE ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to create venue",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const venues = await prisma.venue.findMany({
      where: {
        approved: true,
      },

      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },

        slots: {
          where: {
            isActive: true,
          },

          orderBy: {
            startTime: "asc",
          },
        },

        matches: {
          where: {
            status: {
              not: "CANCELLED",
            },
          },

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
        createdAt: "desc",
      },
    });

    const formattedVenues = venues.map(
      (venue) => ({
        ...venue,

        slots: venue.slots.map((slot) => {
          const isBooked =
            venue.matches.some(
              (match) =>
                match.slotId === slot.id
            );

          return {
            ...slot,
            isBooked,
          };
        }),
      }),
    );

    return NextResponse.json(
      formattedVenues
    );
  } catch (error: any) {
    console.error(
      "VENUES ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to fetch venues",
      },
      { status: 500 }
    );
  }
}