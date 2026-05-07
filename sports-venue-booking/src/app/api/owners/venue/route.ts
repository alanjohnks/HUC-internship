import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";
import { requireRole } from "@/lib/requireRole";

export async function GET(req: Request) {
  try {
    const user = getUserFromRequest(req);

    await requireRole(user.id, "OWNER");

    const venues = await prisma.venue.findMany({
      where: {
        ownerId: user.id,
      },

      include: {
        slots: {
          where: {
            isActive: true,
          },

          orderBy: {
            startTime: "asc",
          },

          include: {
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
            },
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

        _count: {
          select: {
            matches: true,
            slots: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(venues);
  } catch (error: any) {
    console.error("OWNER VENUES ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to fetch venues",
      },
      { status: 500 }
    );
  }
}