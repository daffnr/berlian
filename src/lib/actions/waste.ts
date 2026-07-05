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

// === WASTE TYPES & PRICES ===

export async function getWasteTypes() {
  return runWithFallback<any>(
    async () => {
      const types = await db.wasteType.findMany({
        include: {
          prices: {
            orderBy: { effectiveDate: "desc" },
            take: 1,
          },
        },
      });
      // Flatten pricePerKg for simpler UI rendering
      return types.map((t: any) => ({
        id: t.id,
        name: t.name,
        code: t.code,
        description: t.description || "",
        image: t.image || "",
        pricePerKg: t.prices[0]?.pricePerKg ?? 0,
      }));
    },
    () => dummyActions.getWasteTypes()
  );
}

export async function createWasteType(data: {
  name: string;
  code: string;
  description: string;
  pricePerKg: number;
}) {
  const { name, code, description, pricePerKg } = data;

  const res = await runWithFallback<any>(
    async () => {
      const type = await db.wasteType.create({
        data: {
          name,
          code,
          description,
          image: "https://images.unsplash.com/photo-1595278069441-2cf29f8a3f85?q=80&w=300&auto=format&fit=crop",
        },
      });

      await db.wastePrice.create({
        data: {
          wasteTypeId: type.id,
          pricePerKg,
          unit: "kg",
        },
      });

      return { ...type, pricePerKg };
    },
    () => {
      return dummyActions.createWasteType(name, code, description, pricePerKg);
    }
  );

  revalidatePath("/dashboard/admin/waste-types");
  return { success: true, wasteType: res };
}

export async function updateWastePrice(id: string, pricePerKg: number, adminName = "Admin") {
  const res = await runWithFallback<any>(
    async () => {
      // Buat entri harga baru di riwayat harga
      const newPrice = await db.wastePrice.create({
        data: {
          wasteTypeId: id,
          pricePerKg,
          unit: "kg",
        },
      });

      const type = await db.wasteType.findUnique({ where: { id } });
      await db.activityLog.create({
        data: {
          action: "UPDATE_WASTE_PRICE",
          details: `Admin memperbarui harga sampah ${type?.name || "Jenis Sampah"} menjadi Rp${pricePerKg.toLocaleString("id-ID")}/kg`,
        },
      });

      return newPrice;
    },
    () => {
      dummyActions.createLog(
        adminName,
        "ADMIN",
        "UPDATE_WASTE_PRICE",
        `Admin memperbarui harga sampah untuk ID ${id} menjadi Rp${pricePerKg.toLocaleString("id-ID")}/kg`
      );
      return dummyActions.updateWasteTypePrice(id, pricePerKg);
    }
  );

  revalidatePath("/dashboard/admin/waste-types");
  return { success: true, price: res };
}

// === LOCATIONS ===

export async function getLocations() {
  return runWithFallback<any>(
    async () => {
      return await db.wasteLocation.findMany({
        orderBy: { name: "asc" },
      });
    },
    () => dummyActions.getLocations()
  );
}

export async function createLocation(data: {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
}) {
  const res = await runWithFallback<any>(
    async () => {
      return await db.wasteLocation.create({ data });
    },
    () => {
      return dummyActions.createLocation(
        data.name,
        data.address,
        data.latitude,
        data.longitude,
        data.phone,
        data.email
      );
    }
  );

  revalidatePath("/dashboard/admin/locations");
  revalidatePath("/");
  return { success: true, location: res };
}

export async function updateLocation(id: string, data: any) {
  const res = await runWithFallback<any>(
    async () => {
      return await db.wasteLocation.update({
        where: { id },
        data,
      });
    },
    () => {
      return dummyActions.updateLocation(id, data);
    }
  );

  revalidatePath("/dashboard/admin/locations");
  revalidatePath("/");
  return { success: true, location: res };
}

export async function deleteLocation(id: string) {
  const res = await runWithFallback<any>(
    async () => {
      return await db.wasteLocation.delete({ where: { id } });
    },
    () => {
      return dummyActions.deleteLocation(id);
    }
  );

  revalidatePath("/dashboard/admin/locations");
  revalidatePath("/");
  return { success: true, deleted: res };
}

// === TRANSACTIONS ===

export async function getTransactions() {
  return runWithFallback<any>(
    async () => {
      return await db.transaction.findMany({
        include: {
          user: true,
          staff: true,
          pickupRequest: {
            include: {
              wasteType: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    },
    () => {
      // format dummy transaction data structure to match prisma query includes
      return dummyActions.getTransactions().map((t) => ({
        id: t.id,
        pickupRequestId: t.pickupRequestId,
        userId: t.userId,
        staffId: t.staffId,
        weight: t.weight,
        pricePerKg: t.pricePerKg,
        totalPrice: t.totalPrice,
        pointsEarned: t.pointsEarned,
        createdAt: t.createdAt,
        user: { name: t.userName },
        staff: { name: t.staffName },
        pickupRequest: {
          wasteType: { name: t.wasteTypeName },
        },
      }));
    }
  );
}

export async function getTransactionsByUserId(userId: string) {
  return runWithFallback<any>(
    async () => {
      return await db.transaction.findMany({
        where: { userId },
        include: {
          staff: true,
          pickupRequest: {
            include: {
              wasteType: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    },
    () => {
      return dummyActions
        .getTransactions()
        .filter((t) => t.userId === userId)
        .map((t) => ({
          id: t.id,
          pickupRequestId: t.pickupRequestId,
          userId: t.userId,
          staffId: t.staffId,
          weight: t.weight,
          pricePerKg: t.pricePerKg,
          totalPrice: t.totalPrice,
          pointsEarned: t.pointsEarned,
          createdAt: t.createdAt,
          staff: { name: t.staffName },
          pickupRequest: {
            wasteType: { name: t.wasteTypeName },
          },
        }));
    }
  );
}

// === ACTIVITY LOGS ===

export async function getActivityLogs() {
  return runWithFallback<any>(
    async () => {
      return await db.activityLog.findMany({
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
    },
    () => {
      return dummyActions.getLogs().map((l) => ({
        id: l.id,
        action: l.action,
        details: l.details,
        ipAddress: l.ipAddress,
        createdAt: l.createdAt,
        user: { name: l.userName, role: l.role },
      }));
    }
  );
}
