import { ObjectId } from "mongodb";
import { connectToDatabase } from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function getGuestCollection() {
  const db = await connectToDatabase();
  return db.collection("Gosti");
}

export default {
  getGuestCollection, 
  async createGuest(data) {
    const collection = await getGuestCollection();
    const hashPass = await bcrypt.hash(data.password, 10);
    const guestDoc = {
      _id: new ObjectId(),
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email,
      phoneNumber: data.phoneNumber || "",
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
    const collection = await getGuestCollection();
    const user = await collection.findOne({ email });

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

  async updatePassword(email, newPass) {
    const collection = await getGuestCollection();
    const existing = await collection.findOne({ email });
    if (!existing) {
      throw new Error("Gost nije pronađen.");
    }
    const hashed = await bcrypt.hash(newPass, 10);
    await collection.updateOne({ email }, { $set: { password: hashed } });
    return { success: true, email };
  },

  authMiddleware(req, res, next) {
    try {
      const authHeader = req.headers.authorization || "";
      const [scheme, token] = authHeader.split(" ");

      if (scheme !== "Bearer" || !token) {
        return res.status(401).send("Unauthorized");
      }
      req.jwt = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
      return next();
    } catch (err) {
      return res.status(403).send("Forbidden");
    }
  },
};
