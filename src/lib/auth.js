import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  throw new Error("MONGODB_URI is not configured");
}

const appURL = (
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

const databaseName = process.env.DB_NAME || "mediqueue";

const googleClientId =
  process.env.GOOGLE_CLIENT_ID?.trim();

const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET?.trim();

/*
 * Reuse the MongoDB client between Next.js/Vercel executions.
 */
const globalForMongo = globalThis;

if (!globalForMongo.mediqueueMongoClient) {
  globalForMongo.mediqueueMongoClient =
    new MongoClient(mongoURI);
}

const client = globalForMongo.mediqueueMongoClient;
const database = client.db(databaseName);

const socialProviders =
  googleClientId && googleClientSecret
    ? {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
          prompt: "select_account",
        },
      }
    : {};

export const auth = betterAuth({
  appName: "MediQueue",

  baseURL: appURL,
  basePath: "/api/auth",

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [appURL],

  database: mongodbAdapter(database, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders,

  /*
   * Store the Google OAuth state in MongoDB.
   * This is suitable for Vercel serverless deployments.
   */
  account: {
    storeStateStrategy: "database",

    accountLinking: {
      enabled: true,
      trustedProviders: [
        "google",
        "email-password",
      ],
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: "jwt",
    },
  },

  plugins: [
    jwt({
      jwt: {
        issuer: appURL,
        audience: appURL,
        expirationTime: "1h",

        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image || null,
        }),
      },
    }),
  ],
});