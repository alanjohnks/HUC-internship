import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/requireRole";
import { getUserFromRequest } from "@/lib/getUser";

export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req);

    const body = await req.json();
    const { name, sport, price, location, images } = body;

    // 🔐 Role check
    await requireRole(user.id, "OWNER");

    // ✅ Basic validation
    if (!name || !sport || !price) {
      return NextResponse.json(
        { error: "Name, sport and price are required" },
        { status: 400 },
      );
    }

    const venue = await prisma.venue.create({
      data: {
        name,
        sport,
        price: Number(price), // ensure number
        location: location || null,
        images: images && images.length > 0 ? images : [], // avoid crash
        ownerId: user.id,
        approved: false,
        slots: {
          create: [
            { time: "6:00 AM" },
            { time: "7:00 AM" },
            { time: "8:00 AM" },
            { time: "9:00 AM" },
            { time: "10:00 AM" },
            { time: "11:00 AM" },
            { time: "12:00 PM" },
            { time: "1:00 PM" },
            { time: "2:00 PM" },
            { time: "3:00 PM" },
            { time: "4:00 PM" },
            { time: "5:00 PM" },
            { time: "6:00 PM" },
            { time: "7:00 PM" },
            { time: "8:00 PM" },
          ],
        },
      },
    });

    return NextResponse.json(venue);
  } catch (error: any) {
    console.error("CREATE VENUE ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Failed to create venue" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const venues = await prisma.venue.findMany({
      where: {
        approved: true,
      },
      include: {
        owner: true,
        slots: true,
      },
    });
    console.log("VENUES:", venues);
    return NextResponse.json(venues);
  } catch (error: any) {
    console.error("VENUES ERROR FULL:", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
