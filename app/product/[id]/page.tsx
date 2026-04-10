"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PageLayout from "@/app/PageLayout";
import { fetchProducts, Product } from "../actions";
import { usePageTitle } from "@/lib/usePageTitle";

// E-commerce platform logo mappings
const PLATFORM_LOGOS: Record<string, string> = {
  Tokopedia: "https://images.seeklogo.com/logo-p/37/TOKOPEDIA-logo-png.png",
  Shopee: "https://images.seeklogo.com/logo-p/52/SHOPEE-logo-png.png",
  Lazada: "https://images.seeklogo.com/logo-p/40/LAZADA-logo-png.png",
  Bukalapak: "https://images.seeklogo.com/logo-p/9/BUKALAPAK-logo-png.png",
  Blibli: "https://images.seeklogo.com/logo-p/6/BLIBLI-logo-png.png",
  Amazon: "https://images.seeklogo.com/logo-p/48/AMAZON-logo-png.png",
  eBay: "https://images.seeklogo.com/logo-p/17/EBAY-logo-png.png",
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  usePageTitle(product?.name || "Product");

  useEffect(() => {
    loadProduct();
  }, [productId]);

  async function loadProduct() {
    try {
      setLoading(true);
      const response = await fetchProducts({ page: 1, limit: 100 });
      const found = response.data.find((p) => p.id === productId);
      if (found) {
        setProduct(found);
      } else {
        setError("Product not found.");
      }
    } catch (err) {
      setError("Failed to load product.");
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  }

  function getPlatformLogo(platform: string): string | null {
    return PLATFORM_LOGOS[platform] || null;
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-2xl" />
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-8" />
              <div className="h-12 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !product) {
    return (
      <PageLayout>
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Product Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push("/product")}
            className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
          >
            Back to Products
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-gray-500">
            <button
              onClick={() => router.push("/")}
              className="hover:text-gray-900 transition-colors"
            >
              Home
            </button>
            <span className="mx-2">/</span>
            <button
              onClick={() => router.push("/product")}
              className="hover:text-gray-900 transition-colors"
            >
              Products
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>

        {/* Product Detail */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Images Gallery */}
            <div>
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={
                      product.images[selectedImageIndex] || product.images[0]
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-24 h-24 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-gray-900"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>

              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
              </div>

              <div className="mt-6 prose prose-gray">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Divider */}
              <div className="mt-8 border-t border-gray-200" />

              {/* E-commerce Links */}
              {product.ecommerceLinks && product.ecommerceLinks.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Buy on E-commerce
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {product.ecommerceLinks.map((link, index) => {
                      const logoUrl = getPlatformLogo(link.platform);
                      return (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-900 hover:shadow-md transition-all group"
                        >
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={link.platform}
                              className="h-8 mb-2 object-contain group-hover:scale-110 transition-transform"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                                (
                                  e.target as HTMLImageElement
                                ).nextElementSibling?.classList.remove(
                                  "hidden",
                                );
                              }}
                            />
                          ) : null}
                          <span
                            className={`text-sm font-semibold text-gray-900 ${logoUrl ? "" : "hidden"}`}
                          >
                            {link.platform}
                          </span>
                          {!logoUrl && (
                            <span className="text-sm font-semibold text-gray-900">
                              {link.platform}
                            </span>
                          )}
                          <span className="text-xs text-gray-500 mt-1">
                            Shop Now →
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {(!product.ecommerceLinks ||
                product.ecommerceLinks.length === 0) && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600">
                    E-commerce links coming soon
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="mt-8 border-t border-gray-200" />

              {/* Product Meta */}
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <span>Free shipping on orders over Rp 500.000</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>1-year warranty included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
