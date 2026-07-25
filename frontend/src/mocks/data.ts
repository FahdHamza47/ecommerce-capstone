import { Product, Cart } from "../types";

export const mockProducts: Product[] = [
  {
    _id: "prod1",
    name: "Classic Leather Sneakers",
    description: "Premium leather sneakers with a minimalist silhouette.",
    price: 89.99,
    category: "Footwear",
    brand: "Urbanist",
    stock: 25,
    images: ["/uploads/sneakers.jpg"],
    rating: 4.5,
    numReviews: 12,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    _id: "prod2",
    name: "Merino Wool Sweater",
    description: "Soft, breathable merino wool sweater.",
    price: 64.5,
    category: "Clothing",
    brand: "Northfield",
    stock: 0,
    images: ["/uploads/sweater.jpg"],
    rating: 4.7,
    numReviews: 8,
    createdAt: "2024-01-02T00:00:00.000Z",
  },
];

export const mockCart: Cart = {
  _id: "cart1",
  user: "user1",
  items: [
    {
      _id: "item1",
      product: mockProducts[0],
      quantity: 2,
    },
  ],
};

export const mockUser = {
  _id: "user1",
  name: "Jane Doe",
  email: "jane@example.com",
  role: "customer" as const,
  token: "mock-jwt-token",
};
