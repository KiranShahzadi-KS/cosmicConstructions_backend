const Product = require("../models/productModel");
const slugify = require("slugify");
// const Order_Summary = require("../models/orderSummary");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const {
      productName,
      price,
      sku,
      description,
      isAvailable,
      isNew,
      isLike,
      colorId,
      attributesId,
      categoryId,
      thumbnail, // Expecting a URL
      images, // Expecting an array of URLs
    } = req.body;

    const slug = slugify(productName, { lower: true });

    const existingProduct = await Product.findOne({ productName });
    if (existingProduct) {
      return res.status(409).json({ message: "Product already added." });
    }

    const normalisedIsAvailable =
      isAvailable.trim().toLowerCase() === "yes" ? "Yes" : "No";
    const normalisedIsNew = isNew.trim().toLowerCase() === "yes" ? "Yes" : "No";

    const cleanedPrice = parseFloat(price);

    const product = new Product({
      productName,
      slug,
      price: cleanedPrice,
      sku,
      description,
      isAvailable: normalisedIsAvailable,
      isNew: normalisedIsNew,
      isLike,
      colorId,
      attributesId,
      categoryId,
      thumbnail,
      images,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get all
exports.getAllProducts = async (req, res) => {
  try {
    const {
      search = "",
      categoryId = "",
      attributesId = "",
      colorId = "",
      minPrice = 1,
      maxPrice = 250,
      page = 1,
      limit = 10,
      startDate,
      endDate,
    } = req.query;

    const formattedSearchTerm = search.trim().toLowerCase().replace(/\s+/g, "");

    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const minPriceNumber = parseFloat(minPrice) || 1;
    const maxPriceNumber = parseFloat(maxPrice) || 250;

    const query = {
      price: { $gte: minPriceNumber, $lte: maxPriceNumber },
    };

    if (formattedSearchTerm) {
      query.productName = { $regex: formattedSearchTerm, $options: "i" };
    }

    if (categoryId) query.categoryId = categoryId;
    if (attributesId) query.attributesId = attributesId;
    if (colorId) query.colorId = colorId;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      query.createdAt = { $gte: start, $lte: end };
      query.updatedAt = { $gte: start, $lte: end };
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(pageSize)
      .populate("colorId", "colorName")
      .populate("attributesId", "attributeName")
      .populate("categoryId", "categoryName")
      .populate({
        path: "reviews",
        populate: { path: "userId", select: "userName" },
      })
      .populate("isLike", "userName");

    const totalCount = await Product.countDocuments(query);

    res.status(200).json({
      totalCount,
      page: pageNumber,
      pageSize: pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get by id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("colorId", "colorName")
      .populate("attributesId", "attributeName")
      .populate("categoryId", "categoryName")
      .populate({
        path: "reviews",
        populate: { path: "userId", select: "userName" },
      })
      .populate("isLike", "userName");

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    if (req.body.productName) {
      req.body.slug = slugify(req.body.productName);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//delete
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully.", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const formattedSearchTerm = search.trim().toLowerCase();

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const products = await Product.find({
      productName: { $regex: formattedSearchTerm, $options: "i" },
    })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await Product.countDocuments({
      productName: { $regex: formattedSearchTerm, $options: "i" },
    });

    res.status(200).json({
      totalCount,
      page: pageNumber,
      pageSize: pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
