import { ObjectId } from "mongodb";

const collection = db.collection("Rezervacija");

export async function fetchAllBooking(req, res) {
  try {
    const allBooking = await collection.find({}).toArray();
    return res.json(allBooking);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function fetchBookingById(req, res) {
  const { id } = req.params;
  try {
    const booking = await collection.findOne({ _id: new ObjectId(id) });
    if (!booking) {
      return res
        .status(404)
        .json({ message: "Rezervacija s tim ID-om ne postoji." });
    }
    return res.json(booking);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function fetchBookingByGost(req, res) {
  const { id: gostId } = req.params;
  try {
    const booking = await collection.findOne({ gostId });
    if (!booking) {
      return res
        .status(404)
        .json({ message: "Nije pronađena rezervacija za odabranog gosta." });
    }
    return res.json(booking);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createBooking(req, res) {
  const { gostId, datum, vrijeme, brojStolova, napomena } = req.body;
  try {
    const insertResult = await collection.insertOne({
      gostId,
      datum,
      vrijeme,
      brojStolova,
      napomena,
    });
    return res.status(201).json({
      message: "Nova rezervacija je dodana.",
      insertedId: insertResult.insertedId,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function removeBooking(req, res) {
  const { id } = req.params;
  try {
    const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "Rezervacija nije pronađena." });
    }
    return res.json({ message: "Rezervacija je obrisana." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export const rezervacijaService = {
  fetchAllBooking,
  fetchBookingById,
  fetchBookingByGost,
  createBooking,
  removeBooking,
};
