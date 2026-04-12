"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DashboardStats {
  products: number;
  articles: number;
  testimonials: number;
  stores: number;
  contacts: number;
  newContacts: number;
}

interface RecentContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  createdAt: string;
}

interface RecentArticle {
  id: string;
  title: string;
  author: string;
  published: boolean;
  createdAt: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentContacts: RecentContact[];
  recentArticles: RecentArticle[];
}

const statCards = [
  {
    label: "Products",
    key: "products" as const,
    color: "bg-blue-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    ),
    href: "/admin/products",
  },
  {
    label: "Articles",
    key: "articles" as const,
    color: "bg-green-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
      />
    ),
    href: "/admin/articles",
  },
  {
    label: "Testimonials",
    key: "testimonials" as const,
    color: "bg-yellow-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
      />
    ),
    href: "/admin/testimonials",
  },
  {
    label: "Stores",
    key: "stores" as const,
    color: "bg-purple-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    ),
    href: "/admin/stores",
  },
  {
    label: "Contacts",
    key: "contacts" as const,
    color: "bg-red-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
    href: "/admin/contacts",
  },
  {
    label: "Admins",
    key: "admins" as const,
    color: "bg-gray-700",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    ),
    href: "/admin/accounts",
  },
];

const quickActions = [
  {
    label: "Add Product",
    href: "/admin/products",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    ),
  },
  {
    label: "Write Article",
    href: "/admin/articles",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    ),
  },
  {
    label: "View Contacts",
    href: "/admin/contacts",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
  },
  {
    label: "Manage Stores",
    href: "/admin/stores",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
    ),
  },
];

export default function AdminPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      unread: "bg-red-100 text-red-800",
      read: "bg-blue-100 text-blue-800",
      replied: "bg-green-100 text-green-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-lg p-6 border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
                  <div className="h-8 bg-gray-200 rounded w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="mt-8 px-4 py-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your site content and recent activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {card.icon}
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.key === "admins" ? "—" : (stats?.[card.key] ?? 0)}
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center gap-3 hover:shadow-md hover:border-gray-300 transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {action.icon}
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Contacts
            </h2>
            {stats && stats.newContacts > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                {stats.newContacts} new
              </span>
            )}
          </div>
          <div className="divide-y divide-gray-200">
            {data?.recentContacts.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500 text-sm">
                No contact submissions yet.
              </div>
            ) : (
              data?.recentContacts.map((contact) => (
                <Link
                  key={contact.id}
                  href="/admin/contacts"
                  className="px-6 py-4 hover:bg-gray-50 transition-colors block"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {contact.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {contact.subject}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {contact.email}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusBadge(contact.status)}`}
                      >
                        {contact.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(contact.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="px-6 py-3 border-t border-gray-200">
            <Link
              href="/admin/contacts"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              View all contacts &rarr;
            </Link>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Articles
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {data?.recentArticles.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500 text-sm">
                No articles yet.
              </div>
            ) : (
              data?.recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href="/admin/articles"
                  className="px-6 py-4 hover:bg-gray-50 transition-colors block"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        by {article.author}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          article.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {article.published ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(article.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="px-6 py-3 border-t border-gray-200">
            <Link
              href="/admin/articles"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              View all articles &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
