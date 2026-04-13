"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AdminFooter from "@/components/AdminFooter";
import { AuthProvider, useAuth } from "./AuthProvider";

const adminLinks = [
  { name: "Dashboard", href: "/admin" },
  { name: "Manage Products", href: "/admin/products" },
  { name: "Manage Articles", href: "/admin/articles" },
  { name: "Manage Testimonials", href: "/admin/testimonials" },
  { name: "Manage Stores", href: "/admin/stores" },
  { name: "Manage Contacts", href: "/admin/contacts" },
  { name: "Manage About", href: "/admin/about" },
  { name: "Account Management", href: "/admin/accounts" },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = async () => {
    await logout();
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (pathname === "/admin/login") return;
    if (pathname === "/admin/forgot-password") return;
    if (pathname === "/admin/reset-password") return;
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, pathname, router]);

  // Allow login, forgot-password, and reset-password pages to render without auth
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (pathname === "/admin/forgot-password") {
    return <>{children}</>;
  }

  if (pathname === "/admin/reset-password") {
    return <>{children}</>;
  }

  if (loading || !user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <Link href="/admin" className="text-xl font-bold text-gray-900">
            Admin Panel
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {adminLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Sidebar - Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-10">
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                Admin Panel
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                {adminLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar */}
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-gray-200">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex-1" />

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                {user.name.charAt(0)}
              </div>
              <span className="hidden sm:inline text-sm font-medium">
                {user.name}
              </span>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-20">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">
                      {user.role.replace("_", " ")}
                    </p>
                  </div>
                  <Link
                    href="/"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                    }}
                  >
                    View Site
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
