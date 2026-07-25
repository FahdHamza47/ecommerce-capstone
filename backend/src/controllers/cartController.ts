import { Response } from "express";
import Cart, { ICartItem } from "../models/Cart";
import Product from "../models/Product";
import { AuthRequest } from "../middleware/authMiddleware";

// @route  GET /api/cart
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user!._id }).populate(
      "items.product",
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user!._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @route  POST /api/cart  Body: { productId, quantity }
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (product.stock < quantity) {
      res.status(400).json({ message: "Not enough stock available" });
      return;
    }

    let cart = await Cart.findOne({ user: req.user!._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user!._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item: ICartItem) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
      } as unknown as ICartItem);
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @route  PUT /api/cart/:productId  Body: { quantity }
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const item = cart.items.find(
      (item: ICartItem) => item.product.toString() === productId,
    );
    if (!item) {
      res.status(404).json({ message: "Item not found in cart" });
      return;
    }

    item.quantity = Number(quantity);
    await cart.save();

    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @route  DELETE /api/cart/:productId
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    cart.items = cart.items.filter(
      (item: ICartItem) => item.product.toString() !== productId,
    );
    await cart.save();

    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @route  DELETE /api/cart
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user!._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
