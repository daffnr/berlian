import { PrismaClient, Role, UserStatus, PickupStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Memulai seeding data...");

  // 1. Bersihkan database lama (jika ada) untuk menghindari duplikasi
  await prisma.activityLog.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.pickupRequest.deleteMany({});
  await prisma.wastePrice.deleteMany({});
  await prisma.wasteType.deleteMany({});
  await prisma.wasteLocation.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Database dibersihkan.");

  // 2. Hash Password
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 3. Buat User berdasarkan Role
  const superAdmin = await prisma.user.create({
    data: {
      name: "Super Admin BERLIAN",
      email: "superadmin@berlian.com",
      password: hashedPassword,
      phone: "081234567890",
      address: "Kantor Pusat Bank Sampah BERLIAN, Jakarta",
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin BERLIAN",
      email: "admin@berlian.com",
      password: hashedPassword,
      phone: "081234567891",
      address: "Kantor Cabang Depok",
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const staff = await prisma.user.create({
    data: {
      name: "Staff Penjemput Budi",
      email: "staff@berlian.com",
      password: hashedPassword,
      phone: "081234567892",
      address: "Mess Staff BERLIAN Depok",
      role: Role.STAFF,
      status: UserStatus.ACTIVE,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Nasabah Setia Andi",
      email: "user@berlian.com",
      password: hashedPassword,
      phone: "081234567893",
      address: "Jl. Pemuda No. 12, Pancoran Mas, Depok",
      role: Role.USER,
      status: UserStatus.ACTIVE,
      balance: 113100,
      points: 1131,
    },
  });

  console.log("Pengguna dummy berhasil dibuat.");

  // 4. Buat Jenis Sampah (WasteTypes) dan Harganya
  const botolPlastik = await prisma.wasteType.create({
    data: {
      name: "Botol Plastik",
      code: "BOTOL_PLASTIK",
      description: "Botol plastik bekas air mineral, minuman bersoda (PET/PETE)",
      image: "https://images.unsplash.com/photo-1595278069441-2cf29f8a3f85?q=80&w=300&auto=format&fit=crop",
    },
  });

  await prisma.wastePrice.create({
    data: {
      wasteTypeId: botolPlastik.id,
      pricePerKg: 3000,
      unit: "kg",
    },
  });

  const gelasPlastik = await prisma.wasteType.create({
    data: {
      name: "Gelas Plastik",
      code: "GELAS_PLASTIK",
      description: "Gelas plastik transparan bekas minuman, cup kopi (PP/PS)",
      image: "https://images.unsplash.com/photo-1591871937573-74dbba515c4c?q=80&w=300&auto=format&fit=crop",
    },
  });

  await prisma.wastePrice.create({
    data: {
      wasteTypeId: gelasPlastik.id,
      pricePerKg: 2000,
      unit: "kg",
    },
  });

  console.log("Jenis sampah dan harga berhasil dibuat.");

  // 5. Buat Lokasi Bank Sampah (WasteLocations)
  await prisma.wasteLocation.createMany({
    data: [
      {
        name: "Bank Sampah BERLIAN Pusat",
        address: "Jl. Merdeka No. 10, Gambir, Jakarta Pusat",
        latitude: -6.175392,
        longitude: 106.827153,
        phone: "021-5551234",
        email: "pusat@berlian.com",
      },
      {
        name: "Bank Sampah BERLIAN Depok",
        address: "Jl. Margonda Raya No. 45, Beji, Kota Depok",
        latitude: -6.373024,
        longitude: 106.832962,
        phone: "021-7775678",
        email: "depok@berlian.com",
      },
    ],
  });

  console.log("Lokasi bank sampah berhasil dibuat.");

  // 6. Buat Pickup Request & Transaksi Dummy untuk Riwayat
  const req1 = await prisma.pickupRequest.create({
    data: {
      userId: user.id,
      wasteTypeId: botolPlastik.id,
      estimatedWeight: 5.0,
      description: "Tolong jemput sore hari ya, ada 2 kantong plastik besar.",
      status: PickupStatus.COMPLETED,
      address: user.address || "",
      latitude: -6.375678,
      longitude: 106.831234,
      staffId: staff.id,
      verifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      scheduledAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.transaction.create({
    data: {
      pickupRequestId: req1.id,
      userId: user.id,
      staffId: staff.id,
      weight: 6.2,
      pricePerKg: 3000,
      totalPrice: 18600,
      pointsEarned: 186,
      createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
    },
  });

  const req2 = await prisma.pickupRequest.create({
    data: {
      userId: user.id,
      wasteTypeId: gelasPlastik.id,
      estimatedWeight: 3.5,
      description: "Sudah saya pilah dan ikat rapi.",
      status: PickupStatus.COMPLETED,
      address: user.address || "",
      latitude: -6.375678,
      longitude: 106.831234,
      staffId: staff.id,
      verifiedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      scheduledAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.transaction.create({
    data: {
      pickupRequestId: req2.id,
      userId: user.id,
      staffId: staff.id,
      weight: 4.0,
      pricePerKg: 2000,
      totalPrice: 8000,
      pointsEarned: 80,
      createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
    },
  });

  const req3 = await prisma.pickupRequest.create({
    data: {
      userId: user.id,
      wasteTypeId: botolPlastik.id,
      estimatedWeight: 10.0,
      description: "Jemput di lobi depan rumah.",
      status: PickupStatus.COMPLETED,
      address: user.address || "",
      latitude: -6.375678,
      longitude: 106.831234,
      staffId: staff.id,
      verifiedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      scheduledAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.transaction.create({
    data: {
      pickupRequestId: req3.id,
      userId: user.id,
      staffId: staff.id,
      weight: 11.5,
      pricePerKg: 3000,
      totalPrice: 34500,
      pointsEarned: 345,
      createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
    },
  });

  const req4 = await prisma.pickupRequest.create({
    data: {
      userId: user.id,
      wasteTypeId: gelasPlastik.id,
      estimatedWeight: 6.0,
      description: "Jemput depan gerbang.",
      status: PickupStatus.COMPLETED,
      address: user.address || "",
      latitude: -6.375678,
      longitude: 106.831234,
      staffId: staff.id,
      verifiedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      scheduledAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.transaction.create({
    data: {
      pickupRequestId: req4.id,
      userId: user.id,
      staffId: staff.id,
      weight: 6.5,
      pricePerKg: 2000,
      totalPrice: 13000,
      pointsEarned: 130,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  });

  const req5 = await prisma.pickupRequest.create({
    data: {
      userId: user.id,
      wasteTypeId: botolPlastik.id,
      estimatedWeight: 12.0,
      description: "Botol-botol minuman bekas pesta.",
      status: PickupStatus.COMPLETED,
      address: user.address || "",
      latitude: -6.375678,
      longitude: 106.831234,
      staffId: staff.id,
      verifiedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      scheduledAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.transaction.create({
    data: {
      pickupRequestId: req5.id,
      userId: user.id,
      staffId: staff.id,
      weight: 13.0,
      pricePerKg: 3000,
      totalPrice: 39000,
      pointsEarned: 390,
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    },
  });

  // Buat request yang sedang berjalan (ASSIGNED)
  await prisma.pickupRequest.create({
    data: {
      userId: user.id,
      wasteTypeId: gelasPlastik.id,
      estimatedWeight: 4.5,
      description: "Jemput besok pagi jam 9.",
      status: PickupStatus.ASSIGNED,
      address: user.address || "",
      latitude: -6.375678,
      longitude: 106.831234,
      staffId: staff.id,
      verifiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      scheduledAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    },
  });

  // Buat request baru yang menunggu verifikasi (PENDING)
  await prisma.pickupRequest.create({
    data: {
      userId: user.id,
      wasteTypeId: botolPlastik.id,
      estimatedWeight: 8.0,
      description: "Jemput di garasi samping.",
      status: PickupStatus.PENDING,
      address: user.address || "",
      latitude: -6.375678,
      longitude: 106.831234,
    },
  });

  console.log("Data pickup request dummy berhasil dibuat.");

  // 7. Buat Activity Log Dummy
  await prisma.activityLog.createMany({
    data: [
      {
        userId: superAdmin.id,
        action: "LOGIN",
        details: "Super Admin masuk ke sistem.",
        ipAddress: "127.0.0.1",
      },
      {
        userId: admin.id,
        action: "UPDATE_WASTE_PRICE",
        details: "Admin memperbarui harga Botol Plastik menjadi Rp3.000/kg.",
        ipAddress: "127.0.0.1",
      },
    ],
  });

  console.log("Log aktivitas berhasil dibuat.");
  console.log("Seeding data selesai dengan sukses!");
}

main()
  .catch((e) => {
    console.error("Gagal melakukan seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
