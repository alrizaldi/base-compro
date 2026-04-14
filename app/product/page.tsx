"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/app/PageLayout";
import { fetchProducts, Product, FetchProductsParams } from "./actions";
import Link from "next/link";
import { usePageTitle } from "@/lib/usePageTitle";

const ITEMS_PER_PAGE = 8;

export default function ProductPage() {
  usePageTitle("Products");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    loadProducts();
  }, [currentPage, search]);

  async function loadProducts() {
    try {
      setLoading(true);
      const params: FetchProductsParams = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };
      if (search) params.search = search;

      const response = await fetchProducts(params);
      setProducts(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.total);
      setError(null);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
    if (e.target.value === "") {
      setSearch("");
      setCurrentPage(1);
    }
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  }

  return (
    <PageLayout>
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#8AAAE5] to-[#6a8fcf] text-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Our Products
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Discover our curated collection of premium tech essentials
              designed to elevate your workspace.
            </p>
          </div>
        </div>

        {/* Search & Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search Bar */}
          <div className="mb-10">
            <form
              onSubmit={handleSearch}
              className="flex gap-3 max-w-xl mx-auto"
            >
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8AAAE5] text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#8AAAE5] text-white rounded-lg hover:bg-[#6a8fcf] text-sm font-medium transition-colors"
              >
                Search
              </button>
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSearchInput("");
                    setCurrentPage(1);
                  }}
                  className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Clear
                </button>
              )}
            </form>
            {search && (
              <p className="mt-3 text-center text-sm text-gray-600">
                Showing results for &ldquo;
                <span className="font-medium">{search}</span>&rdquo;
              </p>
            )}
          </div>

          {error && (
            <div className="mb-8 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-blue-100 rounded-xl aspect-square mb-4" />
                  <div className="h-4 bg-blue-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-blue-100 rounded w-full mb-2" />
                  <div className="h-5 bg-blue-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-[#8AAAE5]">
                No products found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? `No results for "${search}". Try a different search term.`
                  : "Check back soon for new products."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl border border-blue-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Image */}
                    <Link
                      href={`/product/${product.id}`}
                      className="aspect-square bg-blue-50 overflow-hidden block relative"
                    >
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-gray-300"
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
                    </Link>

                    {/* Content */}
                    <div className="p-4">
                      <Link
                        href={`/product/${product.id}`}
                        className="font-semibold text-[#8AAAE5] line-clamp-1 group-hover:text-gray-700 transition-colors block"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-[#8AAAE5]">
                          {formatCurrency(product.price)}
                        </span>
                        <Link
                          href={`/product/${product.id}`}
                          className="px-3 py-1.5 text-xs font-medium text-[#8AAAE5] border border-[#8AAAE5] rounded-lg hover:bg-[#8AAAE5] hover:text-white transition-colors inline-block"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                    </span>{" "}
                    of <span className="font-medium">{totalItems}</span>{" "}
                    products
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                            page === currentPage
                              ? "bg-[#8AAAE5] text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
