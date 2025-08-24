import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { guestMethods } from "./Handlers/guestHandler.js";
import { menuMethods } from "./Handlers/menuHandler.js";
import { bookingMethods } from "./Handlers/bookingHandler.js";
import { rateMethods } from "./Handlers/ratingHandler.js";
import auth from "./src/auth.js"; 

dotenv.config();

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email i lozinka su obavezni." });

  try {
    const result = await auth.loginGuest(email, password);
    return res.status(200).json({ token: result.token, email: result.email });
  } catch (err) {
    return res.status(403).json({ error: err.message });
  }
});

app.post("/gosti", async (req, res) => {
  const gostData = req.body;
  if (!gostData?.email || !gostData?.password) return res.status(400).json({ error: "Email i lozinka su obavezni." });

  try {
    await auth.createGuest(gostData);
    return res.status(201).json({ message: "Gost je uspješno registriran." });
  } catch (err) {
    if (err.message.includes("već postoji")) return res.status(409).json({ error: err.message });
    return res.status(500).json({ error: "Greška na serveru: " + err.message });
  }
});

app.post("/changePass", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email i nova lozinka su obavezni." });

  try {
    await auth.updatePassword(email, password);
    return res.status(200).json({ message: "Lozinka uspješno promijenjena." });
  } catch (err) {
    return res.status(500).json({ error: "Greška na serveru: " + err.message });
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
router.delete("/menus/:id", menuMethods.removeMenu);

router.get("/bookings", bookingMethods.fetchAllBooking);
router.get("/bookings/:id", bookingMethods.fetchBookingById);
router.get("/bookings/guest/:id", bookingMethods.fetchBookingByGost);
router.post("/bookings", bookingMethods.createBooking);
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
