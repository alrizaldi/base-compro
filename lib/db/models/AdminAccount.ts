import mongoose from "mongoose";

export interface IAdminAccount extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: "super_admin" | "admin" | "editor";
  status: "active" | "suspended";
  lastActiveAt: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const adminAccountSchema = new mongoose.Schema<IAdminAccount>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["super_admin", "admin", "editor"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    lastActiveAt: { type: Date, default: Date.now },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password; // Never expose password hashes
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password; // Never expose password hashes
        return ret;
      },
    },
  },
);

// Prevent duplicate model compilation in hot-reloading
const AdminAccount =
  mongoose.models.AdminAccount ||
  mongoose.model<IAdminAccount>("AdminAccount", adminAccountSchema);

export default AdminAccount;
