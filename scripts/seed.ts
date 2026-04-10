/**
 * Seed script to populate MongoDB with initial data.
 * Run with: npm run seed
 */

import "dotenv/config";
import path from "path";
import { config as loadEnv } from "dotenv";

// Load .env.local manually since tsx doesn't auto-load it
const envPath = path.resolve(process.cwd(), ".env.local");
loadEnv({ path: envPath });

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/base-compro";

// Import mock data
import { mockProducts } from "@/shared/mockData/products";
import { mockArticles } from "@/shared/mockData/articles";
import { mockTestimonials } from "@/shared/mockData/testimonials";
import { mockStores } from "@/shared/mockData/stores";
import { mockContactSubmissions } from "@/shared/mockData/contacts";
import { mockAboutContent } from "@/shared/mockData/aboutContent";

// Define schemas inline for seeding
const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    images: [String],
    ecommerceLinks: [
      {
        platform: String,
        url: String,
      },
    ],
  },
  { timestamps: true },
);

const articleSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    author: String,
    image: String,
    published: Boolean,
  },
  { timestamps: true },
);

const testimonialSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    content: String,
    avatar: String,
    rating: Number,
  },
  { timestamps: true },
);

const storeSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    city: String,
    phone: String,
    image: String,
  },
  { timestamps: true },
);

const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    subject: String,
    message: String,
    status: String,
  },
  { timestamps: true },
);

const aboutSchema = new mongoose.Schema(
  {
    logoUrl: String,
    logoText: String,
    heroTitle: String,
    heroSubtitle: String,
    storyTitle: String,
    storyContent: String,
    storyImage: String,
    stats: [{ label: String, value: String }],
    teamMembers: [
      {
        id: String,
        name: String,
        role: String,
        bio: String,
        avatar: String,
        order: Number,
      },
    ],
    companyValues: [
      {
        id: String,
        icon: String,
        title: String,
        description: String,
        order: Number,
      },
    ],
  },
  { timestamps: true },
);

const adminAccountSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    status: String,
    lastActiveAt: Date,
  },
  { timestamps: true },
);

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully");

  try {
    // Clear existing collections
    console.log("\nClearing existing data...");
    await mongoose.connection.db!.dropDatabase();
    console.log("Database cleared");

    // Create models
    const Product = mongoose.model("Product", productSchema);
    const Article = mongoose.model("Article", articleSchema);
    const Testimonial = mongoose.model("Testimonial", testimonialSchema);
    const Store = mongoose.model("Store", storeSchema);
    const Contact = mongoose.model("ContactSubmission", contactSchema);
    const About = mongoose.model("AboutContent", aboutSchema);
    const AdminAccount = mongoose.model("AdminAccount", adminAccountSchema);

    // Seed Products
    console.log("\nSeeding products...");
    await Product.insertMany(mockProducts);
    console.log(`✓ Inserted ${mockProducts.length} products`);

    // Seed Articles
    console.log("\nSeeding articles...");
    await Article.insertMany(mockArticles);
    console.log(`✓ Inserted ${mockArticles.length} articles`);

    // Seed Testimonials
    console.log("\nSeeding testimonials...");
    await Testimonial.insertMany(mockTestimonials);
    console.log(`✓ Inserted ${mockTestimonials.length} testimonials`);

    // Seed Stores
    console.log("\nSeeding stores...");
    await Store.insertMany(mockStores);
    console.log(`✓ Inserted ${mockStores.length} stores`);

    // Seed Contacts
    console.log("\nSeeding contacts...");
    await Contact.insertMany(mockContactSubmissions);
    console.log(`✓ Inserted ${mockContactSubmissions.length} contacts`);

    // Seed About content
    console.log("\nSeeding about content...");
    await About.create(mockAboutContent);
    console.log("✓ Inserted about content");

    // Seed Admin Account
    console.log("\nSeeding admin account...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await AdminAccount.create({
      name: "Super Admin",
      email: "admin@yourbrand.com",
      password: hashedPassword,
      role: "super_admin",
      status: "active",
      lastActiveAt: new Date(),
    });
    console.log("✓ Inserted super admin account");
    console.log("  Email: admin@yourbrand.com");
    console.log("  Password: admin123");

    console.log("\n✅ Seed completed successfully!");
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
    process.exit(0);
  }
}

seed();
