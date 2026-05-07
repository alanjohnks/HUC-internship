import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/getUser";

export async function POST(
  req: NextRequest,

  context: {
    params: Promise<{
      matchId: string;
    }>;
  }
) {
  try {
    const { matchId } =
      await context.params;

    const user =
      getUserFromRequest(req);

    const body = await req.json();

    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        {
          error: "Message required",
        },
        {
          status: 400,
        }
      );
    }

    const room =
      await prisma.chatRoom.findUnique({
        where: {
          matchId,
        },
      });

    if (!room) {
      return NextResponse.json(
        {
          error:
            "Chat room not found",
        },
        {
          status: 404,
        }
      );
    }

    const message =
      await prisma.message.create({
        data: {
          content,

          senderId: user.id,

          chatRoomId: room.id,
        },

        include: {
          sender: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
      });

    return NextResponse.json(message);
  } catch (error: any) {
    console.error(
      "SEND MESSAGE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to send message",
      },
      {
        status: 500,
      }
    );
  }
}