import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Interface describing the shape of a User document in TypeScript
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  createdAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  },
);

// Middleware: runs automatically BEFORE saving a user document
// Note: In modern Mongoose with TypeScript, async middleware should NOT pass or call `next()`
userSchema.pre("save", async function () {
  // Only hash the password if it's new or has been changed
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method: compares a plain-text password to the hashed one in the DB
userSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
