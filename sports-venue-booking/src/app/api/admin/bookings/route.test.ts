import { GET } from "@/app/api/admin/bookings/route";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUser";
import { requireRole } from "@/lib/requireRole";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    booking: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/getUser", () => ({
  getUserFromRequest: jest.fn(),
}));

jest.mock("@/lib/requireRole", () => ({
  requireRole: jest.fn(),
}));

describe("GET /api/bookings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return bookings for admin", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "admin1" });
    (requireRole as jest.Mock).mockResolvedValue(true);

    (prisma.booking.findMany as jest.Mock).mockResolvedValue([
      {
        id: "b1",
        user: { id: "u1" },
        slot: { id: "s1" },
      },
    ]);

    const req = {} as Request;

    const res = await GET(req);
    const data = await res.json();

    expect(requireRole).toHaveBeenCalledWith("admin1", "ADMIN");
    expect(prisma.booking.findMany).toHaveBeenCalledWith({
      include: {
        user: true,
        slot: true,
      },
    });
    expect(data).toEqual([
      {
        id: "b1",
        user: { id: "u1" },
        slot: { id: "s1" },
      },
    ]);
  });

  it("should return 403 if role check fails", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "user1" });
    (requireRole as jest.Mock).mockRejectedValue(new Error("Forbidden"));

    const req = {} as Request;

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data).toEqual({ error: "Forbidden" });
  });

  it("should handle prisma error", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "admin1" });
    (requireRole as jest.Mock).mockResolvedValue(true);

    (prisma.booking.findMany as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const req = {} as Request;

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data).toEqual({ error: "DB error" });
  });
});