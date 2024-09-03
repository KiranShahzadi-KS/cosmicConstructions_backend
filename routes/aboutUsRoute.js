const express = require("express");
const {
  createAboutUs,
  getAllAboutUs,
  getAboutUsById,
  updateAboutUs,
} = require("../controllers/aboutUsController");

const router = express.Router();

router.post("/", createAboutUs);

router.get("/", getAllAboutUs);

router.get("/:id", getAboutUsById);

router.post("/:id", updateAboutUs);

module.exports = router;
