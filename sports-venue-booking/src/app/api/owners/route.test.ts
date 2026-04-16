import { POST } from "@/app/api/owners/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

describe("POST /api/register-owner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register owner successfully", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "1",
      name: "test",
      email: "test@mail.com",
      role: "OWNER",
    });

    const req = {
      json: jest.fn().mockResolvedValue({
        name: "test",
        email: "test@mail.com",
        password: "1234",
      }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: "test",
        email: "test@mail.com",
        password: "hashedPassword",
        role: "OWNER",
      },
    });

    expect(data).toEqual({
      id: "1",
      name: "test",
      email: "test@mail.com",
      role: "OWNER",
    });
  });

  it("should return 400 if fields missing", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        name: "",
        email: "",
        password: "",
      }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ error: "Missing fields" });
  });

  it("should return 400 if user already exists", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      email: "test@mail.com",
    });

    const req = {
      json: jest.fn().mockResolvedValue({
        name: "test",
        email: "test@mail.com",
        password: "1234",
      }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ error: "User already exists" });
  });

  it("should handle server error", async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const req = {
      json: jest.fn().mockResolvedValue({
        name: "test",
        email: "test@mail.com",
        password: "1234",
      }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data).toEqual({ error: "DB error" });
  });
});