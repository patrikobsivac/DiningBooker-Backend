import { connectToDatabase } from "../src/db.js";


async function getMenuCollection() {
  const db = await connectToDatabase();
  return db.collection("Menu");
}

export const fetchAllMenus = async (req, res) => {
  try {
    const Menu = await getMenuCollection();
    const allMenus = await Menu.find({}).toArray();
    return res.status(200).json(allMenus);
  } catch (err) {
    return res.status(500).json({ error: "Greška kod dohvaćanja menija: " + err.message });
  }
};

export const fetchMenuById = async (req, res) => {
  const { id } = req.params;
  try {
    const Menu = await getMenuCollection();
    const foundMenu = await Menu.findOne({ id });
    if (!foundMenu) {
      return res.status(404).json({ message: "Meni s traženim ID-em ne postoji." });
    }
    return res.json(foundMenu);
  } catch (err) {
    return res.status(500).json({ error: "Greška kod dohvaćanja: " + err.message });
  }
};

export const createMenu = async (req, res) => {
  const { id, nazivMenua } = req.body;

  if (!id || !nazivMenua) {
    return res.status(400).json({ message: "Potrebno je unijeti ID i naziv menija." });
  }

  try {
    const Menu = await getMenuCollection();
    const insertResult = await Menu.insertOne({ id, nazivMenua });
    return res.status(201).json({
      message: "Novi meni je kreiran.",
      insertedId: insertResult.insertedId,
    });
  } catch (err) {
    return res.status(500).json({ error: "Greška kod unosa: " + err.message });
  }
};

export const removeMenu = async (req, res) => {
  const { id } = req.params;
  try {
    const Menu = await getMenuCollection();
    const deleteResult = await Menu.deleteOne({ id });
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "Nije pronađen meni za brisanje." });
    }
    return res.json({ message: "Meni uspješno uklonjen." });
  } catch (err) {
    return res.status(500).json({ error: "Greška kod brisanja: " + err.message });
  }
};

export const fetchMenusByCategory = async (req, res) => {
  try {
    const Menu = await getMenuCollection();
    const filter = req.query.category ? { category: req.query.category } : {};
    const filteredMenus = await Menu.find(filter).toArray();
    return res.json(filteredMenus);
  } catch (err) {
    return res.status(500).json({ error: "Greška kod filtriranja: " + err.message });
  }
};

export const menuMethods = {
  fetchAllMenus,
  fetchMenuById,
  createMenu,
  removeMenu,
  fetchMenusByCategory,
};
