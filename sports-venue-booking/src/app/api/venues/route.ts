import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/requireRole";
import { getUserFromRequest } from "@/lib/getUser";


export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req);

    const body = await req.json(); // ✅ only once
    const { name, sport, price } = body;

    await requireRole(user.id, "OWNER");

    const venue = await prisma.venue.create({
      data: {
        name,
        sport,
        price,
        ownerId: user.id,
      },
    });

    return NextResponse.json(venue);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 403 }
    );
  }
}



export async function GET() {
  const venues = await prisma.venue.findMany({
    where: { approved: true },
  });

  return NextResponse.json(venues);
}
