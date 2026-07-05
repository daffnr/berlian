// Simulasi database in-memory untuk demo portfolio jika PostgreSQL belum terhubung
import * as bcrypt from "bcryptjs";

export interface DummyUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  avatarUrl: string;
  role: "USER" | "STAFF" | "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE";
  balance: number;
  points: number;
  createdAt: Date;
}

export interface DummyWasteType {
  id: string;
  name: string;
  code: string;
  description: string;
  image: string;
  pricePerKg: number;
}

export interface DummyPickupRequest {
  id: string;
  userId: string;
  userName: string;
  wasteTypeId: string;
  wasteTypeName: string;
  estimatedWeight: number;
  description: string;
  status: "PENDING" | "VERIFIED" | "ASSIGNED" | "PICKED_UP" | "COMPLETED" | "CANCELLED";
  address: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  staffId?: string;
  staffName?: string;
  createdAt: Date;
  scheduledAt?: Date;
  completedAt?: Date;
}

export interface DummyTransaction {
  id: string;
  pickupRequestId?: string;
  userId: string;
  userName: string;
  staffId: string;
  staffName: string;
  wasteTypeName: string;
  weight: number;
  pricePerKg: number;
  totalPrice: number;
  pointsEarned: number;
  createdAt: Date;
}

export interface DummyWasteLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
}

export interface DummyActivityLog {
  id: string;
  userName: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
  createdAt: Date;
}

// Global state in-memory
const globalState = globalThis as unknown as {
  users: DummyUser[];
  wasteTypes: DummyWasteType[];
  pickups: DummyPickupRequest[];
  transactions: DummyTransaction[];
  locations: DummyWasteLocation[];
  logs: DummyActivityLog[];
};

