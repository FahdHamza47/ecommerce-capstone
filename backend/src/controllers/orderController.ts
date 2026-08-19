import { Response } from "express";
import Order from "../models/Order";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { AuthRequest } from "../middleware/authMiddleware";

// @route  POST /api/orders
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderItems, shippingAddress, subtotal, tax, shipping, totalPrice } =
      req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: "No order items provided" });
      return;
    }
    const reserved: { productId: string; quantity: number }[] = [];

    for (const item of orderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true },
      );

      if (!updatedProduct) {
        for (const r of reserved) {
          await Product.findByIdAndUpdate(r.productId, {
            $inc: { stock: r.quantity },
          });
        }
        res.status(400).json({
          message: `Insufficient stock for "${item.name}". Please update your cart and try again.`,
        });
        return;
      }

      reserved.push({ productId: item.product, quantity: item.quantity });
    }

    const order = await Order.create({
      user: req.user!._id,
      orderItems,
      shippingAddress,
      subtotal,
      tax,
      shipping,
      totalPrice,
    });

    // Clear the user's cart now that the order has been placed
    await Cart.findOneAndUpdate({ user: req.user!._id }, { items: [] });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @route  GET /api/orders/myorders
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user!._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
// @route  GET /api/orders (Admin only)
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @route  PUT /api/orders/:id/status (Admin only)
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered"];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status value" });
      return;
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
