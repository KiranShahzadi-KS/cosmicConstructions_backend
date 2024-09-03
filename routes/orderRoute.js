const express = require("express");
const {
  addtoCart,
  updateCart,
  deleteCart,
  clearCart,
  getCart,
  updateShippingAddress,
  newOrder,
  getOrderById,
  getOrdersByUserId,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", newOrder);
router.get("/:orderId", getOrderById);

router.get("/user/:userId", getOrdersByUserId);

// router.post("/", addtoCart);
// router.post("/new-order", newOrder);

router.get("/:userId", getCart);
router.post("/:id", updateCart);
router.delete("/:id", deleteCart);

router.delete("/clear/:userId", clearCart);

// router.post("/shipping-address", updateShippingAddress);
// router.post("/shipping-address", updateShippingAddress);

module.exports = router;
