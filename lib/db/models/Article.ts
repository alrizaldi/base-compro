import mongoose from "mongoose";

export interface IArticle extends mongoose.Document {
  title: string;
  content: string;
  author: string;
  image?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new mongoose.Schema<IArticle>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String },
    published: { type: Boolean, default: false },
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

const Article =
  mongoose.models.Article || mongoose.model<IArticle>("Article", articleSchema);

export default Article;
