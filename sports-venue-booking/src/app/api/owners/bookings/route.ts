import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";
import { requireRole } from "@/lib/requireRole";

export async function GET(req: Request) {
  try {
    const user = getUserFromRequest(req);

    await requireRole(user.id, "OWNER");

    const matches = await prisma.match.findMany({
      where: {
        venue: {
          ownerId: user.id,
        },
      },

      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },

        venue: {
          select: {
            id: true,
            name: true,
            location: true,
            sport: true,
            pricePerHour: true,
            images: true,
          },
        },

        slot: true,

        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
              },
            },
          },
        },

        chatRoom: {
          include: {
            messages: {
              take: 1,
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedMatches = matches.map((match) => ({
      id: match.id,

      title: match.title,
      description: match.description,

      sport: match.sport,

      visibility: match.visibility,
      status: match.status,

      maxPlayers: match.maxPlayers,
      currentPlayers: match.currentPlayers,

      totalPrice: match.totalPrice,
      splitPrice: match.splitPrice,

      createdAt: match.createdAt,

      creator: match.creator,

      venue: match.venue,

      slot: match.slot,

      participants: match.participants,

      latestMessage:
        match.chatRoom?.messages?.[0] || null,
    }));

    return NextResponse.json(formattedMatches);
  } catch (error: any) {
    console.error("OWNER MATCHES ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to fetch matches",
      },
      { status: 500 }
    );
  }
}