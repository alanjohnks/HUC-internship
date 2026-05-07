import { prisma } from "./prisma";

interface NotificationInput {
  senderId?: string;
  receiverId: string;
  type:
    | "FOLLOW"
    | "MATCH_CREATED"
    | "MATCH_JOINED"
    | "MATCH_CANCELLED";
  title: string;
  message: string;
  matchId?: string;
}

export async function sendNotification(data: NotificationInput) {
  return prisma.notification.create({
    data: {
      senderId: data.senderId,
      receiverId: data.receiverId,
      type: data.type,
      title: data.title,
      message: data.message,
      matchId: data.matchId,
    },
  });
}