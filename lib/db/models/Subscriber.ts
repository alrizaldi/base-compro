import mongoose from "mongoose";

export interface ISubscriber extends mongoose.Document {
  email: string;
  name?: string;
  status: "active" | "unsubscribed";
  subscribedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subscriberSchema = new mongoose.Schema<ISubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "unsubscribed"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Prevent duplicate model compilation in hot-reloading
const Subscriber =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>("Subscriber", subscriberSchema);

export default Subscriber;
