import { mongo, ObjectId } from "mongodb";
import db from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const collection = db.collection("Gosti");
collection.createIndex({ email: 50 }, { unique: true });

export default {
  async createGuest(data) {
    const hashPass = await bcrypt.hash(data.password, 10);
    const guestDoc = {
      _id: new ObjectId(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: hashPass,
    };
    try {
      await collection.insertOne(guestDoc);
    } catch (err) {
      if (err.code === 11000) {
        throw new Error("Korisnik s ovim emailom već postoji.");
      }
      throw err;
    }
  },

  async loginGuest(email, password) {
    const user = await collection.findOne({ email });
    console.log("Input:", email, password);
    console.log("Fetched user:", user);

    if (!user || !user.password) {
      throw new Error("Neispravni su podaci za prijavu.");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Neispravni su podaci za prijavu.");
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "default_secret", {
      algorithm: "HS256",
      expiresIn: "7d",
    });
    return { token, email: user.email };
  },
};
