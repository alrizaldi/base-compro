"use client";

import { useState, useEffect } from "react";
import {
  Product,
  ProductFormData,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  FetchProductsParams,
} from "./actions";

const ITEMS_PER_PAGE = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    images: [],
    ecommerceLinks: [],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Search state
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
      setError("Failed to load products. Make sure the backend is running.");
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
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      images: [],
      ecommerceLinks: [],
    });
    setImageFiles([]);
    setImagePreviews([]);
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      images: product.images || [],
      ecommerceLinks: product.ecommerceLinks || [],
    });
    setImageFiles([]);
    setImagePreviews(product.images || []);
    setIsModalOpen(true);
  }

  function openDeleteConfirm(product: Product) {
    setDeletingProduct(product);
    setIsDeleteConfirmOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      let uploadedImages = [...formData.images];

      // Upload new image files
      if (imageFiles.length > 0) {
        setUploadingImage(true);
        for (const file of imageFiles) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", file);

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadRes.ok) {
            const error = await uploadRes.json();
            throw new Error(error.error || "Failed to upload image");
          }

          const uploadData = await uploadRes.json();
          uploadedImages.push(uploadData.url);
        }
        setUploadingImage(false);
      }

      const productData = {
        ...formData,
        images: uploadedImages,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }

      setIsModalOpen(false);
      setImageFiles([]);
      setImagePreviews([]);
      await loadProducts();
    } catch (err) {
      setError(
        editingProduct
          ? "Failed to update product"
          : "Failed to create product",
      );
      setUploadingImage(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        setError(`${file.name} is not a supported image format`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} exceeds 5MB size limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setImageFiles((prev) => [...prev, ...validFiles]);

    // Create previews
    const newPreviews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index: number) {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  }

  function addEcommerceLink() {
    setFormData({
      ...formData,
      ecommerceLinks: [...formData.ecommerceLinks, { platform: "", url: "" }],
    });
  }

  function removeEcommerceLink(index: number) {
    setFormData({
      ...formData,
      ecommerceLinks: formData.ecommerceLinks.filter((_, i) => i !== index),
    });
  }

  function updateEcommerceLink(
    index: number,
    field: "platform" | "url",
    value: string,
  ) {
    const updated = [...formData.ecommerceLinks];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, ecommerceLinks: updated });
  }

  async function handleDelete() {
    if (!deletingProduct) return;

    try {
      await deleteProduct(deletingProduct.id);
      setIsDeleteConfirmOpen(false);
      setDeletingProduct(null);
      await loadProducts();
    } catch (err) {
      setError("Failed to delete product");
    }
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
          <p className="mt-1 text-sm text-gray-600">
            Add, edit, or remove products from your website.
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
          Add Product
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

      {/* Search Bar */}
      <div className="mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search products by name..."
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

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No products found. Click &quot;Add Product&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Images
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Links
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {product.images && product.images.length > 0 ? (
                          <>
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 rounded-md object-cover"
                            />
                            {product.images.length > 1 && (
                              <div className="relative -ml-2">
                                <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                                  <span className="text-xs font-medium text-gray-600">
                                    +{product.images.length - 1}
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {product.ecommerceLinks &&
                      product.ecommerceLinks.length > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.ecommerceLinks.length} link
                          {product.ecommerceLinks.length > 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-gray-600 hover:text-gray-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(product)}
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

      {/* Pagination */}
      {!loading && products.length > 0 && (
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
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === currentPage
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
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

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="relative bg-white rounded-md shadow-lg w-full max-w-4xl">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Name
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
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Images
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Upload multiple product images (Max 5 images)
                  </p>

                  {/* Image Previews Grid */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          >
                            <svg
                              className="w-3 h-3"
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
                      ))}
                    </div>
                  )}

                  {/* File Upload */}
                  {imagePreviews.length < 5 && (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="text-xs text-gray-500 mt-1">
                            Click to upload
                          </p>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                          multiple
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Ecommerce Links Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      E-commerce Links
                    </label>
                    <button
                      type="button"
                      onClick={addEcommerceLink}
                      className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                    >
                      + Add Link
                    </button>
                  </div>

                  {formData.ecommerceLinks.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {formData.ecommerceLinks.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <select
                            value={link.platform}
                            onChange={(e) =>
                              updateEcommerceLink(
                                index,
                                "platform",
                                e.target.value,
                              )
                            }
                            className="w-32 px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                          >
                            <option value="">Platform</option>
                            <option value="Tokopedia">Tokopedia</option>
                            <option value="Shopee">Shopee</option>
                            <option value="Lazada">Lazada</option>
                            <option value="Bukalapak">Bukalapak</option>
                            <option value="Blibli">Blibli</option>
                            <option value="Amazon">Amazon</option>
                            <option value="eBay">eBay</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) =>
                              updateEcommerceLink(index, "url", e.target.value)
                            }
                            placeholder="https://..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <button
                            type="button"
                            onClick={() => removeEcommerceLink(index)}
                            className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
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
                      ))}
                    </div>
                  )}

                  {formData.ecommerceLinks.length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-3 bg-gray-50 rounded-md">
                      No e-commerce links added yet
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={submitting || uploadingImage}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploadingImage}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50"
                  >
                    {uploadingImage
                      ? "Uploading Image..."
                      : submitting
                        ? "Saving..."
                        : editingProduct
                          ? "Update Product"
                          : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && deletingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsDeleteConfirmOpen(false)}
            />
            <div className="relative bg-white rounded-md shadow-lg w-full max-w-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Delete Product
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <strong>{deletingProduct.name}</strong>? This action cannot be
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
