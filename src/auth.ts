import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { dummyActions } from "@/lib/dummy-data";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const isLocalhost = !process.env.DATABASE_URL || 
                              process.env.DATABASE_URL.includes("localhost:5432/mydb") || 
                              process.env.DATABASE_URL.includes("johndoe:randompassword");
          
          let user: any = null;
          
          if (!isLocalhost) {
            try {
              user = await db.user.findUnique({
                where: { email },
              });
            } catch (dbError) {
              console.warn("Auth database lookup failed, using dummy fallback:", dbError);
            }
          }
          
          if (!user) {
            const dummyUser = dummyActions.getUserByEmail(email);
            if (dummyUser) {
              user = {
                id: dummyUser.id,
                name: dummyUser.name,
                email: dummyUser.email,
                password: dummyUser.password,
                role: dummyUser.role,
                status: dummyUser.status,
              };
            }
          }

          if (!user || !user.password) {
            return null;
          }

          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) {
            return null;
          }

          if (user.status === "INACTIVE") {
            throw new Error("Akun Anda dinonaktifkan.");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth authorize error:", error);
          return null;
        }
      },
    }),
  ],
});
