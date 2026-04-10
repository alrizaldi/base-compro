import mongoose from "mongoose";

export interface IContactSubmission extends mongoose.Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: Date;
  updatedAt: Date;
}

const contactSubmissionSchema = new mongoose.Schema<IContactSubmission>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
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

const ContactSubmission =
  mongoose.models.ContactSubmission ||
  mongoose.model<IContactSubmission>(
    "ContactSubmission",
    contactSubmissionSchema,
  );

export default ContactSubmission;
