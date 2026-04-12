import { mockStores, Store } from "@/shared/mockData/stores";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

let mockStoresData = [...mockStores];
let mockIdCounter = mockStores.length + 1;

export type { Store } from "@/shared/mockData/stores";

export interface StoreFormData {
  name: string;
  address: string;
  city: string;
  phone: string;
  image?: string;
  latitude?: number;
  longitude?: number;
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

export interface FetchStoresParams {
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

export async function fetchStores(
  params?: FetchStoresParams,
): Promise<PaginatedResponse<Store>> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    let filtered = [...mockStoresData];
    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(
        (st) =>
          st.name.toLowerCase().includes(s) ||
          st.city.toLowerCase().includes(s) ||
          st.address.toLowerCase().includes(s),
      );
    }
    return paginateData(filtered, params?.page || 1, params?.limit || 10);
  }

  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.search) query.set("search", params.search);

  const res = await fetch(`${API_URL}/stores?${query.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch stores");
  return res.json();
}

export async function createStore(data: StoreFormData): Promise<Store> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const now = new Date().toISOString();
    const item: Store = {
      id: String(mockIdCounter++),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    mockStoresData.unshift(item);
    return item;
  }

  const res = await fetch(`${API_URL}/stores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create store");
  return res.json();
}

export async function updateStore(
  id: string,
  data: StoreFormData,
): Promise<Store> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const index = mockStoresData.findIndex((st) => st.id === id);
    if (index === -1) throw new Error("Store not found");
    mockStoresData[index] = {
      ...mockStoresData[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockStoresData[index];
  }

  const res = await fetch(`${API_URL}/stores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update store");
  return res.json();
}

export async function deleteStore(id: string): Promise<void> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    mockStoresData = mockStoresData.filter((st) => st.id !== id);
    return;
  }

  const res = await fetch(`${API_URL}/stores/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete store");
}
