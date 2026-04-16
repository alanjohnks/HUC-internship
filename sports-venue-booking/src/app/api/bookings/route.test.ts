import { POST } from "@/app/api/bookings/route";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUser";
import { requireRole } from "@/lib/requireRole";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    slot: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    booking: {
      create: jest.fn(),
    },
  },
}));

jest.mock("@/lib/getUser", () => ({
  getUserFromRequest: jest.fn(),
}));

jest.mock("@/lib/requireRole", () => ({
  requireRole: jest.fn(),
}));

describe("POST /api/book", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should book slot successfully", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "user1" });
    (requireRole as jest.Mock).mockResolvedValue(true);

    (prisma.slot.findUnique as jest.Mock).mockResolvedValue({
      id: "slot1",
      isBooked: false,
    });

    (prisma.booking.create as jest.Mock).mockResolvedValue({
      id: "booking1",
      userId: "user1",
      slotId: "slot1",
    });

    (prisma.slot.update as jest.Mock).mockResolvedValue({
      id: "slot1",
      isBooked: true,
    });

    const req = {
      json: jest.fn().mockResolvedValue({ slotId: "slot1" }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(requireRole).toHaveBeenCalledWith("user1", "USER");
    expect(prisma.slot.findUnique).toHaveBeenCalledWith({
      where: { id: "slot1" },
    });
    expect(prisma.booking.create).toHaveBeenCalledWith({
      data: { userId: "user1", slotId: "slot1" },
    });
    expect(prisma.slot.update).toHaveBeenCalledWith({
      where: { id: "slot1" },
      data: { isBooked: true },
    });
    expect(data).toEqual({
      id: "booking1",
      userId: "user1",
      slotId: "slot1",
    });
  });

  it("should return 400 if slot not available", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "user1" });
    (requireRole as jest.Mock).mockResolvedValue(true);

    (prisma.slot.findUnique as jest.Mock).mockResolvedValue({
      id: "slot1",
      isBooked: true,
    });

    const req = {
      json: jest.fn().mockResolvedValue({ slotId: "slot1" }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ error: "Slot not available" });
  });

  it("should return 400 if slot does not exist", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "user1" });
    (requireRole as jest.Mock).mockResolvedValue(true);

    (prisma.slot.findUnique as jest.Mock).mockResolvedValue(null);

    const req = {
      json: jest.fn().mockResolvedValue({ slotId: "slot1" }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ error: "Slot not available" });
  });

  it("should return 403 if role check fails", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "user1" });
    (requireRole as jest.Mock).mockRejectedValue(new Error("Forbidden"));

    const req = {
      json: jest.fn().mockResolvedValue({ slotId: "slot1" }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data).toEqual({ error: "Forbidden" });
  });

  it("should handle prisma error", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "user1" });
    (requireRole as jest.Mock).mockResolvedValue(true);

    (prisma.slot.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const req = {
      json: jest.fn().mockResolvedValue({ slotId: "slot1" }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data).toEqual({ error: "DB error" });
  });
});