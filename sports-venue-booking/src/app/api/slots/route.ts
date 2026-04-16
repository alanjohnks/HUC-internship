import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";
import { requireRole } from "@/lib/requireRole";

export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req);

    const body = await req.json();
    const { venueId, time } = body;

    // 🔒 Only OWNER
    await requireRole(user.id, "OWNER");

    const slot = await prisma.slot.create({
      data: {
        venueId,
        time,
      },
    });

    return NextResponse.json(slot);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 403 }
    );
  }
}
