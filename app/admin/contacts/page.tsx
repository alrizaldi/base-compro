"use client";

import { useState, useEffect } from "react";
import {
  ContactSubmission,
  fetchContacts,
  updateContactStatus,
  deleteContact,
  FetchContactsParams,
} from "./actions";

const ITEMS_PER_PAGE = 10;

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingContact, setViewingContact] =
    useState<ContactSubmission | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingContact, setDeletingContact] =
    useState<ContactSubmission | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadContacts();
  }, [currentPage, search, statusFilter]);

  async function loadContacts() {
    try {
      setLoading(true);
      const params: FetchContactsParams = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const response = await fetchContacts(params);
      setContacts(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.total);
      setError(null);
    } catch (err) {
      setError("Failed to load contacts. Make sure the backend is running.");
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

  function openViewModal(contact: ContactSubmission) {
    setViewingContact(contact);
    setIsViewModalOpen(true);
    if (contact.status === "unread") updateContactStatusToRead(contact.id);
  }

  async function updateContactStatusToRead(id: string) {
    try {
      setUpdatingStatus(true);
      await updateContactStatus(id, "read");
      await loadContacts();
    } catch (err) {
      /* silently fail */
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleStatusChange(
    id: string,
    status: "unread" | "read" | "replied",
  ) {
    try {
      setUpdatingStatus(true);
      await updateContactStatus(id, status);
      await loadContacts();
    } catch (err) {
      setError("Failed to update contact status");
    } finally {
      setUpdatingStatus(false);
    }
  }

  function openDeleteConfirm(contact: ContactSubmission) {
    setDeletingContact(contact);
    setIsDeleteConfirmOpen(true);
  }

  async function handleDelete() {
    if (!deletingContact) return;
    try {
      await deleteContact(deletingContact.id);
      setIsDeleteConfirmOpen(false);
      setDeletingContact(null);
      await loadContacts();
    } catch (err) {
      setError("Failed to delete contact");
    }
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      unread: "bg-red-100 text-red-800",
      read: "bg-blue-100 text-blue-800",
      replied: "bg-green-100 text-green-800",
    };
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || ""}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Contacts</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage contact form submissions and inquiries.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search contacts by name, email, or subject..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 text-sm font-medium"
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
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
            >
              Clear
            </button>
          )}
        </form>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
        >
          <option value="">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading contacts...
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No contact submissions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className={`hover:bg-gray-50 ${contact.status === "unread" ? "bg-red-50" : ""}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {contact.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {contact.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {contact.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(contact.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openViewModal(contact)}
                        className="text-gray-600 hover:text-gray-900 mr-4"
                      >
                        View
                      </button>
                      <select
                        value={contact.status}
                        onChange={(e) =>
                          handleStatusChange(
                            contact.id,
                            e.target.value as "unread" | "read" | "replied",
                          )
                        }
                        disabled={updatingStatus}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 mr-2 disabled:opacity-50"
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                      </select>
                      <button
                        onClick={() => openDeleteConfirm(contact)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && contacts.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${page === currentPage ? "bg-gray-900 text-white" : "bg-white border border-gray-300 hover:bg-gray-50"}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isViewModalOpen && viewingContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsViewModalOpen(false)}
            />
            <div className="relative bg-white rounded-md shadow-lg w-full max-w-2xl">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Contact Details
                </h2>
                {getStatusBadge(viewingContact.status)}
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Name
                  </label>
                  <p className="text-sm text-gray-900">{viewingContact.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">
                    {viewingContact.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Subject
                  </label>
                  <p className="text-sm text-gray-900">
                    {viewingContact.subject}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Message
                  </label>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {viewingContact.message}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Submitted
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(viewingContact.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && deletingContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsDeleteConfirmOpen(false)}
            />
            <div className="relative bg-white rounded-md shadow-lg w-full max-w-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Delete Contact
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete the message from{" "}
                <strong>{deletingContact.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
