import db from "../src/db.js";

const Ocjene = db.collection("Ocjena");

export const fetchAllRatings = async (req, res) => {
  try {
    const allRatings = await Ocjene.find({}).toArray();
    return res.status(200).json(allRatings);
  } catch (err) {
    return res.status(500).json({ error: "Greška kod dohvaćanja ocjena: " + err.message });
  }
};

export const fetchRateById = async (req, res) => {
  const { id } = req.params;
  try {
    const rate = await Ocjene.findOne({ id });
    if (!rate) {
      return res.status(404).json({ message: "Ocjena s tim ID-em ne postoji." });
    }
    return res.json(rate);
  } catch (err) {
    return res.status(500).json({ error: "Greška kod pretrage ocjene: " + err.message });
  }
};

export const createRate = async (req, res) => {
  const { id, ocjena, komentar } = req.body;

  if (!id || !ocjena) {
    return res.status(400).json({ message: "Potrebno je unijeti ID i ocjenu." });
  }

  try {
    const insertResult = await Ocjene.insertOne({ id, ocjena, komentar: komentar || "" });
    return res.status(201).json({
      message: "Ocjena je dodana.",
      insertedId: insertResult.insertedId,
    });
  } catch (err) {
    return res.status(500).json({ error: "Greška kod spremanja ocjene: " + err.message });
  }
};

export const removeRate = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteResult = await Ocjene.deleteOne({ id });
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "Ocjena nije pronađena." });
    }
    return res.json({ message: "Ocjena je uspješno obrisana." });
  } catch (err) {
    return res.status(500).json({ error: "Greška kod brisanja: " + err.message });
  }
};

export const rateMethods = {
  fetchAllRatings,
  fetchRateById,
  createRate,
  removeRate,
};
