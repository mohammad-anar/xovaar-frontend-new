/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export interface HeroBannerSlide {
  id: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  imageUrl: string;
  productId?: string | null;
  productTitle?: string | null;
  productPrice?: number | null;
  productImage?: string | null;
  ctaText?: string;
  ctaLink?: string;
  align?: "left" | "right";
  isActive?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface NavCategory {
  id: string;
  label: string;
  href: string;
  badge?: string;
}

export const DEFAULT_HERO_SLIDES: HeroBannerSlide[] = [
  {
    id: "slide-1",
    title: "Spider '00'",
    titleHighlight: "Crewneck",
    subtitle: "signature thermal knit graphic sweatshirt in sand khaki",
    imageUrl: "/banners/banner-1.jpg",
    productId: "prod-6",
    productTitle: "Men Spider '00' Graphic Crewneck Sweat Shirt - Sand Khaki",
    productPrice: 1250.0,
    productImage: "/products/product-1.jpg",
    ctaText: "Shop Now",
    ctaLink: "/product/prod-6",
    align: "right",
    isActive: true,
  },
  {
    id: "slide-2",
    title: "Rooftop",
    titleHighlight: "Streetwear",
    subtitle: "oversized drop-shoulder DOOM & SILENCE statement collection",
    imageUrl: "/banners/banner-2.jpg",
    productId: "prod-2",
    productTitle: "Men Streetwear 'DOOM' Graphic Drop-Shoulder Tee - Jet Black",
    productPrice: 850.0,
    productImage: "/products/product-11.jpg",
    ctaText: "Shop Now",
    ctaLink: "/product/prod-2",
    align: "left",
    isActive: true,
  },
  {
    id: "slide-3",
    title: "Tribal",
    titleHighlight: "Sweatshirt",
    subtitle: "charcoal grey high-density French terry with red spider emblem",
    imageUrl: "/banners/banner-3.jpg",
    productId: "prod-8",
    productTitle: "Men Spider '00' Tribal Graphic Sweat Shirt - Charcoal Grey",
    productPrice: 1290.0,
    productImage: "/products/product-3.jpg",
    ctaText: "Shop Now",
    ctaLink: "/product/prod-8",
    align: "right",
    isActive: true,
  },
  {
    id: "slide-4",
    title: "SILENCE",
    titleHighlight: "Drop-Shoulder",
    subtitle: "heavyweight 240 GSM ultra-combed ring-spun cotton",
    imageUrl: "/banners/banner-4.jpg",
    productId: "prod-1",
    productTitle: "Men White 'SILENCE' Graphic Oversized Drop-Shoulder Tee",
    productPrice: 790.0,
    productImage: "/products/product-5.jpg",
    ctaText: "Shop Now",
    ctaLink: "/product/prod-1",
    align: "left",
    isActive: true,
  },
  {
    id: "slide-5",
    title: "Burgundy",
    titleHighlight: "Spider '00'",
    subtitle: "rich maroon double-knit thermal crewneck with flame sleeves",
    imageUrl: "/banners/banner-5.jpg",
    productId: "prod-7",
    productTitle: "Men Spider '00' Graphic Crewneck Sweat Shirt - Deep Burgundy",
    productPrice: 1350.0,
    productImage: "/products/product-2.jpg",
    ctaText: "Shop Now",
    ctaLink: "/product/prod-7",
    align: "left",
    isActive: true,
  },
  {
    id: "slide-6",
    title: "DOPE",
    titleHighlight: "Colorblock Hoodie",
    subtitle: "ultra-heavyweight 360 GSM fleece in crimson & charcoal",
    imageUrl: "/banners/banner-6.jpg",
    productId: "prod-15",
    productTitle: "Men 'DOPE' Graffiti Colorblock Hoodie - Crimson & Grey",
    productPrice: 2290.0,
    productImage: "/products/product-14.jpg",
    ctaText: "Shop Now",
    ctaLink: "/product/prod-15",
    align: "right",
    isActive: true,
  },
];

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<{ success: boolean; data: HeroBannerSlide[] }, void>({
      query: () => ({
        url: "/banners",
        method: "GET",
      }),
      providesTags: ["banners"],
    }),

    getAllBannersAdmin: builder.query<{ success: boolean; data: HeroBannerSlide[] }, void>({
      query: () => ({
        url: "/banners/admin/all",
        method: "GET",
      }),
      providesTags: ["banners"],
    }),

    getBannerById: builder.query<{ success: boolean; data: HeroBannerSlide }, string>({
      query: (id) => ({
        url: `/banners/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "banners", id }],
    }),

    createBanner: builder.mutation<{ success: boolean; data: HeroBannerSlide }, Partial<HeroBannerSlide>>({
      query: (body) => ({
        url: "/banners",
        method: "POST",
        body,
      }),
      invalidatesTags: ["banners"],
    }),

    updateBanner: builder.mutation<
      { success: boolean; data: HeroBannerSlide },
      { id: string } & Partial<HeroBannerSlide>
    >({
      query: ({ id, ...body }) => ({
        url: `/banners/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["banners"],
    }),

    deleteBanner: builder.mutation<{ success: boolean; data: HeroBannerSlide }, string>({
      query: (id) => ({
        url: `/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["banners"],
    }),

    uploadBannerImage: builder.mutation<{ success: boolean; data: { imageUrl: string } }, FormData>({
      query: (body) => ({
        url: "/banners/upload-image",
        method: "POST",
        body,
      }),
    }),

    // Legacy aliases
    getHeroSlides: builder.query<{ success: boolean; data: HeroBannerSlide[] }, void>({
      query: () => ({
        url: "/banners",
        method: "GET",
      }),
      providesTags: ["banners"],
    }),
    getNavCategories: builder.query<{ success: boolean; data: NavCategory[] }, void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["categories"],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useGetAllBannersAdminQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useUploadBannerImageMutation,
  useGetHeroSlidesQuery,
  useGetNavCategoriesQuery,
} = bannerApi;

export default bannerApi;
