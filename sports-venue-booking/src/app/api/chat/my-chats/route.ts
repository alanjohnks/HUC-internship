import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/getUser";

export async function GET(req: Request) {
  try {
    const user = getUserFromRequest(req);

    const chats =
      await prisma.chatRoom.findMany({
        where: {
          match: {
            participants: {
              some: {
                userId: user.id,
              },
            },
          },
        },

        include: {
          match: {
            include: {
              venue: true,

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

          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  profileImage: true,
                },
              },
            },

            orderBy: {
              createdAt: "asc",
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(chats);
  } catch (error: any) {
    console.error(
      "MY CHATS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to fetch chats",
      },
      {
        status: 500,
      }
    );
  }
}