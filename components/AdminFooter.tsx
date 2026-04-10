"use client";

import Link from "next/link";

export default function AdminFooter() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} YourBrand Admin Panel. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              View Site
            </Link>
            <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
