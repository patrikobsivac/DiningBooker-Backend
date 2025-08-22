import { ObjectId } from "mongodb";
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

export const fetchRatingById = async (req, res) => {
  const { id } = req.params;
  try {
    const rating = await Ocjene.findOne({ _id: new ObjectId(id) });
    if (!rating) {
      return res.status(404).json({ message: "Ocjena s tim ID-em ne postoji." });
    }
    return res.status(200).json(rating);
  } catch (err) {
    return res.status(500).json({ error: "Greška kod dohvaćanja ocjene: " + err.message });
  }
};

export const createRating = async (req, res) => {
  const { gostId, ocjena, komentar } = req.body;

  if (!gostId || !ocjena) {
    return res.status(400).json({ message: "Potrebno je unijeti gostId i ocjenu." });
  }

  try {
    const insertResult = await Ocjene.insertOne({
      gostId,
      ocjena,
      komentar: komentar || "",
    });
    return res.status(201).json({
      message: "Ocjena je dodana.",
      insertedId: insertResult.insertedId,
    });
  } catch (err) {
    return res.status(500).json({ error: "Greška kod spremanja ocjene: " + err.message });
  }
};

export const removeRating = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteResult = await Ocjene.deleteOne({ _id: new ObjectId(id) });
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "Ocjena nije pronađena." });
    }
    return res.status(200).json({ message: "Ocjena je uspješno obrisana." });
  } catch (err) {
    return res.status(500).json({ error: "Greška kod brisanja ocjene: " + err.message });
  }
};

export const rateMethods = {
  fetchAllRatings,
  fetchRatingById,
  createRating,
  removeRating,
};
