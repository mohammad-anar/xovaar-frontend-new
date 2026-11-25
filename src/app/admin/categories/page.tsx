"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Tag,
  AlertCircle,
} from "lucide-react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  CategoryItem,
} from "@/redux/service/category/categoryApi";

export default function AdminCategoriesPage() {
  const { data: categoryResponse, isLoading, refetch } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const categories = categoryResponse?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("Men");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const openAddModal = () => {
    setEditingCategory(null);
    setName("");
    setParentCategory("Men");
    setStatus("ACTIVE");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setParentCategory(cat.parentCategory);
    setStatus(cat.status);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Category name is required");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          name: name.trim(),
          parentCategory,
          status,
        }).unwrap();
        setSuccessMsg("Category updated successfully!");
      } else {
        await createCategory({
          name: name.trim(),
          parentCategory,
          status,
        }).unwrap();
        setSuccessMsg("Category created successfully!");
      }

      setIsModalOpen(false);
      refetch();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Failed to save category");
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (confirm(`Are you sure you want to delete category "${catName}"?`)) {
      try {
        await deleteCategory(id).unwrap();
        refetch();
      } catch (err: any) {
        alert(err?.data?.message || "Cannot delete category");
      }
    }
  };

  const handleToggleStatus = async (cat: CategoryItem) => {
    try {
      await updateCategory({
        id: cat.id,
        status: cat.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      }).unwrap();
      refetch();
    } catch (err: any) {
      alert("Failed to toggle status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-neutral-400" />
            Categories Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Organize clothing silhouettes, manage slugs, and monitor active catalog counts.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-200 text-xs font-semibold px-4 py-2.5 transition-colors border border-transparent shadow-xs"
        >
          <Plus size={14} />
          Add Category
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 flex items-center gap-2">
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      )}

      {/* Categories Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-neutral-900/60 border border-neutral-800 animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-800 bg-neutral-950/40">
          <Layers className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-300">No Categories Found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Create categories like &apos;Drop-Shoulder T-Shirt&apos; or &apos;Hoodie&apos; to group your products.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-2 bg-white text-black text-xs font-semibold px-4 py-2 hover:bg-neutral-200"
          >
            <Plus size={14} />
            Create First Category
          </button>
        </div>
      ) : (
        <div className="border border-neutral-800 bg-[#161b22] overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300 border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-[#0d1117] text-neutral-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">URL Slug</th>
                <th className="py-3 px-4">Parent</th>
                <th className="py-3 px-4 text-center">Products</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <Tag size={13} className="text-neutral-500" />
                      {cat.name}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">
                    /{cat.slug}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 border border-neutral-700 bg-neutral-800 text-neutral-300 text-[10px] uppercase font-mono">
                      {cat.parentCategory}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-white">
                    {cat.itemCount ?? 0}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(cat)}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium border ${
                        cat.status === "ACTIVE"
                          ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/40"
                          : "bg-neutral-900 text-neutral-500 border-neutral-700"
                      }`}
                    >
                      {cat.status === "ACTIVE" ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-neutral-700 w-full max-w-md text-neutral-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-800 bg-[#0d1117]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Drop-Shoulder T-Shirt"
                  className="w-full bg-[#0d1117] border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                    Parent Group
                  </label>
                  <select
                    value={parentCategory}
                    onChange={(e) => setParentCategory(e.target.value)}
                    className="w-full bg-[#0d1117] border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-white"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                    className="w-full bg-[#0d1117] border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-white"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-5 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-300 hover:bg-neutral-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-5 py-2 bg-[#16A34A] text-white hover:bg-[#15803d] text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {isCreating || isUpdating ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
