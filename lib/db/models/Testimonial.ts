import mongoose from "mongoose";

export interface ITestimonial extends mongoose.Document {
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new mongoose.Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    content: { type: String, required: true },
    avatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
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

const Testimonial =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", testimonialSchema);

export default Testimonial;
