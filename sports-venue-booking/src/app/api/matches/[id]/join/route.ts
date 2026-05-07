import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getAuthUser } from "@/lib/auth";

import { sendNotification } from "@/lib/sendNotification";

export async function POST(
  req: NextRequest,

  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const authUser = await getAuthUser(req);

    const match = await prisma.match.findUnique({
      where: {
        id,
      },
    });

    if (!match) {
      return NextResponse.json(
        {
          error: "Match not found",
        },
        {
          status: 404,
        }
      );
    }

    if (
      match.currentPlayers >=
      match.maxPlayers
    ) {
      return NextResponse.json(
        {
          error: "Match full",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await prisma.matchParticipant.findFirst({
        where: {
          matchId: id,
          userId: authUser.id,
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          error: "Already joined",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.matchParticipant.create({
      data: {
        matchId: id,

        userId: authUser.id,

        paymentStatus: "PAID",

        amountPaid: match.splitPrice,
      },
    });

    const updatedMatch =
      await prisma.match.update({
        where: {
          id,
        },

        data: {
          currentPlayers: {
            increment: 1,
          },
        },
      });

    if (
      updatedMatch.currentPlayers >=
      updatedMatch.maxPlayers
    ) {
      await prisma.match.update({
        where: {
          id,
        },

        data: {
          status: "FULL",
        },
      });
    }

    await sendNotification({
      senderId: authUser.id,

      receiverId: match.creatorId,

      type: "MATCH_JOINED",

      title: "New Player Joined",

      message:
        "Someone joined your match",

      matchId: match.id,
    });

    return NextResponse.json({
      message: "Joined successfully",
    });
  } catch (error: any) {
    console.error("JOIN MATCH ERROR:", error);

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to join match",
      },
      {
        status: 500,
      }
    );
  }
}