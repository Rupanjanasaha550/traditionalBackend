import Product from "../models/Product.js";

/* ================= GET ALL PRODUCTS (PUBLIC + SEARCH) ================= */
export const getProducts = async (req, res) => {
  try {
    const query = {};

    if (req.query.category) {
      query.category = new RegExp(`^${req.query.category}$`, "i");
    }

    if (req.query.state) {
      query.state = new RegExp(req.query.state, "i");
    }

    if (req.query.search) {
      query.$or = [
        { title: new RegExp(req.query.search, "i") },
        { category: new RegExp(req.query.search, "i") },
        { state: new RegExp(req.query.search, "i") }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};


/* ================= GET SINGLE PRODUCT ================= */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch product"
    });
  }
};

/* ================= CREATE PRODUCT (SELLER) ================= */
export const createProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Image required" });
    }

    const images = req.files.map(
      (file) => `/uploads/${file.filename}`
    );

    const product = await Product.create({
      ...req.body,
      images,
      seller: req.user.id
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({
      message: "Product creation failed"
    });
  }
};

/* ================= UPDATE PRODUCT ================= */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user.id
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found" });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json(product);
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({
      message: "Update failed"
    });
  }
};

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller: req.user.id // 🔥 ownership check
    });

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found or not authorized"
      });
    }

    res.json({
      message: "Product deleted successfully"
    });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({
      message: "Delete failed"
    });
  }
};

/* ================= GET SELLER PRODUCTS ================= */
export const getMyProducts = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized" });
    }

    const products = await Product.find({
      seller: req.user.id
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("GET MY PRODUCTS ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch seller products"
    });
  }
};
