// Routes = define URL → forward request to controller

import express from "express";
import { getCountry } from "../controllers/country.controller.js";

const router = express.Router();

router.get("/:name", getCountry);

export default router;
