import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function syncUser(userId) {
    if (!userId) return null;

    let user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        const clerk = await clerkClient();
        const clerkUser = await clerk.users.getUser(userId);

        user = await prisma.user.create({
            data: {
                id: clerkUser.id,
                name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
                email: clerkUser.emailAddresses[0]?.emailAddress || "",
                image: clerkUser.imageUrl,
            }
        });
    }

    return user;
}