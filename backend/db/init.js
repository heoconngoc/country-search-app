import { db } from "./database.js";

export function initDatabase(){
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS countries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_common TEXT UNIQUE,
        name_official TEXT,
        flag_png TEXT,
        capital TEXT,
        population INTEGER,
        region TEXT,
        subregion TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country_name TEXT,
        flag_png TEXT,
        view_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
}