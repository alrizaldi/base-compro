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
      transform: (_doc, ret) => {
        (ret as any).id = (ret as any)._id.toString();
        delete (ret as any)._id;
        delete (ret as any).__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret) => {
        (ret as any).id = (ret as any)._id.toString();
        delete (ret as any)._id;
        delete (ret as any).__v;
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
