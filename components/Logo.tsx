import { fetchAboutContent } from "@/app/about/actions";

export default async function Logo({ className = "" }: { className?: string }) {
  let logoUrl = "";
  let logoText = "YourBrand";

  try {
    const about = await fetchAboutContent();
    if (about) {
      logoUrl = about.logoUrl || "";
      logoText = about.logoText || "YourBrand";
    }
  } catch {
    // Fallback to default
  }

  if (logoUrl) {
    return (
      <img src={logoUrl} alt={logoText} className={`h-8 w-auto ${className}`} />
    );
  }

  return (
    <span className={`text-xl font-bold text-gray-900 ${className}`}>
      {logoText}
    </span>
  );
}
