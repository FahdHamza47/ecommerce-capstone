import { Request, Response } from "express";
import User from "../models/User";
import generateToken from "../utils/generateToken";
import { AuthRequest } from "../middleware/authMiddleware";

// @route  POST /api/auth/register
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res
        .status(400)
        .json({ message: "Please provide name, email, and password" });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res
        .status(400)
        .json({ message: "A user with this email already exists" });
      return;
    }

    // role is intentionally NOT taken from req.body — everyone who
    // registers becomes a 'customer'. Admins are created manually/seeded.
    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString(), user.role),
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @route  POST /api/auth/login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString(), user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @route  GET /api/auth/profile
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  // req.user was attached by the `protect` middleware
  res.json(req.user);
};
