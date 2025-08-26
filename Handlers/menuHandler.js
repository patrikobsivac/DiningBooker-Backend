import { connectToDatabase } from "../src/db.js";
import { ObjectId } from "mongodb";

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
    const foundMenu = await Menu.findOne({ _id: new ObjectId(id) });
    if (!foundMenu) {
      return res.status(404).json({ message: "Meni s traženim ID-em ne postoji." });
    }
    return res.json(foundMenu);
  } catch (err) {
    return res.status(500).json({ error: "Greška kod dohvaćanja: " + err.message });
  }
};

export const createMenus = async (req, res) => {
  const menus = req.body; // očekujemo niz objekata

  if (!Array.isArray(menus) || menus.length === 0) {
    return res.status(400).json({ message: "Potrebno je poslati niz menija." });
  }

  try {
    const Menu = await getMenuCollection();
    const formattedMenus = menus.map(m => ({
      name: m.name,
      price: parseFloat(m.price),
      category: m.category,
    }));

    const insertResult = await Menu.insertMany(formattedMenus);
    return res.status(201).json({
      message: `${insertResult.insertedCount} menija je kreirano.`,
      insertedIds: insertResult.insertedIds
    });
  } catch (err) {
    return res.status(500).json({ error: "Greška kod unosa: " + err.message });
  }
};

export const removeMenu = async (req, res) => {
  const { id } = req.params;
  try {
    const Menu = await getMenuCollection();
    const deleteResult = await Menu.deleteOne({ _id: new ObjectId(id) });
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

export const updateMenu = async (req, res) => {
  const { id } = req.params;
  const { name, price, category } = req.body;

  try {
    const Menu = await getMenuCollection();
    const updateFields = {};

    if (name) updateFields.name = name;
    if (price) updateFields.price = parseFloat(price);
    if (category) updateFields.category = category;

    const result = await Menu.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Meni nije pronađen." });
    }

    res.json({ message: "Meni uspješno ažuriran." });
  } catch (err) {
    res.status(500).json({ error: "Greška kod ažuriranja: " + err.message });
  }
};


export const menuMethods = {
  fetchAllMenus,
  fetchMenuById,
  createMenu,
  removeMenu,
  updateMenu, 
  fetchMenusByCategory,
};