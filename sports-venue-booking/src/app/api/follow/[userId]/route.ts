import { prisma } from "@/lib/prisma";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getAuthUser } from "@/lib/auth";

import { sendNotification } from "@/lib/sendNotification";

export async function POST(
  req: NextRequest,

  context: {
    params: Promise<{
      userId: string;
    }>;
  }
) {
  try {
    const { userId } =
      await context.params;

    const auth =
      await getAuthUser(req);

    const authUser =
      await prisma.user.findUnique({
        where: {
          id: auth.id,
        },
      });

    if (!authUser) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    if (authUser.id === userId) {
      return NextResponse.json(
        {
          error:
            "Cannot follow yourself",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await prisma.follow.findFirst({
        where: {
          followerId: authUser.id,

          followingId: userId,
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          error: "Already following",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.follow.create({
      data: {
        followerId: authUser.id,

        followingId: userId,
      },
    });

    await sendNotification({
      senderId: authUser.id,

      receiverId: userId,

      type: "FOLLOW",

      title: "New Follower",

      message: `${authUser.name} started following you`,
    });

    return NextResponse.json({
      message: "Followed successfully",
    });
  } catch (error: any) {
    console.error(
      "FOLLOW ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to follow user",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: NextRequest,

  context: {
    params: Promise<{
      userId: string;
    }>;
  }
) {
  try {
    const { userId } =
      await context.params;

    const auth =
      await getAuthUser(req);

    await prisma.follow.deleteMany({
      where: {
        followerId: auth.id,

        followingId: userId,
      },
    });

    return NextResponse.json({
      message:
        "Unfollowed successfully",
    });
  } catch (error: any) {
    console.error(
      "UNFOLLOW ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to unfollow user",
      },
      {
        status: 500,
      }
    );
  }
}