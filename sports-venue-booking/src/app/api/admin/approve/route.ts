import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

import { requireRole } from "@/lib/requireRole";

import { getUserFromRequest } from "@/lib/getUser";

export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req); // ✅ get from token

    const body = await req.json();
    const { venueId } = body;

    await requireRole(user.id, "ADMIN"); // ✅ FIXED

    const venue = await prisma.venue.update({
      where: { id: venueId },
      data: { approved: true },
    });

    return NextResponse.json(venue);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 403 }
    );
  }
}

