"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/app/PageLayout";
import { fetchArticles, Article, FetchArticlesParams } from "./actions";
import Link from "next/link";
import { usePageTitle } from "@/lib/usePageTitle";

const ITEMS_PER_PAGE = 8;

export default function ArticlePage() {
  usePageTitle("Articles");

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    loadArticles();
  }, [currentPage, search]);

  async function loadArticles() {
    try {
      setLoading(true);
      const params: FetchArticlesParams = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };
      if (search) params.search = search;

      const response = await fetchArticles(params);
      setArticles(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.total);
      setError(null);
    } catch (err) {
      setError("Failed to load articles.");
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

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function truncate(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trimEnd() + "...";
  }

  function stripHtml(html: string): string {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  return (
    <PageLayout>
      <div className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#8AAAE5] to-[#6a8fcf] text-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Articles & News
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Stay up to date with the latest insights, tutorials, and industry
              trends.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search */}
          <div className="mb-10">
            <form
              onSubmit={handleSearch}
              className="flex gap-3 max-w-xl mx-auto"
            >
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search articles..."
                className="flex-1 px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8AAAE5] text-sm"
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

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-blue-100 rounded-xl aspect-video mb-4" />
                  <div className="h-4 bg-blue-100 rounded w-1/4 mb-2" />
                  <div className="h-6 bg-blue-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-blue-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-[#8AAAE5]">
                No articles found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? `No results for "${search}". Try a different search term.`
                  : "Check back soon for new content."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.id}`}
                    className="group flex flex-col bg-white rounded-xl border border-blue-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Image */}
                    <div className="aspect-video bg-blue-50 overflow-hidden">
                      {article.image ? (
                        <img
                          src={article.image}
                          alt={article.title}
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
                              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span>{formatDate(article.createdAt)}</span>
                        <span>&middot;</span>
                        <span>{article.author}</span>
                      </div>
                      <h2 className="text-xl font-semibold text-[#8AAAE5] group-hover:text-gray-700 transition-colors line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                        {truncate(stripHtml(article.content), 150)}
                      </p>
                      <div className="mt-4">
                        <span className="text-sm font-medium text-[#8AAAE5] group-hover:text-gray-700">
                          Read more &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
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
                    articles
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium bg-white border border-blue-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                              : "bg-white border border-blue-200 text-gray-700 hover:bg-gray-50"
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
                      className="px-4 py-2 text-sm font-medium bg-white border border-blue-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
