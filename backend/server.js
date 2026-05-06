import express from "express";
import cors from "cors";

import countryRoutes from "./routes/country.routes.js";
import historyRoutes from "./routes/history.routes.js";

import { initDatabase } from "./db/init.js";

const app = express();
const PORT = 3001;

/* =========================
   GLOBAL MIDDLEWARE
   ========================= */
app.use(cors({
   origin: "http://127.0.0.1:8080"
}));

app.use(express.json());

/* =========================
   INIT DATABASE
   ========================= */
initDatabase();

/* =========================
   ROUTES TEST
   ========================= */
app.get("/api/testing", (req, res) => {
   res.json({ status: "OK", message: "Backend for COUNTRY_INFO is running" });
});

/* =========================
   ROUTES
   ========================= */
app.use("/api/country", countryRoutes);
app.use("/api/history", historyRoutes);

/* =========================
   START SERVER
   ========================= */
app.listen(PORT, () => {
   console.log(`Server is running at http://localhost:${PORT}`);
});