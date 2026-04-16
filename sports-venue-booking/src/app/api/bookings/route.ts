import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";
import { requireRole } from "@/lib/requireRole";

export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req);
    const { slotId } = await req.json();


    // Only USER can book
    await requireRole(user.id, "USER");

    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (!slot || slot.isBooked) {
      return NextResponse.json(
        { error: "Slot not available" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        userId:user.id,
        slotId,
      },
    });

    await prisma.slot.update({
      where: { id: slotId },
      data: { isBooked: true },
    });

    return NextResponse.json(booking);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 403 }
    );
  }
}

