import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/requireRole";
import { getUserFromRequest } from "@/lib/getUser";


export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req);

    const body = await req.json(); 
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
  try {
    const venues = await prisma.venue.findMany({
      include: {
        slots: true,
      },
    });

    return NextResponse.json(venues);

  } catch (error: any) {
  console.error("VENUES ERROR FULL:", error); 

  return NextResponse.json(
    { error: error.message }, 
    { status: 500 }
  );
}

}



