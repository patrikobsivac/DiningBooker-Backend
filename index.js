import express from "express";
const app = express();
const router = express.Router();
const PORT = process.env.port || 3000;

app.use(express.json());
app.use("/api", router);
app.listen(port, () => {
    console.log(`Servis sluša na portu ${PORT}`);
});