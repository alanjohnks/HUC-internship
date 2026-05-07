import { getUserFromRequest } from "@/lib/getUser";

import { prisma } from "@/lib/prisma";

import { requireRole } from "@/lib/requireRole";

import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } =
      await context.params;

    const venue =
      await prisma.venue.findUnique(
        {
          where: { id },

          include: {
            slots: true,
          },
        }
      );

    if (!venue) {
      return NextResponse.json(
        {
          error: "Venue not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      venue
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } =
      await context.params;

    const authUser =
      getUserFromRequest(req);

    await requireRole(
      authUser.id,
      "OWNER"
    );

    const body =
      await req.json();

    const {
      name,
      sport,
      price,
      location,
    } = body;

    const existingVenue =
      await prisma.venue.findUnique(
        {
          where: { id },
        }
      );

    if (!existingVenue) {
      return NextResponse.json(
        {
          error:
            "Venue not found",
        },
        { status: 404 }
      );
    }

    if (
      existingVenue.ownerId !==
      authUser.id
    ) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        { status: 403 }
      );
    }

    const updatedVenue =
      await prisma.venue.update({
        where: { id },

        data: {
          name,
          sport,
          location,

          pricePerHour:
            Number(price),
        },

        include: {
          slots: true,
        },
      });

    return NextResponse.json(
      updatedVenue
    );
  } catch (error: any) {
    console.error(
      "UPDATE VENUE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to update venue",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } =
      await context.params;

    const authUser =
      getUserFromRequest(req);

    await requireRole(
      authUser.id,
      "OWNER"
    );

    const venue =
      await prisma.venue.findUnique(
        {
          where: { id },
        }
      );

    if (!venue) {
      return NextResponse.json(
        {
          error:
            "Venue not found",
        },
        { status: 404 }
      );
    }

    if (
      venue.ownerId !==
      authUser.id
    ) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        { status: 403 }
      );
    }

    await prisma.match.deleteMany({
      where: {
        venueId: id,
      },
    });

    await prisma.slot.deleteMany({
      where: {
        venueId: id,
      },
    });

    await prisma.venue.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error(
      "DELETE VENUE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to delete venue",
      },
      { status: 500 }
    );
  }
}