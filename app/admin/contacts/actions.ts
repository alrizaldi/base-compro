import {
  mockContactSubmissions,
  ContactSubmission,
} from "@/shared/mockData/contacts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

let mockContactsData = [...mockContactSubmissions];

export type { ContactSubmission } from "@/shared/mockData/contacts";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
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

export interface FetchContactsParams {
  page?: number;
  limit?: number;
  search?: string;
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
  return {
    data: data.slice(start, start + limit),
    pagination: { page, limit, total, totalPages },
  };
}

export async function fetchContacts(
  params?: FetchContactsParams,
): Promise<PaginatedResponse<ContactSubmission>> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    let filtered = [...mockContactsData];
    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.email.toLowerCase().includes(s) ||
          c.subject.toLowerCase().includes(s),
      );
    }
    if (params?.status) {
      filtered = filtered.filter((c) => c.status === params.status);
    }
    return paginateData(filtered, params?.page || 1, params?.limit || 10);
  }

  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.search) query.set("search", params.search);
  if (params?.status) query.set("status", params.status);

  const res = await fetch(`${API_URL}/contacts?${query.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch contacts");
  return res.json();
}

export async function updateContactStatus(
  id: string,
  status: "unread" | "read" | "replied",
): Promise<ContactSubmission> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const index = mockContactsData.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Contact not found");
    mockContactsData[index] = {
      ...mockContactsData[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    return mockContactsData[index];
  }

  const res = await fetch(`${API_URL}/contacts/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update contact status");
  return res.json();
}

export async function deleteContact(id: string): Promise<void> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    mockContactsData = mockContactsData.filter((c) => c.id !== id);
    return;
  }

  const res = await fetch(`${API_URL}/contacts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete contact");
}
