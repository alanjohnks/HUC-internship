import { POST } from "@/app/api/slots/route";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUser";
import { requireRole } from "@/lib/requireRole";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    slot: {
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

describe("POST /api/create-slot", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create slot successfully", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "owner1" });
    (requireRole as jest.Mock).mockResolvedValue(true);

    (prisma.slot.create as jest.Mock).mockResolvedValue({
      id: "slot1",
      venueId: "venue1",
      time: "10:00 AM",
    });

    const req = {
      json: jest.fn().mockResolvedValue({
        venueId: "venue1",
        time: "10:00 AM",
      }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(requireRole).toHaveBeenCalledWith("owner1", "OWNER");
    expect(prisma.slot.create).toHaveBeenCalledWith({
      data: {
        venueId: "venue1",
        time: "10:00 AM",
      },
    });
    expect(data).toEqual({
      id: "slot1",
      venueId: "venue1",
      time: "10:00 AM",
    });
  });

  it("should return 403 if role check fails", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "owner1" });
    (requireRole as jest.Mock).mockRejectedValue(new Error("Forbidden"));

    const req = {
      json: jest.fn().mockResolvedValue({
        venueId: "venue1",
        time: "10:00 AM",
      }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data).toEqual({ error: "Forbidden" });
  });

  it("should handle prisma error", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "owner1" });
    (requireRole as jest.Mock).mockResolvedValue(true);

    (prisma.slot.create as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const req = {
      json: jest.fn().mockResolvedValue({
        venueId: "venue1",
        time: "10:00 AM",
      }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data).toEqual({ error: "DB error" });
  });
});