import { mockProducts, Product } from "@/shared/mockData/products";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

let mockIdCounter = mockProducts.length + 1;
let mockProductsData = [...mockProducts];

export type { Product } from "@/shared/mockData/products";

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image?: string;
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

export interface FetchProductsParams {
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
  const end = start + limit;
  return {
    data: data.slice(start, end),
    pagination: { page, limit, total, totalPages },
  };
}

export async function fetchProducts(
  params?: FetchProductsParams,
): Promise<PaginatedResponse<Product>> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));

    let filtered = [...mockProductsData];
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search),
      );
    }

    const page = params?.page || 1;
    const limit = params?.limit || 8;
    return paginateData(filtered, page, limit);
  }

  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.search) query.set("search", params.search);

  const res = await fetch(`${API_URL}/products?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function createProduct(data: ProductFormData): Promise<Product> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const now = new Date().toISOString();
    const newProduct: Product = {
      id: String(mockIdCounter++),
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: data.image,
      createdAt: now,
      updatedAt: now,
    };
    mockProductsData.unshift(newProduct);
    return newProduct;
  }

  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(
  id: string,
  data: ProductFormData,
): Promise<Product> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const index = mockProductsData.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");
    mockProductsData[index] = {
      ...mockProductsData[index],
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: data.image,
      updatedAt: new Date().toISOString(),
    };
    return mockProductsData[index];
  }

  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    mockProductsData = mockProductsData.filter((p) => p.id !== id);
    return;
  }

  const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
}
