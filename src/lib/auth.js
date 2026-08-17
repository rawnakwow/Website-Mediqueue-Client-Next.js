import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis;
const client = globalForMongo.mediqueueMongoClient || new MongoClient(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
);
if (process.env.NODE_ENV !== "production") globalForMongo.mediqueueMongoClient = client;

const appURL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const databaseName = process.env.DB_NAME || "mediqueue";

const socialProviders = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  ? {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        prompt: "select_account",
      },
    }
  : {};

export const auth = betterAuth({
  appName: "MediQueue",
  baseURL: appURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [appURL],
  database: mongodbAdapter(client.db(databaseName), { client }),
  emailAndPassword: { enabled: true, minPasswordLength: 6 },
  socialProviders,
  session: { cookieCache: { enabled: true, maxAge: 5 * 60, strategy: "jwt" } },
  plugins: [
    jwt({
      jwt: {
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
