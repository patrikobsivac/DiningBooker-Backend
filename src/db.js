import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || "DiningBooker";

if (!mongoURI) {
  throw new Error("MONGO_URI nije definiran!");
}

let db = null;

export const connectToDatabase = async () => {
  if (db) return db;

  try {
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to database "${dbName}"`);
    return db;
  } catch (e) {
    console.error("Database connection error:", e);
    throw e;
  }
};

export default db;
