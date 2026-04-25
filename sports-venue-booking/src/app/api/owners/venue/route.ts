import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";
import { requireRole } from "@/lib/requireRole";

export async function GET(req: Request) {
  try {
    const user = getUserFromRequest(req);

    await requireRole(user.id, "OWNER");

    const venues = await prisma.venue.findMany({
      where: {
        ownerId: user.id,
      },
      include: {
        slots: true, 
      },
      orderBy: {
        id: "desc", 
      },
    });

    return NextResponse.json(venues);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 403 }
    );
  }
}