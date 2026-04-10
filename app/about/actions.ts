import { mockAboutContent, AboutContent } from "@/shared/mockData/aboutContent";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

let mockAboutData = { ...mockAboutContent };

export type { AboutContent, TeamMember, CompanyValue } from "@/shared/mockData/aboutContent";

// Customer: Fetch about content
export async function fetchAboutContent(): Promise<AboutContent | null> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return mockAboutData;
  }

  const res = await fetch(`${API_URL}/about`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

// Admin: Update about content
export async function updateAboutContent(data: Partial<AboutContent>): Promise<AboutContent> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    mockAboutData = { ...mockAboutData, ...data };
    return mockAboutData;
  }

  const res = await fetch(`${API_URL}/about`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update about content");
  return res.json();
}
