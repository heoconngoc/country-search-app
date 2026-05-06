// Controllers = received request from routes → call service → return response

import { findOrFetchCountry } from "../services/country.service.js";

export async function getCountry(req, res) {
  const name = req.params.name;

  try {
    const country = await findOrFetchCountry(name);
    res.json(country);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
