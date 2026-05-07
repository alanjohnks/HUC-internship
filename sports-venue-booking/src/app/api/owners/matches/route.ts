import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/getUser";

export async function GET(req: Request) {
  try {
    const user = getUserFromRequest(req);

    const matches =
      await prisma.match.findMany({
        where: {
          OR: [
            {
              creatorId: user.id,
            },

            {
              participants: {
                some: {
                  userId: user.id,
                },
              },
            },
          ],
        },

        include: {
          creator: true,

          venue: true,

          slot: true,

          participants: {
            include: {
              user: true,
            },
          },

          chatRoom: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(matches);
  } catch (error: any) {
    console.error(
      "OWNER MATCHES ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}