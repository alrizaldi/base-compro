import {
  mockAdminAccounts,
  AdminAccount,
} from "@/shared/mockData/adminAccounts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

let mockAdminAccountsData = [...mockAdminAccounts];
let mockIdCounter = mockAdminAccounts.length + 1;

export type { AdminAccount } from "@/shared/mockData/adminAccounts";

export interface AdminAccountFormData {
  name: string;
  email: string;
  password?: string;
  role: "super_admin" | "admin" | "editor";
  status: "active" | "suspended";
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

export interface FetchAdminAccountsParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
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

export async function fetchAdminAccounts(
  params?: FetchAdminAccountsParams,
): Promise<PaginatedResponse<AdminAccount>> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));

    let filtered = [...mockAdminAccountsData];
    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(s) || a.email.toLowerCase().includes(s),
      );
    }
    if (params?.role) {
      filtered = filtered.filter((a) => a.role === params.role);
    }
    if (params?.status) {
      filtered = filtered.filter((a) => a.status === params.status);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    return paginateData(filtered, page, limit);
  }

  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.search) query.set("search", params.search);
  if (params?.role) query.set("role", params.role);
  if (params?.status) query.set("status", params.status);

  const res = await fetch(`${API_URL}/admin-accounts?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch admin accounts");
  return res.json();
}

export async function createAdminAccount(
  data: AdminAccountFormData,
): Promise<AdminAccount> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const now = new Date().toISOString();
    const newAccount: AdminAccount = {
      id: String(mockIdCounter++),
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };
    mockAdminAccountsData.unshift(newAccount);
    return newAccount;
  }

  const res = await fetch(`${API_URL}/admin-accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create admin account");
  }
  return res.json();
}

export async function updateAdminAccount(
  id: string,
  data: AdminAccountFormData,
): Promise<AdminAccount> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const index = mockAdminAccountsData.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("Account not found");
    mockAdminAccountsData[index] = {
      ...mockAdminAccountsData[index],
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      updatedAt: new Date().toISOString(),
    };
    return mockAdminAccountsData[index];
  }

  const res = await fetch(`${API_URL}/admin-accounts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update admin account");
  }
  return res.json();
}

export async function deleteAdminAccount(id: string): Promise<void> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    mockAdminAccountsData = mockAdminAccountsData.filter((a) => a.id !== id);
    return;
  }

  const res = await fetch(`${API_URL}/admin-accounts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete admin account");
  }
}
