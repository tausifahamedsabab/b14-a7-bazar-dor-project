import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

export const client = globalForMongo.mongoClient ?? new MongoClient(uri);

globalForMongo.mongoClient = client;

export const db = client.db("bazardor");
