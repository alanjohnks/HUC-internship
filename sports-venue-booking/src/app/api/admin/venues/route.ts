import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";
import { requireRole } from "@/lib/requireRole";

export async function GET(req: Request) {
  try {
    const user = getUserFromRequest(req);

    await requireRole(user.id, "ADMIN");

    const venues = await prisma.venue.findMany({
      include: {
        owner: true,
      },
    });

    return NextResponse.json(venues);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 403 }
    );
  }
}
