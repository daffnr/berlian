"use server";

import { db } from "@/lib/db";
import { dummyActions } from "@/lib/dummy-data";
import { revalidatePath } from "next/cache";

async function runWithFallback<T>(dbQuery: () => Promise<T>, fallbackQuery: () => T): Promise<T> {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost:5432/mydb")) {
    return fallbackQuery();
  }
  try {
    return await dbQuery();
  } catch (error) {
    console.warn("Database operation failed. Using dummy fallback.", error);
    return fallbackQuery();
  }
}

export async function getPickups() {
  return runWithFallback<any>(
    async () => {
      return await db.pickupRequest.findMany({
        include: {
          user: true,
          wasteType: true,
          staff: true,
        },
        orderBy: { createdAt: "desc" },
      });
    },
    () => dummyActions.getPickups()
  );
}

export async function getPickupsByUserId(userId: string) {
  return runWithFallback<any>(
    async () => {
      return await db.pickupRequest.findMany({
        where: { userId },
        include: {
          wasteType: true,
          staff: true,
        },
        orderBy: { createdAt: "desc" },
      });
    },
    () => dummyActions.getPickups().filter((p) => p.userId === userId)
  );
}

export async function getPickupsByStaffId(staffId: string) {
  return runWithFallback<any>(
    async () => {
      return await db.pickupRequest.findMany({
        where: { staffId },
        include: {
          user: true,
          wasteType: true,
        },
        orderBy: { createdAt: "desc" },
      });
    },
    () => dummyActions.getPickups().filter((p) => p.staffId === staffId)
  );
}

export async function getPickupById(id: string) {
  return runWithFallback<any>(
    async () => {
      return await db.pickupRequest.findUnique({
        where: { id },
        include: {
          user: true,
          wasteType: true,
          staff: true,
        },
      });
    },
    () => dummyActions.getPickupById(id)
  );
}

export async function createPickupRequest(data: {
  userId: string;
  wasteTypeId: string;
  estimatedWeight: number;
  description?: string;
  address: string;
  imageUrl?: string;
}) {
  const { userId, wasteTypeId, estimatedWeight, description, address, imageUrl } = data;

  const res = await runWithFallback<any>(
    async () => {
      const newPickup = await db.pickupRequest.create({
        data: {
          userId,
          wasteTypeId,
          estimatedWeight,
          description,
          address,
          imageUrl,
          status: "PENDING",
        },
      });
      return newPickup;
    },
    () => {
      return dummyActions.createPickup(
        userId,
        wasteTypeId,
        estimatedWeight,
        description || "",
        address,
        imageUrl
      );
    }
  );

  revalidatePath("/dashboard/user");
  revalidatePath("/dashboard/admin/pickups");
  return { success: true, pickup: res };
}

export async function verifyPickupRequest(id: string) {
  const res = await runWithFallback<any>(
    async () => {
      return await db.pickupRequest.update({
        where: { id },
        data: {
          status: "VERIFIED",
          verifiedAt: new Date(),
        },
      });
    },
    () => dummyActions.verifyPickup(id)
  );

  revalidatePath("/dashboard/admin/pickups");
  return { success: true, pickup: res };
}

export async function assignPickupRequest(id: string, staffId: string) {
  const res = await runWithFallback<any>(
    async () => {
      return await db.pickupRequest.update({
        where: { id },
        data: {
          status: "ASSIGNED",
          staffId,
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Besok
        },
      });
    },
    () => dummyActions.assignPickup(id, staffId)
  );

  revalidatePath("/dashboard/admin/pickups");
  revalidatePath("/dashboard/staff");
  return { success: true, pickup: res };
}

export async function completePickupRequest(id: string, weight: number, staffId: string) {
  const res = await runWithFallback<any>(
    async () => {
      // Ambil detail request dan harga sampah terkini
      const pickup = await db.pickupRequest.findUnique({
        where: { id },
        include: {
          wasteType: {
            include: {
              prices: {
                orderBy: { effectiveDate: "desc" },
                take: 1,
              },
            },
          },
        },
      });

      if (!pickup) throw new Error("Request penjemputan tidak ditemukan.");
      if (pickup.status === "COMPLETED") throw new Error("Request penjemputan sudah diselesaikan sebelumnya.");

      const pricePerKg = pickup.wasteType.prices[0]?.pricePerKg ?? 2000; // fallback default
      const totalPrice = weight * pricePerKg;
      const pointsEarned = Math.round(totalPrice / 100);

      // Jalankan transaksi database
      const result = await db.$transaction(async (tx: any) => {
        // 1. Update status pickup
        const updatedPickup = await tx.pickupRequest.update({
          where: { id },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
          },
        });

        // 2. Update saldo dan poin user
        await tx.user.update({
          where: { id: pickup.userId },
          data: {
            balance: { increment: totalPrice },
            points: { increment: pointsEarned },
          },
        });

        // 3. Catat transaksi baru
        const transaction = await tx.transaction.create({
          data: {
            pickupRequestId: id,
            userId: pickup.userId,
            staffId,
            weight,
            pricePerKg,
            totalPrice,
            pointsEarned,
          },
        });

        // 4. Catat Log Aktivitas
        const staffUser = await tx.user.findUnique({ where: { id: staffId } });
        const targetUser = await tx.user.findUnique({ where: { id: pickup.userId } });
        await tx.activityLog.create({
          data: {
            userId: staffId,
            action: "COMPLETE_PICKUP",
            details: `Staff ${staffUser?.name || "Staff"} menimbang ${weight}kg ${pickup.wasteType.name} untuk nasabah ${targetUser?.name || "User"}. Saldo bertambah Rp${totalPrice.toLocaleString("id-ID")}`,
          },
        });

        return { pickup: updatedPickup, transaction };
      });

      return result;
    },
    () => {
      const result = dummyActions.completePickup(id, weight, staffId);
      if (!result) throw new Error("Terjadi kesalahan pada fallback data.");
      return result;
    }
  );

  revalidatePath("/dashboard/staff");
  revalidatePath("/dashboard/user");
  revalidatePath("/dashboard/admin");
  return { success: true, data: res };
}
