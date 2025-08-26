import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { guestMethods } from "./Handlers/guestHandler.js";
import { menuMethods } from "./Handlers/menuHandler.js";
import { bookingMethods } from "./Handlers/bookingHandler.js";
import { rateMethods } from "./Handlers/ratingHandler.js";
import { ObjectId } from "mongodb";
import auth from "./src/auth.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;

  if (!email || !password) 
    return res.status(400).json({ message: "Email i lozinka su obavezni." });

  if (password.length < 4) 
    return res.status(400).json({ message: "Lozinka mora biti minimalno 4 znaka." });

  try {
    const collection = await auth.getGuestCollection(); 
    const existing = await collection.findOne({ email });
    if (existing) 
      return res.status(409).json({ message: "Korisnik s ovim emailom već postoji." });

    const hashPass = await bcrypt.hash(password, 10);
    const newGuest = {
      _id: new ObjectId(),
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      phoneNumber: phoneNumber || "",
      password: hashPass,
    };
    await collection.insertOne(newGuest);

    const token = jwt.sign(
      { id: newGuest._id },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );
    const { password: _, ...guestWithoutPassword } = newGuest;
    return res.status(201).json({ guest: guestWithoutPassword, token });
  } catch (err) {
    return res.status(500).json({ message: "Greška na serveru: " + err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email i lozinka su obavezni." });

  try {
    const collection = await auth.getGuestCollection();
    const user = await collection.findOne({ email });
    if (!user) 
      return res.status(403).json({ message: "Neispravni podaci za prijavu." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) 
      return res.status(403).json({ message: "Neispravni podaci za prijavu." });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({ user: userWithoutPassword, token });
  } catch (err) {
    return res.status(500).json({ message: "Greška na serveru: " + err.message });
  }
});

app.post("/changePass", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) 
    return res.status(400).json({ message: "Email i nova lozinka su obavezni." });

  try {
    await auth.updatePassword(email, password);
    return res.status(200).json({ message: "Lozinka uspješno promijenjena." });
  } catch (err) {
    return res.status(500).json({ message: "Greška na serveru: " + err.message });
  }
});

app.get("/secret", auth.authMiddleware, (req, res) => {
  return res.status(200).json({ message: `Ovo je tajna za korisnika s ID: ${req.jwt.id}` });
});

router.get("/guests", guestMethods.fetchGuests);
router.get("/guests/:id", guestMethods.fetchGuestById);
router.get("/guests/email/:email", guestMethods.fetchGuestByEmail);
router.post("/guests", guestMethods.addGuest);
router.delete("/guests/:id", guestMethods.removeGuest);

router.get("/menus", menuMethods.fetchAllMenus);
router.get("/menus/:id", menuMethods.fetchMenuById);
router.get("/menus/filter/category", menuMethods.fetchMenusByCategory);
router.post("/menus", menuMethods.createMenu);
router.patch("/menus/:id", menuMethods.updateMenu);
router.delete("/menus/:id", menuMethods.removeMenu);

router.get("/bookings", bookingMethods.fetchAllBooking);
router.get("/bookings/:id", bookingMethods.fetchBookingById);
router.get("/bookings/guest/:id", bookingMethods.fetchBookingByGost);
router.post("/bookings", bookingMethods.createBooking);
router.put("/bookings/:id/rating", bookingMethods.updateBookingRating);
router.delete("/bookings/:id", bookingMethods.removeBooking);

router.get("/ratings", rateMethods.fetchAllRatings);
router.get("/ratings/:id", rateMethods.fetchRatingById);
router.post("/ratings", rateMethods.createRating);
router.delete("/ratings/:id", rateMethods.removeRating);


app.get("/", (req, res) => {
  res.send("");
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Servis sluša na portu ${PORT}`);
});
