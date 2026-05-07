import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { matchId: string } }
) {
  try {
    const chatRoom = await prisma.chatRoom.findUnique({
      where: {
        matchId: params.matchId,
      },

      include: {
        messages: {
          include: {
            sender: true,
          },

          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json(chatRoom);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}