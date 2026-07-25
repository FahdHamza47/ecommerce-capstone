import { Request, Response } from "express";
import Product from "../models/Product";

// @route  GET /api/products/categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
// @route   GET /api/products
// Supports: ?keyword=shirt&category=Clothing&minPrice=10&maxPrice=100
//           &sort=price_asc&page=1&limit=8
export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;

    // Build a dynamic filter object based on query params
    const filter: Record<string, any> = {};

    if (req.query.keyword) {
      filter.name = { $regex: req.query.keyword as string, $options: "i" }; // case-insensitive search
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // Build sort object
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 }; // newest first, default
    switch (req.query.sort) {
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "name_asc":
        sortOption = { name: 1 };
        break;
      case "rating_desc":
        sortOption = { rating: -1 };
        break;
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @route   GET /api/products/:id
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @route   POST /api/products (Admin only)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, brand, stock } = req.body;

    // Safely cast req to access files attached by Multer
    const files = (req as any).files as Array<{ filename: string }> | undefined;
    const images = files
      ? files.map((file) => `/uploads/${file.filename}`)
      : [];

    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      stock,
      images,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @route   PUT /api/products/:id (Admin only)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const { name, description, price, category, brand, stock } = req.body;

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;
    product.stock = stock ?? product.stock;

    // If new images were uploaded, append them
    const files = (req as any).files as Array<{ filename: string }> | undefined;
    if (files && files.length > 0) {
      const newImages = files.map((file) => `/uploads/${file.filename}`);
      product.images = [...product.images, ...newImages];
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @route   DELETE /api/products/:id (Admin only)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    await product.deleteOne();
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
