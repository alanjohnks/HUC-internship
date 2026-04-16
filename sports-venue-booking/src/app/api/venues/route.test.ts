import { POST, GET } from "@/app/api/venues/route";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUser";
import { requireRole } from "@/lib/requireRole";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    venue: {
      create: jest.fn(),
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

describe("POST /api/venue", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create venue successfully", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "owner1" });
    (requireRole as jest.Mock).mockResolvedValue(true);

    (prisma.venue.create as jest.Mock).mockResolvedValue({
      id: "venue1",
      name: "Ground",
      sport: "Cricket",
      price: 100,
      ownerId: "owner1",
    });

    const req = {
      json: jest.fn().mockResolvedValue({
        name: "Ground",
        sport: "Cricket",
        price: 100,
      }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(requireRole).toHaveBeenCalledWith("owner1", "OWNER");
    expect(prisma.venue.create).toHaveBeenCalledWith({
      data: {
        name: "Ground",
        sport: "Cricket",
        price: 100,
        ownerId: "owner1",
      },
    });

    expect(data).toEqual({
      id: "venue1",
      name: "Ground",
      sport: "Cricket",
      price: 100,
      ownerId: "owner1",
    });
  });

  it("should return 403 if role fails", async () => {
    (getUserFromRequest as jest.Mock).mockReturnValue({ id: "owner1" });
    (requireRole as jest.Mock).mockRejectedValue(new Error("Forbidden"));

    const req = {
      json: jest.fn().mockResolvedValue({
        name: "Ground",
        sport: "Cricket",
        price: 100,
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

    (prisma.venue.create as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const req = {
      json: jest.fn().mockResolvedValue({
        name: "Ground",
        sport: "Cricket",
        price: 100,
      }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data).toEqual({ error: "DB error" });
  });
});

describe("GET /api/venue", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return approved venues", async () => {
    (prisma.venue.findMany as jest.Mock).mockResolvedValue([
      { id: "1", approved: true },
      { id: "2", approved: true },
    ]);

    const res = await GET();
    const data = await res.json();

    expect(prisma.venue.findMany).toHaveBeenCalledWith({
      where: { approved: true },
    });

    expect(data).toEqual([
      { id: "1", approved: true },
      { id: "2", approved: true },
    ]);
  });
});