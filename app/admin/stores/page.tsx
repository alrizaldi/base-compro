"use client";

import { useState, useEffect } from "react";
import {
  Store,
  StoreFormData,
  fetchStores,
  createStore,
  updateStore,
  deleteStore,
  FetchStoresParams,
} from "./actions";

const ITEMS_PER_PAGE = 10;

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingStore, setDeletingStore] = useState<Store | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<StoreFormData>({
    name: "",
    address: "",
    city: "",
    phone: "",
    image: "",
    latitude: undefined,
    longitude: undefined,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    loadStores();
  }, [currentPage, search]);

  async function loadStores() {
    try {
      setLoading(true);
      const params: FetchStoresParams = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };
      if (search) params.search = search;

      const response = await fetchStores(params);
      setStores(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.total);
      setError(null);
    } catch (err) {
      setError("Failed to load stores. Make sure the backend is running.");
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

  function openCreateModal() {
    setEditingStore(null);
    setFormData({
      name: "",
      address: "",
      city: "",
      phone: "",
      image: "",
      latitude: undefined,
      longitude: undefined,
    });
    setImagePreview("");
    setIsModalOpen(true);
  }

  function openEditModal(store: Store) {
    setEditingStore(store);
    setFormData({
      name: store.name,
      address: store.address,
      city: store.city,
      phone: store.phone,
      image: store.image || "",
      latitude: store.latitude,
      longitude: store.longitude,
    });
    setImagePreview(store.image || "");
    setIsModalOpen(true);
  }

  function openDeleteConfirm(store: Store) {
    setDeletingStore(store);
    setIsDeleteConfirmOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingStore) {
        await updateStore(editingStore.id, formData);
      } else {
        await createStore(formData);
      }

      setIsModalOpen(false);
      await loadStores();
    } catch (err) {
      setError(
        editingStore ? "Failed to update store" : "Failed to create store",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingStore) return;

    try {
      await deleteStore(deletingStore.id);
      setIsDeleteConfirmOpen(false);
      setDeletingStore(null);
      await loadStores();
    } catch (err) {
      setError("Failed to delete store");
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Only PNG, JPG, SVG, and WebP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setUploadingImage(true);
      setError(null);

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setFormData({ ...formData, image: data.url });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleGeocodeAddress() {
    if (!formData.address || !formData.city) {
      setError("Please fill in both address and city first");
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);

      const fullAddress = `${formData.address}, ${formData.city}, Indonesia`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`,
      );

      const data = await response.json();

      if (data && data.length > 0) {
        setFormData({
          ...formData,
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        });
      } else {
        setError("Could not find location. Please enter coordinates manually.");
      }
    } catch (err) {
      setError("Failed to geocode address. Please enter coordinates manually.");
    } finally {
      setUploadingImage(false);
    }
  }

  function extractCoordinatesFromEmbed(embedCode: string) {
    const patterns = [
      /!2d(-?\d+\.?\d*).*?!3d(-?\d+\.?\d*)/,
      /!3d(-?\d+\.?\d*).*?!2d(-?\d+\.?\d*)/,
      /q=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
    ];

    for (const pattern of patterns) {
      const match = embedCode.match(pattern);
      if (match) {
        if (pattern.source.includes("!2d.*?!3d")) {
          return { lat: parseFloat(match[2]), lng: parseFloat(match[1]) };
        }
        if (pattern.source.includes("!3d.*?!2d")) {
          return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
        }
        return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
      }
    }
    return null;
  }

  async function handleExtractFromEmbed(embedCode: string) {
    if (!embedCode.trim()) {
      setError("Please paste the Google Maps embed code");
      return;
    }

    try {
      setError(null);
      const coords = extractCoordinatesFromEmbed(embedCode);

      if (coords) {
        setFormData({
          ...formData,
          latitude: coords.lat,
          longitude: coords.lng,
        });
      } else {
        setError(
          "Could not extract coordinates. Make sure you pasted the full Google Maps embed code.",
        );
      }
    } catch (err) {
      setError(
        "Failed to extract coordinates. Please check the embed code format.",
      );
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Stores</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your store locations and listings.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Store
        </button>
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

      <div className="mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search stores by name or city..."
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
      </div>

      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading stores...</div>
        ) : stores.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No stores found. Click &quot;Add Store&quot; to create one.
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
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {store.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {store.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{store.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{store.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(store)}
                        className="text-gray-600 hover:text-gray-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(store)}
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

      {!loading && stores.length > 0 && (
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="relative bg-white rounded-md shadow-lg w-full max-w-2xl">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingStore ? "Edit Store" : "Add Store"}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Store Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Image
                  </label>
                  <div className="space-y-3">
                    {imagePreview && (
                      <div className="relative w-full max-w-md">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-md border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setFormData({ ...formData, image: "" });
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 text-sm"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer">
                        <div className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors text-center">
                          {uploadingImage ? "Uploading..." : "Upload Image"}
                        </div>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-gray-500">or</span>
                    </div>
                    <input
                      type="text"
                      id="image"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value });
                        if (e.target.value) {
                          setImagePreview(e.target.value);
                        } else {
                          setImagePreview("");
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="https://example.com/store.jpg"
                    />
                    <p className="text-xs text-gray-500">
                      Upload an image or paste a URL. Max size: 5MB (PNG, JPG,
                      SVG, WebP)
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Map Location
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="embedCode"
                        className="block text-xs text-gray-600 mb-1"
                      >
                        Paste Google Maps Embed Code
                      </label>
                      <textarea
                        id="embedCode"
                        rows={3}
                        onChange={(e) => {
                          if (
                            e.target.value.includes("google.com/maps/embed")
                          ) {
                            handleExtractFromEmbed(e.target.value);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-xs font-mono"
                        placeholder='<iframe src="https://www.google.com/maps/embed?pb=..."></iframe>'
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Go to Google Maps → Share → Embed a map → Copy HTML →
                        Paste here
                      </p>
                    </div>
                    <div className="text-center text-xs text-gray-400">
                      — or enter manually —
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="latitude"
                          className="block text-xs text-gray-600 mb-1"
                        >
                          Latitude
                        </label>
                        <input
                          type="number"
                          id="latitude"
                          step="any"
                          value={formData.latitude || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              latitude: e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                          placeholder="-6.2088"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="longitude"
                          className="block text-xs text-gray-600 mb-1"
                        >
                          Longitude
                        </label>
                        <input
                          type="number"
                          id="longitude"
                          step="any"
                          value={formData.longitude || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              longitude: e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                          placeholder="106.8456"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleGeocodeAddress}
                      disabled={uploadingImage}
                      className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {uploadingImage
                        ? "Finding location..."
                        : "📍 Auto-fill from Address"}
                    </button>
                    {formData.latitude && formData.longitude && (
                      <div className="mt-2">
                        <iframe
                          src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          width="100%"
                          height="150"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          title="Location preview"
                          className="w-full rounded-md border border-gray-300"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50"
                  >
                    {submitting
                      ? "Saving..."
                      : editingStore
                        ? "Update Store"
                        : "Create Store"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && deletingStore && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsDeleteConfirmOpen(false)}
            />
            <div className="relative bg-white rounded-md shadow-lg w-full max-w-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Delete Store
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <strong>{deletingStore.name}</strong>? This action cannot be
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
