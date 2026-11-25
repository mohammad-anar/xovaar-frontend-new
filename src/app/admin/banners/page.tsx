"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Eye,
  Upload,
  Link as LinkIcon,
  Layers,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import {
  useGetAllBannersAdminQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useUploadBannerImageMutation,
  HeroBannerSlide,
} from "@/redux/service/banner/bannerApi";
import { useGetProductsQuery } from "@/redux/service/product/productApi";

export default function AdminBannersPage() {
  const { data: bannersResponse, isLoading, refetch } = useGetAllBannersAdminQuery();
  const { data: productsResponse } = useGetProductsQuery();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
  const [uploadBannerImage, { isLoading: isUploading }] = useUploadBannerImageMutation();

  const banners = bannersResponse?.data || [];
  const products = productsResponse?.data || [];

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBannerSlide | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [titleHighlight, setTitleHighlight] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [productId, setProductId] = useState("");
  const [align, setAlign] = useState<"left" | "right">("left");
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle("");
    setTitleHighlight("");
    setSubtitle("");
    setImageUrl("");
    setProductId("");
    setAlign("left");
    setIsActive(true);
    setOrder(banners.length);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (banner: HeroBannerSlide) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setTitleHighlight(banner.titleHighlight || "");
    setSubtitle(banner.subtitle || "");
    setImageUrl(banner.imageUrl);
    setProductId(banner.productId || "");
    setAlign(banner.align || "left");
    setIsActive(banner.isActive ?? true);
    setOrder(banner.order ?? 0);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadBannerImage(formData).unwrap();
      if (res.data?.imageUrl) {
        setImageUrl(res.data.imageUrl);
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Image upload failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim() || !imageUrl.trim()) {
      setErrorMsg("Title and Banner Image URL are required");
      return;
    }

    try {
      if (editingBanner) {
        await updateBanner({
          id: editingBanner.id,
          title: title.trim(),
          titleHighlight: titleHighlight.trim(),
          subtitle: subtitle.trim(),
          imageUrl: imageUrl.trim(),
          productId: productId || null,
          align,
          isActive,
          order: Number(order),
        }).unwrap();
        setSuccessMsg("Banner updated successfully");
      } else {
        await createBanner({
          title: title.trim(),
          titleHighlight: titleHighlight.trim(),
          subtitle: subtitle.trim(),
          imageUrl: imageUrl.trim(),
          productId: productId || null,
          align,
          isActive,
          order: Number(order),
        }).unwrap();
        setSuccessMsg("Banner created successfully");
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessMsg(""), 3000);
      refetch();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Failed to save banner");
    }
  };

  const handleDelete = async (id: string, bannerTitle: string) => {
    if (!confirm(`Are you sure you want to delete banner "${bannerTitle}"?`)) return;
    try {
      await deleteBanner(id).unwrap();
      refetch();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to delete banner");
    }
  };

  const handleToggleActive = async (banner: HeroBannerSlide) => {
    try {
      await updateBanner({
        id: banner.id,
        isActive: !banner.isActive,
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
            <ImageIcon className="w-5 h-5 text-neutral-400" />
            Hero Banner Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Configure homepage hero slider slides, link products, and control visual alignment.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-200 text-xs font-semibold px-4 py-2.5 transition-colors border border-transparent shadow-xs"
        >
          <Plus size={14} />
          Add Hero Banner
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 flex items-center gap-2">
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      )}

      {/* Table / Grid */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-neutral-900/60 border border-neutral-800 animate-pulse" />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-800 bg-neutral-950/40">
          <ImageIcon className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-300">No Hero Banners Found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Your homepage currently uses default backup banners. Add your first custom banner slide to take control.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 bg-white text-black text-xs font-semibold px-4 py-2 hover:bg-neutral-200"
          >
            <Plus size={14} />
            Create First Banner
          </button>
        </div>
      ) : (
        <div className="border border-neutral-800 bg-[#161b22] overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300 border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-[#0d1117] text-neutral-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Banner Preview</th>
                <th className="py-3 px-4">Headline & Subtitle</th>
                <th className="py-3 px-4">Linked Product</th>
                <th className="py-3 px-4">Align</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="relative w-28 h-16 bg-neutral-900 border border-neutral-700/80 overflow-hidden shrink-0">
                      {banner.imageUrl ? (
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-white text-sm">
                      {banner.title}{" "}
                      {banner.titleHighlight && (
                        <span className="text-neutral-400 font-light italic">
                          {banner.titleHighlight}
                        </span>
                      )}
                    </div>
                    {banner.subtitle && (
                      <div className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        {banner.subtitle}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {banner.productTitle ? (
                      <div className="flex items-center gap-2">
                        {banner.productImage && (
                          <img
                            src={banner.productImage}
                            alt=""
                            className="w-7 h-7 object-cover border border-neutral-700"
                          />
                        )}
                        <div>
                          <div className="text-xs text-neutral-200 line-clamp-1">
                            {banner.productTitle}
                          </div>
                          {banner.productPrice && (
                            <div className="text-[10px] text-emerald-400 font-medium">
                              ৳{banner.productPrice}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-neutral-600 italic text-[11px]">No product linked</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="uppercase text-[10px] px-2 py-0.5 border border-neutral-700 bg-neutral-800/80 text-neutral-300 font-mono">
                      {banner.align || "left"}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-400">{banner.order ?? 0}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium border ${
                        banner.isActive
                          ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/40"
                          : "bg-neutral-900 text-neutral-500 border-neutral-700"
                      }`}
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(banner)}
                        className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                        title="Edit Banner"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id, banner.title)}
                        className="p-1.5 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 transition-colors"
                        title="Delete Banner"
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
          <div className="bg-[#161b22] border border-neutral-700 w-full max-w-xl text-neutral-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-800 bg-[#0d1117]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                {editingBanner ? "Edit Hero Banner" : "Create New Hero Banner"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Spider '00'"
                    className="w-full bg-[#0d1117] border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                    Title Highlight
                  </label>
                  <input
                    type="text"
                    value={titleHighlight}
                    onChange={(e) => setTitleHighlight(e.target.value)}
                    placeholder="e.g. Crewneck"
                    className="w-full bg-[#0d1117] border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. signature thermal knit graphic sweatshirt in sand khaki"
                  className="w-full bg-[#0d1117] border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-white"
                />
              </div>

              {/* Banner Image URL & File Upload */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                  Banner Image *
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/banners/banner-1.jpg or external/upload URL"
                    className="w-full bg-[#0d1117] border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-white font-mono text-[11px]"
                  />
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] px-3 py-1.5 border border-neutral-700">
                      <Upload size={12} />
                      {isUploading ? "Uploading..." : "Upload from Device"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {imageUrl && (
                      <span className="text-[11px] text-emerald-400 truncate max-w-xs">
                        ✓ Image set
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Linked Product Selection */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1">
                  <LinkIcon size={11} /> Link with Product (For Lens/Inspect Modal)
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full bg-[#0d1117] border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-white"
                >
                  <option value="">-- None (No product linked) --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (৳{p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                    Text Alignment
                  </label>
                  <select
                    value={align}
                    onChange={(e) => setAlign(e.target.value as "left" | "right")}
                    className="w-full bg-[#0d1117] border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-white"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full bg-[#0d1117] border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="accent-white w-4 h-4 rounded-none"
                    />
                    <span className="text-[11px] uppercase tracking-wider text-neutral-300">
                      Active Slide
                    </span>
                  </label>
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
                  {isCreating || isUpdating ? "Saving..." : editingBanner ? "Update Banner" : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
