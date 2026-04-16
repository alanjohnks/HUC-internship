import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";
import { requireRole } from "@/lib/requireRole";

export async function GET(req: Request) {
  try {
    const user = getUserFromRequest(req);
    await requireRole(user.id, "ADMIN");

    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        slot: true,
      },
    });

    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 403 }
    );
  }
}
