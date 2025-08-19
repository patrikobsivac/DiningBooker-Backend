import { MongoClient } from "mongodb";
const connectionString = "";
const client = new MongoClient(connectionString);
let conn = null;

try {
  console.log("Trying to establish connection...");
  conn = await client.connect();
} catch (e) {
  console.error(e);
}
let db = conn.db("Diningbooker");

export default db;