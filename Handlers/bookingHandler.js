import { connectToDatabase } from "../src/db.js";
import { ObjectId } from "mongodb";


async function getBookingCollection() {
  const db = await connectToDatabase();
  return db.collection("Rezervacija");
}

export async function fetchAllBooking(req, res) {
  try {
    const collection = await getBookingCollection();
    const allBooking = await collection.find({}).toArray();
    return res.status(200).json(allBooking);
  } catch (err) {
    return res.status(500).json({ error: "Greška kod dohvaćanja rezervacija: " + err.message });
  }
}

export async function fetchBookingById(req, res) {
  const { id } = req.params;
  try {
    const collection = await getBookingCollection();
    const booking = await collection.findOne({ _id: new ObjectId(id) });
    if (!booking) {
      return res.status(404).json({ message: "Rezervacija s tim ID-om ne postoji." });
    }
    return res.status(200).json(booking);
  } catch (err) {
    return res.status(500).json({ error: "Greška kod dohvaćanja rezervacije: " + err.message });
  }
}

export async function fetchBookingByGost(req, res) {
  const { id: gostId } = req.params;
  try {
    const collection = await getBookingCollection();
    const bookings = await collection.find({ gostId }).toArray();
    if (bookings.length === 0) {
      return res.status(404).json({ message: "Nisu pronađene rezervacije za odabranog gosta." });
    }
    return res.status(200).json(bookings);
  } catch (err) {
    return res.status(500).json({ error: "Greška kod dohvaćanja rezervacija gosta: " + err.message });
  }
}

export async function createBooking(req, res) {
  const { gostId, datum, vrijeme, brojStolova, napomena } = req.body;

  if (!gostId || !datum || !vrijeme || !brojStolova) {
    return res.status(400).json({ message: "Potrebno je unijeti gostId, datum, vrijeme i broj stolova." });
  }

  try {
    const collection = await getBookingCollection();
    const insertResult = await collection.insertOne({
      gostId,
      datum,
      vrijeme,
      brojStolova,
      napomena: napomena || "",
    });
    return res.status(201).json({
      message: "Nova rezervacija je dodana.",
      insertedId: insertResult.insertedId,
    });
  } catch (err) {
    return res.status(500).json({ error: "Greška kod dodavanja rezervacije: " + err.message });
  }
}

export async function removeBooking(req, res) {
  const { id } = req.params;
  try {
    const collection = await getBookingCollection();
    const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "Rezervacija nije pronađena." });
    }
    return res.status(200).json({ message: "Rezervacija je obrisana." });
  } catch (err) {
    return res.status(500).json({ error: "Greška kod brisanja rezervacije: " + err.message });
  }
}

export const bookingMethods = {
  fetchAllBooking,
  fetchBookingById,
  fetchBookingByGost,
  createBooking,
  removeBooking,
};
