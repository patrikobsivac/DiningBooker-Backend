import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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