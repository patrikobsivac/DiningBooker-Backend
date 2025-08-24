const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const mongoURI = process.env.MONGO_URI; 
const dbName = process.env.DB_NAME || "DiningBooker";

let db = null;

const connectToDatabase = async () => {
  if (db) return db;

  try {
    console.log("Establishing connection...");
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,
      tlsInsecure: true
    });

    await client.connect();
    db = client.db(dbName);
    console.log(`Connection to database "${dbName}" established.`);
    return db;
  } catch (e) {
    console.error("Error connecting to the database:", e);
    throw e;
  }
};

module.exports = { connectToDatabase };