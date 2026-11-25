"use client";

import React, { useEffect, useState } from "react";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Tag,
} from "lucide-react";
import { AdminStorage, AdminCategory } from "@/services/adminStore";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  // Form
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("Men");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  useEffect(() => {
    setCategories(AdminStorage.getCategories());
    setIsLoading(false);
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName("");
    setParentCategory("Men");
    setStatus("Active");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setParentCategory(cat.parentCategory);
    setStatus(cat.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const slug = name.toLowerCase().replace(/[\s_]+/g, "-");

    if (editingCategory) {
      const updated = categories.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: name.trim(),
              slug,
              parentCategory,
              status,
            }
          : c
      );
      AdminStorage.saveCategories(updated);
      setCategories(updated);
      toast.success("Category updated successfully!");
    } else {
      const newCat: AdminCategory = {
        id: `cat-${Date.now().toString().slice(-4)}`,
        name: name.trim(),
        slug,
        parentCategory,
        itemCount: 0,
        status,
        createdAt: new Date().toISOString().split("T")[0],
      };
      const updated = [newCat, ...categories];
      AdminStorage.saveCategories(updated);
      setCategories(updated);
      toast.success("Category created successfully!");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, catName: string) => {
    if (confirm(`Are you sure you want to delete category "${catName}"?`)) {
      const updated = categories.filter((c) => c.id !== id);
      AdminStorage.saveCategories(updated);
      setCategories(updated);
      toast.info("Category removed");
    }
  };

  const toggleStatus = (cat: AdminCategory) => {
    const updated = categories.map((c) =>
      c.id === cat.id
        ? {
            ...c,
            status: (c.status === "Active" ? "Inactive" : "Active") as "Active" | "Inactive",
          }
        : c
    );
    AdminStorage.saveCategories(updated);
    setCategories(updated);
    toast.success(`Category ${cat.name} is now ${cat.status === "Active" ? "Inactive" : "Active"}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200/90 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#166534]">
            Taxonomy &amp; Hierarchy
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight uppercase mt-0.5">
            Category &amp; Sub-Category Management
          </h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Organize Men collection segments, slug URLs, and frontend filter groups.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Sub-Category</span>
        </button>
      </div>

      {/* Main Categories Card */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-neutral-200/90 p-5 shadow-2xs space-y-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="w-16 h-4 bg-neutral-200" />
                <div className="w-14 h-4 bg-neutral-100" />
              </div>
              <div className="space-y-1.5">
                <div className="w-3/4 h-5 bg-neutral-300 skeleton-shimmer" />
                <div className="w-1/2 h-3 bg-neutral-200" />
              </div>
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div className="w-20 h-4 bg-neutral-200" />
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-neutral-100" />
                  <div className="w-6 h-6 bg-neutral-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border border-neutral-200/90 p-5 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534] bg-[#f0fdf4] px-2 py-0.5 rounded">
                  {cat.parentCategory}
                </span>
                <button
                  onClick={() => toggleStatus(cat)}
                  className={`text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                    cat.status === "Active" ? "text-emerald-700" : "text-neutral-400"
                  }`}
                >
                  {cat.status === "Active" ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    <XCircle size={12} />
                  )}
                  <span>{cat.status}</span>
                </button>
              </div>

              <h3 className="text-sm font-bold text-neutral-900">{cat.name}</h3>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                slug: /shop?sub={cat.slug}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between mt-4">
              <span className="text-xs font-bold text-neutral-800">
                {cat.itemCount} items listed
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                  title="Edit Category"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1 text-neutral-400 hover:text-red-600 cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
              <h3 className="text-sm font-extrabold uppercase tracking-tight text-neutral-900">
                {editingCategory ? "Edit Category" : "Add Sub-Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-black p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Oversized Heavyweight Tees"
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Parent Department
                </label>
                <select
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#166534] hover:bg-[#14532d] text-xs font-bold uppercase tracking-wider text-white shadow-xs cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}