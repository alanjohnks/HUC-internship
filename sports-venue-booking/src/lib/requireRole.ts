import { prisma } from "@/lib/prisma";

export async function requireRole(userId: string, role: string) {
  if (!userId) {
    throw new Error("User ID required");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== role) {
    throw new Error("Unauthorized");
  }

  return user;
}
