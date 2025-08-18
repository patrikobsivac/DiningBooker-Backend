import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { guestService } from "../Handlers/guestHandler.js";
import { rateMethods } from "../Handlers/ratingHandler.js";
import { menuMethods } from "../Handlers/menuHandler.js";
import { bookingService } from "../Handlers/bookingHandler.js";
const app = express();
const router = express.Router();
const PORT = 3000;

dotenv.config();
app.use(express.json());
app.use(cors());
app.use("/api", router);
app.listen(port, () => {
    console.log(`Servis sluša na portu ${PORT}`);
});