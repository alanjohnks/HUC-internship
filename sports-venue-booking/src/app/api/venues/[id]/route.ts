import { getUserFromRequest } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/requireRole";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const venue = await prisma.venue.findUnique({
      where: {
        id: params.id,
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
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },

            participants: {
              include: {
                user: {
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
        },
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

    return NextResponse.json(venue);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch venue",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(req);

    await requireRole(user.id, "OWNER");

    const venue = await prisma.venue.findUnique({
      where: {
        id: params.id,
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

    const body = await req.json();

    const {
      name,
      sport,
      location,
      description,
      pricePerHour,
      images,
      approved,
    } = body;

    const updatedVenue = await prisma.venue.update({
      where: {
        id: params.id,
      },

      data: {
        ...(name && { name }),
        ...(sport && { sport }),
        ...(location !== undefined && { location }),
        ...(description !== undefined && { description }),
        ...(pricePerHour && {
          pricePerHour: Number(pricePerHour),
        }),
        ...(images && { images }),

        ...(approved !== undefined && {
          approved,
        }),
      },

      include: {
        owner: true,
        slots: true,
      },
    });

    return NextResponse.json(updatedVenue);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to update venue",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(req);

    await requireRole(user.id, "OWNER");

    const venue = await prisma.venue.findUnique({
      where: {
        id: params.id,
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

    await prisma.match.deleteMany({
      where: {
        venueId: params.id,
      },
    });

    await prisma.slot.deleteMany({
      where: {
        venueId: params.id,
      },
    });

    await prisma.venue.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Venue deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to delete venue",
      },
      { status: 500 }
    );
  }
}