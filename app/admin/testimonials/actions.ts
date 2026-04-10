import { mockTestimonials, Testimonial } from "@/shared/mockData/testimonials";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

let mockTestimonialsData = [...mockTestimonials];
let mockIdCounter = mockTestimonials.length + 1;

export type { Testimonial } from "@/shared/mockData/testimonials";

export interface TestimonialFormData {
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: string;
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

export interface FetchTestimonialsParams {
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

export async function fetchTestimonials(
  params?: FetchTestimonialsParams,
): Promise<PaginatedResponse<Testimonial>> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    let filtered = [...mockTestimonialsData];
    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(s) ||
          t.role.toLowerCase().includes(s) ||
          t.content.toLowerCase().includes(s),
      );
    }
    return paginateData(filtered, params?.page || 1, params?.limit || 10);
  }

  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.search) query.set("search", params.search);

  const res = await fetch(`${API_URL}/testimonials?${query.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch testimonials");
  return res.json();
}

export async function createTestimonial(
  data: TestimonialFormData,
): Promise<Testimonial> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const now = new Date().toISOString();
    const item: Testimonial = {
      id: String(mockIdCounter++),
      name: data.name,
      role: data.role,
      content: data.content,
      avatar: data.avatar,
      rating: parseInt(data.rating),
      createdAt: now,
      updatedAt: now,
    };
    mockTestimonialsData.unshift(item);
    return item;
  }

  const res = await fetch(`${API_URL}/testimonials`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create testimonial");
  return res.json();
}

export async function updateTestimonial(
  id: string,
  data: TestimonialFormData,
): Promise<Testimonial> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const index = mockTestimonialsData.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Testimonial not found");
    mockTestimonialsData[index] = {
      ...mockTestimonialsData[index],
      name: data.name,
      role: data.role,
      content: data.content,
      avatar: data.avatar,
      rating: parseInt(data.rating),
      updatedAt: new Date().toISOString(),
    };
    return mockTestimonialsData[index];
  }

  const res = await fetch(`${API_URL}/testimonials/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update testimonial");
  return res.json();
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    mockTestimonialsData = mockTestimonialsData.filter((t) => t.id !== id);
    return;
  }

  const res = await fetch(`${API_URL}/testimonials/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete testimonial");
}
