import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth/middleware";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

// Mock data imports
import { mockProducts } from "@/shared/mockData/products";
import { mockArticles } from "@/shared/mockData/articles";
import { mockTestimonials } from "@/shared/mockData/testimonials";
import { mockStores } from "@/shared/mockData/stores";
import { mockContactSubmissions } from "@/shared/mockData/contacts";

export async function GET(request: NextRequest) {
  try {
    const user = await checkAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    let productsCount = mockProducts.length;
    let articlesCount = mockArticles.length;
    let testimonialsCount = mockTestimonials.length;
    let storesCount = mockStores.length;
    let contactsCount = mockContactSubmissions.length;
    let newContacts = mockContactSubmissions.filter(
      (c) => c.status === "unread",
    ).length;
    let recentContacts = mockContactSubmissions
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
    let recentArticles = mockArticles
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);

    if (!USE_MOCK) {
      // Fetch real counts from API
      const [
        productsRes,
        articlesRes,
        testimonialsRes,
        storesRes,
        contactsRes,
      ] = await Promise.all([
        fetch(`${API_URL}/products?page=1&limit=1`),
        fetch(`${API_URL}/articles?page=1&limit=1`),
        fetch(`${API_URL}/testimonials?page=1&limit=1`),
        fetch(`${API_URL}/stores?page=1&limit=1`),
        fetch(`${API_URL}/contacts?page=1&limit=1`),
      ]);

      const productsData = await productsRes.json();
      const articlesData = await articlesRes.json();
      const testimonialsData = await testimonialsRes.json();
      const storesData = await storesRes.json();
      const contactsData = await contactsRes.json();

      productsCount = productsData.pagination?.total || 0;
      articlesCount = articlesData.pagination?.total || 0;
      testimonialsCount = testimonialsData.pagination?.total || 0;
      storesCount = storesData.pagination?.total || 0;
      contactsCount = contactsData.pagination?.total || 0;

      // Fetch recent contacts and articles
      const [recentContactsRes, recentArticlesRes] = await Promise.all([
        fetch(`${API_URL}/contacts?page=1&limit=5`),
        fetch(`${API_URL}/articles?page=1&limit=5`),
      ]);

      const recentContactsData = await recentContactsRes.json();
      const recentArticlesData = await recentArticlesRes.json();

      recentContacts = recentContactsData.data || [];
      recentArticles = recentArticlesData.data || [];

      // Count new contacts
      newContacts = recentContacts.filter(
        (c: any) => c.status === "unread",
      ).length;
    }

    return NextResponse.json({
      stats: {
        products: productsCount,
        articles: articlesCount,
        testimonials: testimonialsCount,
        stores: storesCount,
        contacts: contactsCount,
        newContacts,
      },
      recentContacts,
      recentArticles,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
