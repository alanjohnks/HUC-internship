import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const venue = await prisma.venue.findUnique({
      where: { id: params.id },
      include: {
        slots: true,
      },
    });

    if (!venue) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(venue);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}