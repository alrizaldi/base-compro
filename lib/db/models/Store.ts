import mongoose from "mongoose";

export interface IStore extends mongoose.Document {
  name: string;
  address: string;
  city: string;
  phone: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new mongoose.Schema<IStore>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    image: { type: String },
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

const Store =
  mongoose.models.Store || mongoose.model<IStore>("Store", storeSchema);

export default Store;
