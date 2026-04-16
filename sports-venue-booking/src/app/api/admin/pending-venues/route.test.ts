import { GET } from "@/app/api/admin/pending-venues/route";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUser";
import { requireRole } from "@/lib/requireRole";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    venue: {
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

describe("GET /api/pending-venues", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return unapproved venues for admin", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "admin1" });
    (requireRole as jest.Mock).mockResolvedValue(true);

    (prisma.venue.findMany as jest.Mock).mockResolvedValue([
      { id: "v1", approved: false },
    ]);

    const req = {} as Request;

    const res = await GET(req);
    const data = await res.json();

    expect(requireRole).toHaveBeenCalledWith("admin1", "ADMIN");
    expect(prisma.venue.findMany).toHaveBeenCalledWith({
      where: { approved: false },
    });
    expect(data).toEqual([{ id: "v1", approved: false }]);
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

    (prisma.venue.findMany as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const req = {} as Request;

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data).toEqual({ error: "DB error" });
  });
});