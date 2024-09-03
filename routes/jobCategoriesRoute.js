const express = require("express");
const {
  createCategories,
  getAll,
  getbyId,
  updateCategory,
  deleteCategory,
  getJobsByCategory,
} = require("../controllers/jobCategoryController");

const router = express.Router();

router.post("/", createCategories);
router.get("/", getAll);
router.get("/:id", getbyId);
router.post("/:id", updateCategory);
router.delete("/:id", deleteCategory);

// router.get("/category/:categoryId", getJobsByCategory);

module.exports = router;
