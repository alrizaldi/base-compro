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

const Article =
  mongoose.models.Article || mongoose.model<IArticle>("Article", articleSchema);

export default Article;
