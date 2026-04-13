import mongoose from "mongoose";

export interface ITeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  order: number;
}

export interface ICompanyValue {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface IAboutContent extends mongoose.Document {
  logoUrl: string;
  logoText: string;
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyContent: string;
  storyImage: string;
  stats: { label: string; value: string }[];
  teamMembers: ITeamMember[];
  companyValues: ICompanyValue[];
  createdAt: Date;
  updatedAt: Date;
}

const aboutContentSchema = new mongoose.Schema<IAboutContent>(
  {
    logoUrl: { type: String, default: "" },
    logoText: { type: String, default: "YourBrand" },
    heroTitle: { type: String, required: true },
    heroSubtitle: { type: String, required: true },
    storyTitle: { type: String, required: true },
    storyContent: { type: String, required: true },
    storyImage: { type: String, default: "" },
    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    teamMembers: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: String, required: true },
        bio: { type: String, required: true },
        avatar: { type: String, default: "" },
        order: { type: Number, default: 0 },
      },
    ],
    companyValues: [
      {
        id: { type: String, required: true },
        icon: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        order: { type: Number, default: 0 },
      },
    ],
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

const AboutContent =
  mongoose.models.AboutContent ||
  mongoose.model<IAboutContent>("AboutContent", aboutContentSchema);

export default AboutContent;
