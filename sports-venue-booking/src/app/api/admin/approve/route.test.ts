/// <reference types="jest" />
import { POST } from "@/app/api/admin/approve/route";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/requireRole";
import { getUserFromRequest } from "@/lib/getUser";


jest.mock("@/lib/prisma", () => ({
  prisma: {
    venue: {
      update: jest.fn(),
    },
  },
}));

jest.mock("@/lib/requireRole", () => ({
  requireRole: jest.fn(),
}));

jest.mock("@/lib/getUser", () => ({
  getUserFromRequest: jest.fn(),
}));

describe("POST /api/approve", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should approve venue when user is admin", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "user1" });
    (requireRole as jest.Mock).mockResolvedValue(true);
    (prisma.venue.update as jest.Mock).mockResolvedValue({
      id: "venue1",
      approved: true,
    });

    const req = {
      json: jest.fn().mockResolvedValue({ venueId: "venue1" }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(requireRole).toHaveBeenCalledWith("user1", "ADMIN");
    expect(prisma.venue.update).toHaveBeenCalledWith({
      where: { id: "venue1" },
      data: { approved: true },
    });
    expect(data).toEqual({ id: "venue1", approved: true });
  });

  it("should return 403 if not admin", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "user1" });
    (requireRole as jest.Mock).mockRejectedValue(new Error("Forbidden"));

    const req = {
      json: jest.fn().mockResolvedValue({ venueId: "venue1" }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data).toEqual({ error: "Forbidden" });
  });

  it("should handle prisma error", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "user1" });
    (requireRole as jest.Mock).mockResolvedValue(true);
    (prisma.venue.update as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const req = {
      json: jest.fn().mockResolvedValue({ venueId: "venue1" }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data).toEqual({ error: "DB error" });
  });
});