if (!globalState.users) {
  const hashedPassword = bcrypt.hashSync("password123", 10);
  globalState.users = [
    {
      id: "u-1",
      name: "Nasabah Setia Andi",
      email: "user@berlian.com",
      password: hashedPassword,
      phone: "081234567893",
      address: "Jl. Pemuda No. 12, Pancoran Mas, Depok",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      role: "USER",
      status: "ACTIVE",
      balance: 25000,
      points: 250,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: "s-1",
      name: "Staff Penjemput Budi",
      email: "staff@berlian.com",
      password: hashedPassword,
      phone: "081234567892",
      address: "Mess Staff BERLIAN Depok",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      role: "STAFF",
      status: "ACTIVE",
      balance: 0,
      points: 0,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
    {
      id: "a-1",
      name: "Admin BERLIAN",
      email: "admin@berlian.com",
      password: hashedPassword,
      phone: "081234567891",
      address: "Kantor Cabang Depok",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      role: "ADMIN",
      status: "ACTIVE",
      balance: 0,
      points: 0,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
    {
      id: "sa-1",
      name: "Super Admin BERLIAN",
      email: "superadmin@berlian.com",
      password: hashedPassword,
      phone: "081234567890",
      address: "Kantor Pusat Bank Sampah BERLIAN, Jakarta",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      balance: 0,
      points: 0,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    },
  ];

  globalState.wasteTypes = [
    {
      id: "w-1",
      name: "Botol Plastik",
      code: "BOTOL_PLASTIK",
      description: "Botol plastik bekas air mineral, minuman bersoda (PET/PETE)",
      image: "https://images.unsplash.com/photo-1595278069441-2cf29f8a3f85?q=80&w=300&auto=format&fit=crop",
      pricePerKg: 3000,
    },
    {
      id: "w-2",
      name: "Gelas Plastik",
      code: "GELAS_PLASTIK",
      description: "Gelas plastik transparan bekas minuman, cup kopi (PP/PS)",
      image: "https://images.unsplash.com/photo-1591871937573-74dbba515c4c?q=80&w=300&auto=format&fit=crop",
      pricePerKg: 2000,
    },
  ];

  globalState.locations = [
    {
      id: "l-1",
      name: "Bank Sampah BERLIAN Pusat",
      address: "Jl. Merdeka No. 10, Gambir, Jakarta Pusat",
      latitude: -6.175392,
      longitude: 106.827153,
      phone: "021-5551234",
      email: "pusat@berlian.com",
    },
    {
      id: "l-2",
      name: "Bank Sampah BERLIAN Depok",
      address: "Jl. Margonda Raya No. 45, Beji, Kota Depok",
      latitude: -6.373024,
      longitude: 106.832962,
      phone: "021-7775678",
      email: "depok@berlian.com",
    },
  ];

  globalState.pickups = [
    {
      id: "p-1",
      userId: "u-1",
      userName: "Nasabah Setia Andi",
      wasteTypeId: "w-1",
      wasteTypeName: "Botol Plastik",
      estimatedWeight: 5.0,
      description: "Tolong jemput sore hari ya, ada 2 kantong plastik besar.",
      status: "COMPLETED",
      address: "Jl. Pemuda No. 12, Pancoran Mas, Depok",
      latitude: -6.375678,
      longitude: 106.831234,
      staffId: "s-1",
      staffName: "Staff Penjemput Budi",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "p-2",
      userId: "u-1",
      userName: "Nasabah Setia Andi",
      wasteTypeId: "w-2",
      wasteTypeName: "Gelas Plastik",
      estimatedWeight: 3.5,
      description: "Sudah saya pilah dan ikat rapi.",
      status: "ASSIGNED",
      address: "Jl. Pemuda No. 12, Pancoran Mas, Depok",
      latitude: -6.375678,
      longitude: 106.831234,
      staffId: "s-1",
      staffName: "Staff Penjemput Budi",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      scheduledAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    },
    {
      id: "p-3",
      userId: "u-1",
      userName: "Nasabah Setia Andi",
      wasteTypeId: "w-1",
      wasteTypeName: "Botol Plastik",
      estimatedWeight: 10.0,
      description: "Jemput di lobi depan rumah.",
      status: "PENDING",
      address: "Jl. Pemuda No. 12, Pancoran Mas, Depok",
      latitude: -6.375678,
      longitude: 106.831234,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ];

  globalState.transactions = [
    {
      id: "t-1",
      pickupRequestId: "p-1",
      userId: "u-1",
      userName: "Nasabah Setia Andi",
      staffId: "s-1",
      staffName: "Staff Penjemput Budi",
      wasteTypeName: "Botol Plastik",
      weight: 6.2,
      pricePerKg: 3000,
      totalPrice: 18600,
      pointsEarned: 186,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  globalState.logs = [
    {
      id: "log-1",
      userName: "Super Admin BERLIAN",
      role: "SUPER_ADMIN",
      action: "LOGIN",
      details: "Super Admin masuk ke sistem.",
      ipAddress: "127.0.0.1",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      id: "log-2",
      userName: "Admin BERLIAN",
      role: "ADMIN",
      action: "UPDATE_WASTE_PRICE",
      details: "Admin memperbarui harga Botol Plastik menjadi Rp3.000/kg.",
      ipAddress: "127.0.0.1",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ];
}

export const dummyUsers = globalState.users;
export const dummyWasteTypes = globalState.wasteTypes;
export const dummyLocations = globalState.locations;
export const dummyPickups = globalState.pickups;
export const dummyTransactions = globalState.transactions;
export const dummyLogs = globalState.logs;

// Helper Actions untuk memodifikasi in-memory database secara realtime
export const dummyActions = {
  // Users
  getUsers: () => dummyUsers,
  getUserByEmail: (email: string) => dummyUsers.find((u) => u.email === email),
  getUserById: (id: string) => dummyUsers.find((u) => u.id === id),
  updateUser: (id: string, data: Partial<DummyUser>) => {
    const idx = dummyUsers.findIndex((u) => u.id === id);
    if (idx !== -1) {
      dummyUsers[idx] = { ...dummyUsers[idx], ...data } as DummyUser;
      return dummyUsers[idx];
    }
    return null;
  },
  createUser: (data: Omit<DummyUser, "id" | "createdAt" | "balance" | "points" | "status">) => {
    const newUser: DummyUser = {
      ...data,
      id: `u-${dummyUsers.length + 1}`,
      balance: 0,
      points: 0,
      status: "ACTIVE",
      createdAt: new Date(),
    };
    dummyUsers.push(newUser);
    return newUser;
  },

  // Pickups
  getPickups: () => dummyPickups,
  getPickupById: (id: string) => dummyPickups.find((p) => p.id === id),
  createPickup: (userId: string, wasteTypeId: string, estimatedWeight: number, description: string, address: string, imageUrl?: string) => {
    const user = dummyUsers.find((u) => u.id === userId);
    const waste = dummyWasteTypes.find((w) => w.id === wasteTypeId);
    if (!user || !waste) return null;

    const newPickup: DummyPickupRequest = {
      id: `p-${dummyPickups.length + 1}`,
      userId,
      userName: user.name,
      wasteTypeId,
      wasteTypeName: waste.name,
      estimatedWeight,
      description,
      status: "PENDING",
      address,
      imageUrl,
      latitude: -6.375678 + (Math.random() - 0.5) * 0.02,
      longitude: 106.831234 + (Math.random() - 0.5) * 0.02,
      createdAt: new Date(),
    };
    dummyPickups.push(newPickup);
    return newPickup;
  },
  verifyPickup: (id: string) => {
    const idx = dummyPickups.findIndex((p) => p.id === id);
    if (idx !== -1) {
      dummyPickups[idx].status = "VERIFIED";
      return dummyPickups[idx];
    }
    return null;
  },
  assignPickup: (id: string, staffId: string) => {
    const idx = dummyPickups.findIndex((p) => p.id === id);
    const staff = dummyUsers.find((u) => u.id === staffId);
    if (idx !== -1 && staff) {
      dummyPickups[idx].status = "ASSIGNED";
      dummyPickups[idx].staffId = staffId;
      dummyPickups[idx].staffName = staff.name;
      dummyPickups[idx].scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // besok
      return dummyPickups[idx];
    }
    return null;
  },
  completePickup: (id: string, weight: number, staffId: string) => {
    const pIdx = dummyPickups.findIndex((p) => p.id === id);
    if (pIdx === -1) return null;

    const pickup = dummyPickups[pIdx];
    const waste = dummyWasteTypes.find((w) => w.id === pickup.wasteTypeId);
    const user = dummyUsers.find((u) => u.id === pickup.userId);
    const staff = dummyUsers.find((u) => u.id === staffId);

    if (!waste || !user || !staff) return null;

    // Hitung Saldo & Poin
    const pricePerKg = waste.pricePerKg;
    const totalPrice = weight * pricePerKg;
    const pointsEarned = Math.round(totalPrice / 100);

    // Update Status Pickup
    pickup.status = "COMPLETED";
    pickup.completedAt = new Date();

    // Update User Balance & Points
    user.balance += totalPrice;
    user.points += pointsEarned;

    // Buat Transaksi Baru
    const newTx: DummyTransaction = {
      id: `t-${dummyTransactions.length + 1}`,
      pickupRequestId: id,
      userId: user.id,
      userName: user.name,
      staffId: staff.id,
      staffName: staff.name,
      wasteTypeName: waste.name,
      weight,
      pricePerKg,
      totalPrice,
      pointsEarned,
      createdAt: new Date(),
    };
    dummyTransactions.push(newTx);

    // Tambah Log Aktivitas
    dummyActions.createLog(
      staff.name,
      "STAFF",
      "COMPLETE_PICKUP",
      `Staff menimbang ${weight}kg ${waste.name} untuk nasabah ${user.name}. Saldo bertambah Rp${totalPrice.toLocaleString("id-ID")}`
    );

    return { pickup, transaction: newTx };
  },

  // Waste Types
  getWasteTypes: () => dummyWasteTypes,
  updateWasteTypePrice: (id: string, newPrice: number) => {
    const waste = dummyWasteTypes.find((w) => w.id === id);
    if (waste) {
      waste.pricePerKg = newPrice;
      return waste;
    }
    return null;
  },
  createWasteType: (name: string, code: string, description: string, pricePerKg: number) => {
    const newWaste: DummyWasteType = {
      id: `w-${dummyWasteTypes.length + 1}`,
      name,
      code,
      description,
      image: "https://images.unsplash.com/photo-1595278069441-2cf29f8a3f85?q=80&w=300&auto=format&fit=crop",
      pricePerKg,
    };
    dummyWasteTypes.push(newWaste);
    return newWaste;
  },

  // Locations
  getLocations: () => dummyLocations,
  createLocation: (name: string, address: string, latitude: number, longitude: number, phone: string, email: string) => {
    const newLoc: DummyWasteLocation = {
      id: `l-${dummyLocations.length + 1}`,
      name,
      address,
      latitude,
      longitude,
      phone,
      email,
    };
    dummyLocations.push(newLoc);
    return newLoc;
  },
  updateLocation: (id: string, data: Partial<DummyWasteLocation>) => {
    const idx = dummyLocations.findIndex((l) => l.id === id);
    if (idx !== -1) {
      dummyLocations[idx] = { ...dummyLocations[idx], ...data } as DummyWasteLocation;
      return dummyLocations[idx];
    }
    return null;
  },
  deleteLocation: (id: string) => {
    const idx = dummyLocations.findIndex((l) => l.id === id);
    if (idx !== -1) {
      dummyLocations.splice(idx, 1);
      return true;
    }
    return false;
  },

  // Transactions
  getTransactions: () => dummyTransactions,

  // Logs
  getLogs: () => dummyLogs,
  createLog: (userName: string, role: string, action: string, details: string) => {
    const newLog: DummyActivityLog = {
      id: `log-${dummyLogs.length + 1}`,
      userName,
      role,
      action,
      details,
      ipAddress: "127.0.0.1",
      createdAt: new Date(),
    };
    dummyLogs.push(newLog);
    return newLog;
  },
};
