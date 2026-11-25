"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  ImagePlus,
  Camera,
} from "lucide-react";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  ProductItem,
} from "@/redux/service/product/productApi";
import { useGetCategoriesQuery } from "@/redux/service/category/categoryApi";
import RichTextEditor, { DEFAULT_FABRIC_TEMPLATE } from "@/components/admin/RichTextEditor";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { toast } from "sonner";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

export default function AdminProductsPage() {
  const { data: apiProducts, isLoading, refetch } = useGetProductsQuery();
  const { data: apiCategories } = useGetCategoriesQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [uploadImage] = useUploadProductImageMutation();

  const products: ProductItem[] = apiProducts?.data || [];
  const categories = apiCategories?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form State for Add / Edit
  const [formTitle, setFormTitle] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formOriginalPrice, setFormOriginalPrice] = useState("");
  const [primaryImage, setPrimaryImage] = useState("");
  const [secondaryImage, setSecondaryImage] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [formSubCategory, setFormSubCategory] = useState<string>("Drop-Shoulder T-Shirt");
  const [formDescription, setFormDescription] = useState("");
  const [formFabricComposition, setFormFabricComposition] = useState(DEFAULT_FABRIC_TEMPLATE);
  const [formInStock, setFormInStock] = useState(true);
  const [formFreeDelivery, setFormFreeDelivery] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ]);

  // Hidden file input refs
  const primaryFileRef = useRef<HTMLInputElement>(null);
  const secondaryFileRef = useRef<HTMLInputElement>(null);
  const additionalFileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "primary" | "secondary" | "additional"
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === "additional") {
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error("Please upload valid image files (JPG, PNG, WebP)");
          return;
        }
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const result = uploadEvent.target?.result as string;
          if (result) {
            setAdditionalImages((prev) => [...prev, result]);
          }
        };
        reader.readAsDataURL(file);
      });
      toast.success("Additional gallery image(s) uploaded!");
    } else {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file (JPG, PNG, WebP)");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          if (type === "primary") {
            setPrimaryImage(result);
            toast.success("1st Image (Primary Cover) uploaded!");
          } else {
            setSecondaryImage(result);
            toast.success("2nd Image (Hover Close-Shot) uploaded!");
          }
        }
      };
      reader.readAsDataURL(file);
    }

    // Reset input value so re-selecting same file fires onChange
    e.target.value = "";
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    toast.info("Image removed from gallery");
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSelectAllSizes = () => {
    setSelectedSizes(["XS", "S", "M", "L", "XL", "XXL", "3XL"]);
  };

  const handleClearSizes = () => {
    setSelectedSizes([]);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormTitle("");
    setFormPrice("");
    setFormOriginalPrice("");
    setPrimaryImage("");
    setSecondaryImage("");
    setAdditionalImages([]);
    setFormSubCategory("Drop-Shoulder T-Shirt");
    setFormDescription(
      "Crafted with 240 GSM ultra-combed ring-spun cotton for an elevated streetwear drape."
    );
    setFormFabricComposition(DEFAULT_FABRIC_TEMPLATE);
    setFormInStock(true);
    setFormFreeDelivery(false);
    setSelectedSizes(["S", "M", "L", "XL", "XXL"]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProductItem) => {
    setEditingProduct(p);
    setFormTitle(p.title);
    setFormPrice(p.price.toString());
    setFormOriginalPrice((p.originalPrice || p.price + 200).toString());
    const prim = p.imageUrl || (p.images && p.images[0]) || "";
    const sec = p.images && p.images.length > 1 ? p.images[1] : "";
    const others = p.images && p.images.length > 2 ? p.images.slice(2) : [];
    setPrimaryImage(prim);
    setSecondaryImage(sec);
    setAdditionalImages(others);
    setFormSubCategory(p.subCategory);
    setFormDescription(p.description || "");

    // Extract HTML string or convert object to HTML string
    const fabricHtml =
      typeof p.fabricComposition === "string"
        ? p.fabricComposition
        : p.fabricComposition
        ? `<ul>
  ${p.fabricComposition.mainFabric ? `<li><strong>Main Fabric:</strong> ${p.fabricComposition.mainFabric}</li>` : ""}
  ${p.fabricComposition.weight ? `<li><strong>Weight:</strong> ${p.fabricComposition.weight}</li>` : ""}
  ${p.fabricComposition.material ? `<li><strong>Material:</strong> ${p.fabricComposition.material}</li>` : ""}
  ${p.fabricComposition.cuffs ? `<li><strong>Cuffs:</strong> ${p.fabricComposition.cuffs}</li>` : ""}
  ${p.fabricComposition.zipper ? `<li><strong>Zipper:</strong> ${p.fabricComposition.zipper}</li>` : ""}
  ${p.fabricComposition.stitching ? `<li><strong>Stitching:</strong> ${p.fabricComposition.stitching}</li>` : ""}
  ${p.fabricComposition.silhouette ? `<li><strong>Silhouette:</strong> ${p.fabricComposition.silhouette}</li>` : ""}
</ul>`
        : DEFAULT_FABRIC_TEMPLATE;
    setFormFabricComposition(fabricHtml);

    setFormInStock(p.inStock !== false);
    setFormFreeDelivery(p.freeDelivery === true);
    setSelectedSizes(
      p.sizes && p.sizes.length > 0 ? p.sizes : ["S", "M", "L", "XL", "XXL"]
    );
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formPrice.trim()) {
      toast.error("Please provide product title and price");
      return;
    }

    if (!primaryImage) {
      toast.error("Please upload the 1st Primary Cover image");
      return;
    }

    if (selectedSizes.length === 0) {
      toast.error("Please select at least one available size");
      return;
    }

    const priceNum = parseFloat(formPrice);
    const origPriceNum = formOriginalPrice ? parseFloat(formOriginalPrice) : priceNum + 200;

    const allImages = [
      primaryImage,
      secondaryImage || primaryImage,
      ...additionalImages,
    ];

    const matchingCat = categories.find((c) => c.name.toLowerCase() === formSubCategory.toLowerCase() || c.slug === formSubCategory.toLowerCase()) || categories[0];
    const categoryId = matchingCat?.id || "640000000000000000000001";

    if (editingProduct) {
      // Update
      updateProduct({
        id: editingProduct.id,
        title: formTitle.trim(),
        price: priceNum,
        originalPrice: origPriceNum,
        imageUrl: primaryImage,
        images: allImages,
        categoryId: editingProduct.categoryId || categoryId,
        subCategory: formSubCategory,
        description: formDescription.trim(),
        fabricComposition: formFabricComposition.trim() || undefined,
        inStock: formInStock,
        freeDelivery: formFreeDelivery,
        sizes: selectedSizes,
      })
        .unwrap()
        .then(() => {
          toast.success("Product updated successfully!");
          refetch();
        })
        .catch((err: any) => {
          toast.error(err?.data?.message || "Failed to update product");
        });
    } else {
      // Create
      createProduct({
        title: formTitle.trim(),
        price: priceNum,
        originalPrice: origPriceNum,
        imageUrl: primaryImage,
        images: allImages,
        categoryId,
        subCategory: formSubCategory,
        inStock: formInStock,
        freeDelivery: formFreeDelivery,
        sizes: selectedSizes,
        description: formDescription.trim(),
        fabricComposition: formFabricComposition.trim() || undefined,
      })
        .unwrap()
        .then(() => {
          toast.success("New product published successfully!");
          refetch();
        })
        .catch((err: any) => {
          toast.error(err?.data?.message || "Failed to publish product");
        });
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteProduct(id).unwrap();
        toast.info("Product removed from catalog");
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete product");
      }
    }
  };

  const toggleStockStatus = async (p: ProductItem) => {
    try {
      await updateProduct({
        id: p.id,
        inStock: !p.inStock,
      }).unwrap();
      toast.success(`${p.title} stock marked as ${!p.inStock ? "In Stock" : "Out of Stock"}`);
      refetch();
    } catch (err: any) {
      toast.error("Failed to update stock status");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      !searchTerm.trim() ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subCategory.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (subCategoryFilter === "all") return true;

    const sub = (p.subCategory || "").toLowerCase().replace(/[\s-_]/g, "");
    const filter = subCategoryFilter.toLowerCase().replace(/[\s-_]/g, "");

    return sub.includes(filter) || filter.includes(sub);
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-neutral-200/90 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#166534]">
            Catalog Management
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight uppercase mt-0.5">
            Products ({filteredProducts.length})
          </h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Manage inventory, update prices, toggle availability, and publish new items.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product title or type..."
            className="w-full bg-[#fbf9f6] border border-neutral-200 pl-9 pr-4 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
          />
        </div>

        {/* Subcategory Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-neutral-500 uppercase mr-1">
            Category:
          </span>
          {[
            { id: "all", label: "All Items" },
            { id: "dropshoulder", label: "Drop-Shoulder" },
            { id: "sweat", label: "Sweat Shirts" },
            { id: "hoodie", label: "Hoodies" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xs text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${subCategoryFilter === tab.id
                ? "bg-[#111827] text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={5} hasThumbnails={true} />
      ) : (
        <div className="bg-white border border-neutral-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf6f2] text-neutral-600 uppercase tracking-wider text-[10px] font-bold border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Sub-Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400">
                    <Package size={32} className="mx-auto mb-2 opacity-40" />
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-neutral-50/70 transition-colors"
                  >
                    {/* Product image & title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-16 bg-neutral-100 shrink-0 border border-neutral-200">
                          <Image
                            src={p.imageUrl}
                            alt={p.title}
                            fill
                            unoptimized={p.imageUrl?.startsWith("data:")}
                            className="object-cover object-top"
                          />
                        </div>
                        <div className="max-w-xs">
                          <div className="font-bold text-neutral-900 line-clamp-1">
                            {p.title}
                          </div>
                          <div className="text-[10px] text-neutral-400 mt-0.5">
                            ID: {p.id} &bull; Sizes: {p.sizes?.join(", ") || "S-XXL"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block bg-neutral-100 text-neutral-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        {p.subCategory}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900">
                        ৳ {p.price.toLocaleString()}
                      </div>
                      {p.originalPrice && (
                        <div className="text-[10px] text-neutral-400 line-through">
                          ৳ {p.originalPrice.toLocaleString()}
                        </div>
                      )}
                      {p.freeDelivery && (
                        <span className="inline-block mt-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                          Free Delivery
                        </span>
                      )}
                    </td>

                    {/* Stock Status toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleStockStatus(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold cursor-pointer transition-colors ${p.inStock !== false
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                          }`}
                        title="Click to toggle status"
                      >
                        {p.inStock !== false ? (
                          <>
                            <CheckCircle2 size={12} />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={12} />
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                        title="Edit product"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
              <h3 className="text-base font-extrabold uppercase tracking-tight text-neutral-900">
                {editingProduct ? "Edit Product Details" : "Add New Apparel Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-black p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Men Oversized Drop-Shoulder Tee - Sand"
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              {/* SubCategory & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                    Sub-Category *
                  </label>
                  <select
                    value={formSubCategory}
                    onChange={(e: any) => setFormSubCategory(e.target.value)}
                    className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  >
                    <option value="Drop-Shoulder T-Shirt">Drop-Shoulder T-Shirt</option>
                    <option value="Sweat Shirt">Sweat Shirt</option>
                    <option value="Hoodie">Hoodie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                    Stock Availability
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormInStock(!formInStock)}
                    className={`w-full py-2 px-3 text-xs font-bold uppercase tracking-wider border transition-colors flex items-center justify-center gap-1.5 ${formInStock
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-red-50 text-red-800 border-red-300"
                      }`}
                  >
                    {formInStock ? "In Stock" : "Out of Stock"}
                  </button>
                </div>
              </div>

              {/* Available Sizes Selector */}
              <div className="space-y-2 p-3.5 bg-neutral-50/70 border border-neutral-200 rounded-xs">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Available Sizes *
                  </label>
                  <div className="flex items-center gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={handleSelectAllSizes}
                      className="text-[#166534] hover:underline font-bold uppercase cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-neutral-300">|</span>
                    <button
                      type="button"
                      onClick={handleClearSizes}
                      className="text-neutral-500 hover:text-black font-semibold uppercase cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {ALL_SIZES.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`min-w-11 h-9 px-3 text-xs font-bold rounded-xs border transition-all cursor-pointer flex items-center justify-center gap-1 ${isSelected
                          ? "bg-[#166534] border-[#166534] text-white shadow-2xs font-black"
                          : "bg-white border-neutral-300 text-neutral-600 hover:border-neutral-400"
                          }`}
                      >
                        {isSelected && <Check size={12} className="stroke-[3]" />}
                        <span>{size}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Active in inventory: <span className="font-bold text-neutral-900">{selectedSizes.length > 0 ? selectedSizes.join(", ") : "None (Please select at least 1 size)"}</span>
                </p>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                    Selling Price (৳) *
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="790"
                    className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                    Original Price (৳)
                  </label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    placeholder="1050"
                    className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Free Delivery Checkbox */}
              <div className="flex items-center gap-3 p-3 bg-[#faf6f2] border border-[#e8ded6] rounded-xs">
                <input
                  type="checkbox"
                  id="formFreeDelivery"
                  checked={formFreeDelivery}
                  onChange={(e) => setFormFreeDelivery(e.target.checked)}
                  className="w-4 h-4 accent-[#166534] rounded cursor-pointer"
                />
                <label
                  htmlFor="formFreeDelivery"
                  className="text-xs text-neutral-800 font-bold uppercase tracking-wider cursor-pointer select-none flex-1"
                >
                  <span className="flex items-center gap-2">
                    <span>Free Delivery (৳ 0 Shipping)</span>
                    {formFreeDelivery && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                        ENABLED
                      </span>
                    )}
                  </span>
                  <span className="block text-[11px] text-neutral-500 font-normal normal-case mt-0.5">
                    Check to make this product 100% free delivery without any courier charge
                  </span>
                </label>
              </div>

              {/* Product Media & Image Uploads */}
              <div className="space-y-3 pt-2 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Product Imagery &amp; Photos *
                  </label>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    Upload directly from device (PNG, JPG, WebP)
                  </span>
                </div>

                {/* Hidden File Inputs */}
                <input
                  type="file"
                  ref={primaryFileRef}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "primary")}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={secondaryFileRef}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "secondary")}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={additionalFileRef}
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e, "additional")}
                  className="hidden"
                />

                {/* 2-Column Grid for Primary (Static) and Secondary (Hover Slide-Up) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Slot 1: Primary Cover Image */}
                  <div className="border border-neutral-200 rounded-xs p-3 bg-neutral-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-neutral-900 uppercase">
                        1st Image (Primary Cover) *
                      </span>
                      <span className="text-[9px] bg-neutral-200 text-neutral-800 font-bold px-1.5 py-0.5 rounded uppercase">
                        Card Static View
                      </span>
                    </div>

                    {primaryImage ? (
                      <div className="relative w-full aspect-[3/4] bg-neutral-100 border border-neutral-200 overflow-hidden group">
                        <Image
                          src={primaryImage}
                          alt="Primary preview"
                          fill
                          unoptimized={primaryImage.startsWith("data:")}
                          className="object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => primaryFileRef.current?.click()}
                            className="bg-white text-neutral-900 text-[10px] font-bold uppercase px-2.5 py-1 rounded shadow cursor-pointer hover:bg-neutral-100"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => setPrimaryImage("")}
                            className="bg-red-600 text-white p-1 rounded shadow cursor-pointer hover:bg-red-700"
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => primaryFileRef.current?.click()}
                        className="w-full aspect-[3/4] border-2 border-dashed border-neutral-300 hover:border-[#166534] rounded-xs flex flex-col items-center justify-center p-4 text-center cursor-pointer bg-white transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#f0fdf4] text-[#166534] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <UploadCloud size={20} />
                        </div>
                        <span className="text-xs font-bold text-neutral-800">
                          Upload 1st Image
                        </span>
                        <span className="text-[10px] text-neutral-400 mt-0.5">
                          Main static card view
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Slot 2: Hover Close-Shot Image */}
                  <div className="border border-neutral-200 rounded-xs p-3 bg-neutral-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-neutral-900 uppercase">
                        2nd Image (Close Shot) *
                      </span>
                      <span className="text-[9px] bg-[#f0fdf4] text-[#166534] font-bold px-1.5 py-0.5 rounded uppercase">
                        Hover Slide-Up View
                      </span>
                    </div>

                    {secondaryImage ? (
                      <div className="relative w-full aspect-[3/4] bg-neutral-100 border border-neutral-200 overflow-hidden group">
                        <Image
                          src={secondaryImage}
                          alt="Hover close shot preview"
                          fill
                          unoptimized={secondaryImage.startsWith("data:")}
                          className="object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => secondaryFileRef.current?.click()}
                            className="bg-white text-neutral-900 text-[10px] font-bold uppercase px-2.5 py-1 rounded shadow cursor-pointer hover:bg-neutral-100"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => setSecondaryImage("")}
                            className="bg-red-600 text-white p-1 rounded shadow cursor-pointer hover:bg-red-700"
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => secondaryFileRef.current?.click()}
                        className="w-full aspect-[3/4] border-2 border-dashed border-neutral-300 hover:border-[#166534] rounded-xs flex flex-col items-center justify-center p-4 text-center cursor-pointer bg-white transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#f0fdf4] text-[#166534] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <UploadCloud size={20} />
                        </div>
                        <span className="text-xs font-bold text-neutral-800">
                          Upload 2nd Image
                        </span>
                        <span className="text-[10px] text-neutral-400 mt-0.5">
                          Bottom-to-top slide on hover
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Slot 3: Additional Gallery Angles (Optional) */}
                <div className="border border-neutral-200 rounded-xs p-3 bg-neutral-50/50 mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-neutral-900 uppercase">
                      Additional Gallery Shots (Optional)
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      Product details thumbnail strip
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {additionalImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-20 bg-neutral-100 border border-neutral-200 overflow-hidden rounded-xs group shrink-0"
                      >
                        <Image
                          src={img}
                          alt={`Gallery shot ${idx + 1}`}
                          fill
                          unoptimized={img.startsWith("data:")}
                          className="object-cover object-top"
                        />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => additionalFileRef.current?.click()}
                      className="w-16 h-20 border-2 border-dashed border-neutral-300 hover:border-[#166534] rounded-xs flex flex-col items-center justify-center text-neutral-500 hover:text-[#166534] bg-white transition-colors cursor-pointer shrink-0"
                      title="Add more angles"
                    >
                      <ImagePlus size={18} />
                      <span className="text-[9px] font-bold mt-1 uppercase">+ Add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="General product description..."
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 resize-none"
                />
              </div>

              {/* Fabric & Composition Rich Text Editor (React Quill) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                  Fabric &amp; Composition (React Quill Editor)
                </label>
                <RichTextEditor
                  value={formFabricComposition}
                  onChange={setFormFabricComposition}
                  placeholder="Enter fabric specifications, GSM weight, cuffs, zipper, stitching..."
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#166534] hover:bg-[#14532d] text-xs font-bold uppercase tracking-wider text-white transition-colors shadow-xs cursor-pointer"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}