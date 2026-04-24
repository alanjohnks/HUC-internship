import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";
import { requireRole } from "@/lib/requireRole";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    const bookings = await prisma.booking.findMany({
      where: {
        userId: decoded.id,
      },
      include: {
        slot: {
          include: {
            venue: true,
          },
        },
        user: true,
      },
    });
    console.log(bookings);

    return NextResponse.json(bookings);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req);
    const { slotId } = await req.json();

    await requireRole(user.id, "USER");

    const result = await prisma.$transaction(async (tx) => {
      // 🔒 Lock + check inside transaction
      const slot = await tx.slot.findUnique({
        where: { id: slotId },
      });

      if (!slot || slot.isBooked) {
        throw new Error("Slot not available");
      }

      // ✅ Create booking
      const booking = await tx.booking.create({
        data: {
          userId: user.id,
          slotId,
        },
      });

      // ✅ Mark slot booked
      await tx.slot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });

      return booking;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
