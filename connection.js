const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
dotenv.config();

const mongoURI = process.env.MONGO_URL;

let db = null;

const connectToDatabase = async () => {
  if (db) return db; 

  try {
    console.log("Establishing connection...");
    const client = new MongoClient(connection, {
      tls: true,
      tlsInsecure: true });
    const con = await client.connect();
    db = client.db("rezervacija"); 
    console.log("Connection to database established.");
    return db;
  } catch (e) {
    console.error("Error connecting to the database:", e);
    throw e; 
  }
};

module.exports = { connectToDatabase };