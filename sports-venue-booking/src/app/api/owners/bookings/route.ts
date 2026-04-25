import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";
import { requireRole } from "@/lib/requireRole";

export async function GET(req: Request) {
  try {
    const user = getUserFromRequest(req);

    // 🔒 Only OWNER
    await requireRole(user.id, "OWNER");

    const bookings = await prisma.booking.findMany({
      where: {
        slot: {
          venue: {
            ownerId: user.id, // 🔥 KEY FILTER
          },
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        slot: {
          include: {
            venue: {
              select: {
                id: true,
                name: true,
                location: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc", // ideally use createdAt if you add it later
      },
    });

    return NextResponse.json(bookings);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 403 }
    );
  }
}