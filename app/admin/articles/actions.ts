import { mockArticles, Article } from "@/shared/mockData/articles";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

let mockArticlesData = [...mockArticles];
let mockIdCounter = mockArticles.length + 1;

export type { Article } from "@/shared/mockData/articles";

export interface ArticleFormData {
  title: string;
  content: string;
  author: string;
  image?: string;
  published: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FetchArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
}

function paginateData<T>(
  data: T[],
  page: number,
  limit: number,
): PaginatedResponse<T> {
  const total = data.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  return {
    data: data.slice(start, start + limit),
    pagination: { page, limit, total, totalPages },
  };
}

export async function fetchArticles(
  params?: FetchArticlesParams,
): Promise<PaginatedResponse<Article>> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    let filtered = [...mockArticlesData];
    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(s) ||
          a.author.toLowerCase().includes(s) ||
          a.content.toLowerCase().includes(s),
      );
    }
    return paginateData(filtered, params?.page || 1, params?.limit || 10);
  }

  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.search) query.set("search", params.search);

  const res = await fetch(`${API_URL}/articles?${query.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
}

export async function createArticle(data: ArticleFormData): Promise<Article> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const now = new Date().toISOString();
    const newArticle: Article = {
      id: String(mockIdCounter++),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    mockArticlesData.unshift(newArticle);
    return newArticle;
  }

  const res = await fetch(`${API_URL}/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create article");
  return res.json();
}

export async function updateArticle(
  id: string,
  data: ArticleFormData,
): Promise<Article> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const index = mockArticlesData.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("Article not found");
    mockArticlesData[index] = {
      ...mockArticlesData[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockArticlesData[index];
  }

  const res = await fetch(`${API_URL}/articles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update article");
  return res.json();
}

export async function deleteArticle(id: string): Promise<void> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    mockArticlesData = mockArticlesData.filter((a) => a.id !== id);
    return;
  }

  const res = await fetch(`${API_URL}/articles/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete article");
}
