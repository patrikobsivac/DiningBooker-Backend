import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { guestMethods } from "./guestHandler.js";
import { menuMethods } from "./menuHandler.js";
import { bookingService } from "./bookingHandler.js";
import { rateMethods } from "./ratingHandler.js";

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;

dotenv.config();
app.use(express.json());
app.use(cors());
app.use("/api", router);

router.get("/guests", (req, res) => {
  res.json(guestMethods.fetchAllGuests());
});

router.get("/guests/:id", (req, res) => {
  const guest = guestMethods.fetchGuestById(req.params.id);
  if (!guest) return res.status(404).json({ message: "Gost nije pronađen" });
  res.json(guest);
});

router.post("/guests", (req, res) => {
  const newGuest = req.body;
  if (!newGuest?.id || !newGuest?.name) {
    return res.status(400).json({ message: "Potrebno je unijeti ID i ime gosta." });
  }
  const allGuests = guestMethods.createGuest(newGuest);
  res.status(201).json(allGuests);
});

router.get("/menus", menuMethods.fetchAllMenus);
router.get("/menus/:id", menuMethods.fetchMenuById);
router.post("/menus", menuMethods.createMenu);
router.delete("/menus/:id", menuMethods.removeMenu);
router.get("/menus/filter/category", menuMethods.fetchMenusByCategory);

router.get("/bookings", bookingMethods.fetchAllBooking);
router.get("/bookings/:id", bookingMethods.fetchBookingById);
router.get("/bookings/guest/:id", bookingMethods.fetchBookingByGost);
router.post("/bookings", bookingMethods.createBooking);
router.delete("/bookings/:id", bookingMethods.removeBooking);

router.get("/ratings", rateMethods.fetchAllRatings);
router.get("/ratings/:id", rateMethods.fetchRatingById);
router.post("/ratings", rateMethods.createRating);
router.delete("/ratings/:id", rateMethods.removeRating);

app.listen(PORT, () => {
  console.log(`Servis sluša na portu ${PORT}`);
});
