import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { sendNotification } from "@/lib/sendNotification";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);

    const body = await req.json();

    const {
      title,
      description,
      sport,
      visibility,
      maxPlayers,
      totalPrice,
      venueId,
      slotId,
    } = body;

    const splitPrice = Number((totalPrice / maxPlayers).toFixed(2));

    const match = await prisma.match.create({
      data: {
        title,
        description,
        sport,
        visibility,
        maxPlayers,
        totalPrice,
        splitPrice,

        creatorId: authUser.id,

        venueId,
        slotId,

        participants: {
          create: {
            userId: authUser.id,
            paymentStatus: "PAID",
            amountPaid: splitPrice,
            isOrganizer: true,
          },
        },

        ...(visibility === "PUBLIC" && {
          chatRoom: {
            create: {},
          },
        }),
      },

      include: {
        participants: true,

        chatRoom: true,
      },
    });

    if (visibility === "PUBLIC") {
      const followers = await prisma.follow.findMany({
        where: {
          followingId: authUser.id,
        },
      });

      await Promise.all(
        followers.map((follower) =>
          sendNotification({
            senderId: authUser.id,
            receiverId: follower.followerId,
            type: "MATCH_CREATED",
            title: "New Match Created",
            message: `${authUser.id} created a public match`,
            matchId: match.id,
          }),
        ),
      );
    }

    return NextResponse.json(match);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
