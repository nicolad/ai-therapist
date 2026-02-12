import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { LibsqlDialect } from "@libsql/kysely-libsql";

const dialect = new LibsqlDialect({
  url: process.env.TURSO_DATABASE_URL as string,
  authToken: process.env.TURSO_AUTH_TOKEN as string,
});

export const auth = betterAuth({
  database: {
    dialect,
    type: "sqlite",
  },
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  // Reduces round-trips with remote DB (requires migration)
  experimental: {
    joins: true,
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: false, // Set to true if you want email verification
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  trustedOrigins: [
    process.env.BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000",
  ],
  socialProviders: {
    // Add social providers as needed
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // },
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // },
  },
  plugins: [
    nextCookies(), // Must be last plugin - handles cookies in server actions
  ],
});

export type Session = typeof auth.$Infer.Session;
