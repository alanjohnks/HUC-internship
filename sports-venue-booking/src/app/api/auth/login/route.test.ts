import { POST } from "@/app/api/auth/login/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  signToken: jest.fn(),
}));

describe("POST /api/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should login successfully", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      email: "test@mail.com",
      password: "hashed",
      role: "USER",
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (signToken as jest.Mock).mockReturnValue("token123");

    const req = {
      json: jest.fn().mockResolvedValue({
        email: "test@mail.com",
        password: "1234",
      }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(data).toEqual({
      token: "token123",
      user: {
        id: "1",
        role: "USER",
        email: "test@mail.com",
      },
    });
  });

  it("should return 400 if user not found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const req = {
      json: jest.fn().mockResolvedValue({
        email: "test@mail.com",
        password: "1234",
      }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ error: "User not found" });
  });

  it("should return 400 if password is invalid", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      email: "test@mail.com",
      password: "hashed",
      role: "USER",
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const req = {
      json: jest.fn().mockResolvedValue({
        email: "test@mail.com",
        password: "wrong",
      }),
    } as unknown as Request;

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({ error: "Invalid credentials" });
  });

  it("should handle server error", async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const req = {
      json: jest.fn().mockResolvedValue({
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