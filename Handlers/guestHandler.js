import { connectToDatabase } from "../src/db.js";
import { ObjectId } from "mongodb";


async function getCollection() {
  const db = await connectToDatabase();
  return db.collection("Gosti");
}

export async function fetchGuests(req, res) {
  try {
    const collection = await getCollection();
    const result = await collection.find({}).toArray();
    return res.status(200).json({ count: result.length, data: result });
  } catch (err) {
    return res.status(500).json({ error: "Neuspjelo dohvaćanje gostiju: " + err.message });
  }
}

export async function fetchGuestById(req, res) {
  try {
    const collection = await getCollection();
    const { id } = req.params;
    const guest = await collection.findOne({ _id: new ObjectId(id) });

    if (!guest) {
      return res.status(404).json({ message: "Gost s tim ID-em ne postoji." });
    }
    return res.status(200).json(guest);
  } catch (err) {
    return res.status(500).json({ error: "Greška kod traženja gosta: " + err.message });
  }
}

export async function fetchGuestByEmail(req, res) {
  try {
    const collection = await getCollection();
    const { email } = req.params;
    const guest = await collection.findOne({ email });

    if (!guest) {
      return res.status(404).json({ message: "Gost s tim emailom nije pronađen." });
    }
    return res.status(200).json(guest);
  } catch (err) {
    return res.status(500).json({ error: "Greška kod traženja gosta po emailu: " + err.message });
  }
}

export async function addGuest(req, res) {
  const { ime, prezime, godiste, brojTelefona } = req.body;

  if (!ime || !prezime) {
    return res.status(400).json({ message: "Ime i prezime su obavezni." });
  }

  try {
    const collection = await getCollection();
    const insertResult = await collection.insertOne({
      ime,
      prezime,
      godiste: godiste || null,
      brojTelefona: brojTelefona || "",
    });

    return res.status(201).json({
      message: "Gost je dodan u bazu.",
      newId: insertResult.insertedId,
    });
  } catch (err) {
    return res.status(500).json({ error: "Greška kod dodavanja gosta: " + err.message });
  }
}

export async function removeGuest(req, res) {
  try {
    const collection = await getCollection();
    const { id } = req.params;
    const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "Gost nije pronađen za brisanje." });
    }

    return res.status(200).json({ message: "Gost je obrisan iz baze." });
  } catch (err) {
    return res.status(500).json({ error: "Greška kod brisanja gosta: " + err.message });
  }
}

export const guestMethods = {
  fetchGuests,
  fetchGuestById,
  fetchGuestByEmail,
  addGuest,
  removeGuest,
};
