import { getUserFromRequest } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/requireRole";
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
// /api/venues/[id]/route.ts
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; 

  const user = getUserFromRequest(req);
  await requireRole(user.id, "OWNER");

  const body = await req.json();

  const updatedVenue = await prisma.venue.findUnique({
  where: { id },
  include: {
    slots: true,
  },
});

  return NextResponse.json(updatedVenue);
}
export async function DELETE(req: Request, { params }: any) {
  const user = getUserFromRequest(req);
  await requireRole(user.id, "OWNER");

  await prisma.venue.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}