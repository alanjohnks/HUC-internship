import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getAuthUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{ matchId: string }>;
  },
) {
  try {
    const { matchId } = await context.params;

    await getAuthUser(req);

    const room = await prisma.chatRoom.findUnique({
      where: {
        matchId: matchId,
      },

      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
                bio: true,
              },
            },
          },

          orderBy: {
            id: "asc",
          },
        },

        match: {
          include: {
            venue: true,
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json(
        {
          error: "Chat room not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(room);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 },
    );
  }
}
