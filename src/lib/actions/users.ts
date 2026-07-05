"use server";

import { db } from "@/lib/db";
import { dummyActions } from "@/lib/dummy-data";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// Check if database is connected/configured
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

export async function getUsers() {
  return runWithFallback<any>(
    async () => {
      return await db.user.findMany({
        orderBy: { createdAt: "desc" },
      });
    },
    () => dummyActions.getUsers()
  );
}

export async function getUserById(id: string) {
  return runWithFallback<any>(
    async () => {
      return await db.user.findUnique({ where: { id } });
    },
    () => dummyActions.getUserById(id)
  );
}

export async function registerUser(formData: any) {
  const { name, email, password, phone, address } = formData;
  const hashedPassword = await bcrypt.hash(password, 10);

  return runWithFallback<any>(
    async () => {
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) throw new Error("Email sudah terdaftar.");

      const newUser = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          address,
          role: "USER",
          status: "ACTIVE",
        },
      });
      return { success: true, user: newUser };
    },
    () => {
      const existing = dummyActions.getUserByEmail(email);
      if (existing) throw new Error("Email sudah terdaftar.");

      const newUser = dummyActions.createUser({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        role: "USER",
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      });
      return { success: true, user: newUser };
    }
  );
}

export async function createInternalAccount(formData: any) {
  const { name, email, password, phone, address, role } = formData;
  const hashedPassword = await bcrypt.hash(password, 10);

  const res = await runWithFallback<any>(
    async () => {
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) throw new Error("Email sudah terdaftar.");

      const newUser = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          address,
          role,
          status: "ACTIVE",
        },
      });
      return newUser;
    },
    () => {
      const existing = dummyActions.getUserByEmail(email);
      if (existing) throw new Error("Email sudah terdaftar.");

      return dummyActions.createUser({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        role,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      });
    }
  );

  revalidatePath("/dashboard/super-admin");
  revalidatePath("/dashboard/admin/users");
  return { success: true, user: res };
}

export async function updateProfile(id: string, data: any) {
  const { name, phone, address, password, avatarUrl } = data;
  const updateData: any = { name, phone, address };
  if (avatarUrl) updateData.avatarUrl = avatarUrl;
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const res = await runWithFallback<any>(
    async () => {
      const updated = await db.user.update({
        where: { id },
        data: updateData,
      });
      return updated;
    },
    () => {
      return dummyActions.updateUser(id, updateData);
    }
  );

  revalidatePath(`/dashboard/user`);
  return { success: true, user: res };
}

export async function updateUserStatus(id: string, status: "ACTIVE" | "INACTIVE") {
  const res = await runWithFallback<any>(
    async () => {
      return await db.user.update({
        where: { id },
        data: { status },
      });
    },
    () => {
      return dummyActions.updateUser(id, { status });
    }
  );

  revalidatePath("/dashboard/super-admin");
  revalidatePath("/dashboard/admin/users");
  return { success: true, user: res };
}

export async function resetUserPassword(id: string, newPassword = "password123") {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const res = await runWithFallback<any>(
    async () => {
      return await db.user.update({
        where: { id },
        data: { password: hashedPassword },
      });
    },
    () => {
      return dummyActions.updateUser(id, { password: hashedPassword });
    }
  );

  return { success: true, user: res };
}
