import db from "../src/db.js";

const menuCollection = db.collection("Menu");

export const getAllMenu = async (req, res) => {
  try {
    const menu = await menuCollection.find().toArray();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMenuByID = async (req, res) => {
  const menuID = req.params.id;
  try {
    const menu = await menuCollection.findOne({ id: menuID });
    if (!menu) {
      res.status(404).json({ message: "Odabrani jelovnik nije pronađen." });
    }
    res.json(menu);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const menuMethods = {
  getAllMenu,
  getMenuByID
};