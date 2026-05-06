// Services = Deal with logic algorithm (DB, API, cache…)

import { db } from "../db/database.js";
import fetch from "node-fetch";

export function findCountryInDB(name) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM countries WHERE name_common = ?",
      [name],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

export function saveCountryToDB(country) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR IGNORE INTO countries 
      (name_common, name_official, flag_png, capital, population, region, subregion)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        country.name.common,
        country.name.official,
        country.flags.png,
        country.capital?.[0] || null,
        country.population,
        country.region,
        country.subregion
      ],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export async function findOrFetchCountry(name) {
  const cached = await findCountryInDB(name);
  if (cached) return cached;

  const res = await fetch(`https://restcountries.com/v3.1/name/${name}`);
  const data = await res.json();

  if (!data || data.status === 404) {
    throw new Error("Country not found");
  }

  const country = data[0];
  await saveCountryToDB(country);

  return country;
}
