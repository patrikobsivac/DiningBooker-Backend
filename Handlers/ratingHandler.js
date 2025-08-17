import db from "../src/db.js";

const Ocjene = db.collection("Ocjena");

export const fetchAllRates = async (req, res) => {
  try {
    const allRates = await Ocjene.find({}).toArray();
    return res.status(200).json(allRates);
  } catch (err) {
    return res.status(500).json({ error: "Greška kod dohvaćanja ocjena: " + err.message });
  }
};
/* To be continued... */
export const rateMethods = {
  fetchAllRates,
};