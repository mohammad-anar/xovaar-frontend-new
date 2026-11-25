import { baseApi } from "@/redux/api/baseApi";

export interface ProductItem {
  id: string;
  title: string;
  slug?: string;
  price: number;
  originalPrice?: number | null;
  imageUrl: string;
  images: string[];
  category: string;
  categoryId?: string;
  subCategory: "Drop-Shoulder T-Shirt" | "Sweat Shirt" | "Sweet T-Shirt" | "Hoodie" | string;
  inStock?: boolean;
  stockQuantity?: number;
  freeDelivery?: boolean;
  description?: string;
  sizes?: string[];
  isDeleted?: boolean;
  fabricComposition?:
    | string
    | {
        mainFabric?: string;
        weight?: string;
        material?: string;
        lining?: string;
        cuffs?: string;
        detailing?: string;
        zipper?: string;
        stitching?: string;
        silhouette?: string;
      };
}

export interface GetProductsParams {
  category?: string;
  search?: string;
  sort?: string;
  sub?: string;
}

export const DEFAULT_NEW_ARRIVALS: ProductItem[] = [
  // 1-5: Drop-Shoulder T-Shirts
  {
    id: "prod-1",
    title: "Men White 'SILENCE' Graphic Oversized Drop-Shoulder Tee",
    price: 790.0,
    originalPrice: 1050.0,
    imageUrl: "/products/product-5.jpg",
    images: [
      "/products/product-5.jpg",
      "/products/product-9.jpg",
      "/products/product-11.jpg",
    ],
    category: "Men",
    subCategory: "Drop-Shoulder T-Shirt",
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Engineered with a contemporary relaxed silhouette and fallen shoulder seam. High-density 'SILENCE' streetwear back artwork on 240 GSM ultra-combed ring-spun cotton.",
    fabricComposition: {
      mainFabric: "100% Combed Ring-Spun Compact Cotton",
      weight: "240 GSM — substantial heavyweight drape",
      material: "100% Cotton",
      cuffs: "Seamless drop-shoulder construction",
      detailing: "High-density screen print and ribbed crew collar",
      stitching: "Twin-needle hem and sleeve finish",
      silhouette: "Boxy streetwear drop-shoulder fit",
    },
  },
  {
    id: "prod-2",
    title: "Men Streetwear 'DOOM' Graphic Drop-Shoulder Tee - Jet Black",
    price: 850.0,
    originalPrice: 1150.0,
    imageUrl: "/products/product-11.jpg",
    images: [
      "/products/product-11.jpg",
      "/products/product-5.jpg",
      "/products/product-9.jpg",
    ],
    category: "Men",
    subCategory: "Drop-Shoulder T-Shirt",
    inStock: true,
    sizes: ["M", "L", "XL", "XXL"],
    description:
      "Bold DOOM comic-graphic back design on pure combed black cotton. Dropped shoulders and boxy modern cut.",
    fabricComposition: {
      mainFabric: "Enzyme-washed combed cotton jersey",
      weight: "240 GSM — premium heavy texture",
      material: "100% Cotton",
      silhouette: "Relaxed drop-shoulder streetwear cut",
    },
  },
  {
    id: "prod-3",
    title: "Men Urban Rooftop 'SILENCE' Statement Tee - Off White",
    price: 790.0,
    originalPrice: 1050.0,
    imageUrl: "/products/product-9.jpg",
    images: [
      "/products/product-9.jpg",
      "/products/product-5.jpg",
      "/products/product-11.jpg",
    ],
    category: "Men",
    subCategory: "Drop-Shoulder T-Shirt",
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    description:
      "Modern street architecture combined with breathable natural cotton. Clean neckline with wide relaxed drop shoulders.",
    fabricComposition: {
      mainFabric: "Organic carded cotton single jersey",
      weight: "230 GSM",
      material: "100% Organic Cotton",
      silhouette: "Modern boxy drop-shoulder cut",
    },
  },
  {
    id: "prod-4",
    title: "Men Twin Streetwear Graphic Drop-Shoulder Tee Set",
    price: 890.0,
    originalPrice: 1200.0,
    imageUrl: "/products/product-11.jpg",
    images: [
      "/products/product-11.jpg",
      "/products/product-9.jpg",
      "/products/product-5.jpg",
    ],
    category: "Men",
    subCategory: "Drop-Shoulder T-Shirt",
    inStock: true,
    sizes: ["M", "L", "XL"],
    description:
      "Twin edition streetwear tees with signature back graphics. Cut in a generous dropped shoulder fit with reinforced ribbing.",
    fabricComposition: {
      mainFabric: "Heavyweight compact combed cotton",
      weight: "240 GSM",
      material: "100% Cotton",
      silhouette: "Oversized drop-shoulder streetwear silhouette",
    },
  },
  {
    id: "prod-5",
    title: "Men Minimalist Signature 'SILENCE' Drop-Shoulder Tee",
    price: 820.0,
    originalPrice: 1100.0,
    imageUrl: "/products/product-5.jpg",
    images: [
      "/products/product-5.jpg",
      "/products/product-11.jpg",
      "/products/product-9.jpg",
    ],
    category: "Men",
    subCategory: "Drop-Shoulder T-Shirt",
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Clean monochrome white palette with sharp red accent typography. Breathable heavy cotton that maintains its shape.",
    fabricComposition: {
      mainFabric: "2-ply combed organic cotton jersey",
      weight: "235 GSM",
      material: "100% Cotton",
      silhouette: "Drop-shoulder relaxed fit",
    },
  },

  // 6-10: Sweat Shirts (Sweatshirts)
  {
    id: "prod-6",
    title: "Men Spider '00' Graphic Crewneck Sweat Shirt - Sand Khaki",
    price: 1250.0,
    originalPrice: 1650.0,
    imageUrl: "/products/product-1.jpg",
    images: [
      "/products/product-1.jpg",
      "/products/product-2.jpg",
      "/products/product-3.jpg",
    ],
    category: "Men",
    subCategory: "Sweat Shirt",
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Signature Xovaar Spider '00' graphic sweatshirt in natural sand khaki. Crafted with soft thermal cotton fleece and sleeve flame graphics.",
    fabricComposition: {
      mainFabric: "Loopback French Terry with micro-rib trims",
      weight: "280 GSM — ideal for year-round layering",
      material: "85% Combed Cotton, 15% Polyester",
      cuffs: "Elasticized cotton rib cuffs and waistband",
      stitching: "Flatlock anti-chafing seams",
      silhouette: "Standard tailored streetwear athletic fit",
    },
  },
  {
    id: "prod-7",
    title: "Men Spider '00' Graphic Crewneck Sweat Shirt - Deep Burgundy",
    price: 1350.0,
    originalPrice: 1790.0,
    imageUrl: "/products/product-2.jpg",
    images: [
      "/products/product-2.jpg",
      "/products/product-4.jpg",
      "/products/product-1.jpg",
    ],
    category: "Men",
    subCategory: "Sweat Shirt",
    inStock: true,
    sizes: ["M", "L", "XL", "XXL"],
    description:
      "Rich maroon burgundy sweatshirt featuring front '00' spider graphic and tribal sleeve prints. Soft velvety interior finish.",
    fabricComposition: {
      mainFabric: "Double-knit interlock cotton blend",
      weight: "290 GSM",
      material: "90% Cotton, 10% Poly",
      silhouette: "Athletic raglan silhouette",
    },
  },
  {
    id: "prod-8",
    title: "Men Spider '00' Tribal Graphic Sweat Shirt - Charcoal Grey",
    price: 1290.0,
    originalPrice: 1700.0,
    imageUrl: "/products/product-3.jpg",
    images: [
      "/products/product-3.jpg",
      "/products/product-1.jpg",
      "/products/product-2.jpg",
    ],
    category: "Men",
    subCategory: "Sweat Shirt",
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    description:
      "Stealth charcoal grey crewneck sweatshirt with contrasting white & red spider emblem and tribal sleeve details.",
    fabricComposition: {
      mainFabric: "High-density carbon-finish French Terry",
      weight: "300 GSM",
      material: "100% Combed Cotton",
      silhouette: "Clean modern regular fit",
    },
  },
  {
    id: "prod-9",
    title: "Men Spider '00' Graphic Heavy Sweat Shirt - Night Maroon",
    price: 1290.0,
    originalPrice: 1690.0,
    imageUrl: "/products/product-4.jpg",
    images: [
      "/products/product-4.jpg",
      "/products/product-2.jpg",
      "/products/product-3.jpg",
    ],
    category: "Men",
    subCategory: "Sweat Shirt",
    inStock: true,
    sizes: ["M", "L", "XL"],
    description:
      "Warm night maroon hue with brushed inner fleece lining. Perfect balance of streetwear statement and winter comfort.",
    fabricComposition: {
      mainFabric: "Brushed cotton fleece blend",
      weight: "290 GSM",
      material: "85% Cotton, 15% Polyester",
      silhouette: "Classic crewneck fit",
    },
  },
  {
    id: "prod-10",
    title: "Men Spider '00' Urban Knit Sweat Shirt - Khaki Sand",
    price: 1250.0,
    originalPrice: 1650.0,
    imageUrl: "/products/product-1.jpg",
    images: [
      "/products/product-1.jpg",
      "/products/product-3.jpg",
      "/products/product-4.jpg",
    ],
    category: "Men",
    subCategory: "Sweat Shirt",
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Understated earthy sand khaki palette with iconic spider front print and bold red '00'.",
    fabricComposition: {
      mainFabric: "Pre-shrunk cotton loopback fleece",
      weight: "285 GSM",
      material: "90% Cotton, 10% Spandex",
      silhouette: "Relaxed structured fit",
    },
  },

  // 11-15: Hoodies
  {
    id: "prod-11",
    title: "Men Dual-Tone Colorblock Fleece Hoodie - Maroon & Charcoal",
    price: 2190.0,
    originalPrice: 2900.0,
    imageUrl: "/products/product-6.jpg",
    images: [
      "/products/product-6.jpg",
      "/products/product-7.jpg",
      "/products/product-14.jpg",
    ],
    category: "Men",
    subCategory: "Hoodie",
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Signature colorblock fleece hoodie. Cut from thick 360 GSM fleece with dual-tone maroon and charcoal sleeves, structured lined hood and front kangaroo pocket.",
    fabricComposition: {
      mainFabric: "Ultra-heavyweight brushed cotton fleece",
      weight: "360 GSM — maximum warmth and durability",
      material: "80% Organic Cotton, 20% Recycled Poly",
      lining: "Double-layered self-fabric hood lining",
      cuffs: "2x2 spandex-reinforced heavy rib cuffs",
      detailing: "Contrast colorblocking and metal aglet drawstrings",
      silhouette: "Boxy relaxed hoodie fit",
    },
  },
  {
    id: "prod-12",
    title: "Men 'DOPE' Streetwear Fleece Hoodie - Cream & Sage Green",
    price: 2290.0,
    originalPrice: 2950.0,
    imageUrl: "/products/product-8.jpg",
    images: [
      "/products/product-8.jpg",
      "/products/product-13.jpg",
      "/products/product-10.jpg",
    ],
    category: "Men",
    subCategory: "Hoodie",
    inStock: true,
    sizes: ["M", "L", "XL"],
    description:
      "Two-tone cream and sage green streetwear hoodie with graffiti 'DOPE' chest graphic. Relaxed dropped shoulder fit with lined thermal hood.",
    fabricComposition: {
      mainFabric: "Dense brushed interior fleece",
      weight: "350 GSM",
      material: "85% Cotton, 15% Polyester",
      silhouette: "Dropped shoulder street fit",
    },
  },
  {
    id: "prod-13",
    title: "Men Vintage 'CHAOS' Earth Tone Heavyweight Hoodie - Warm Brown",
    price: 2390.0,
    originalPrice: 3100.0,
    imageUrl: "/products/product-10.jpg",
    images: [
      "/products/product-10.jpg",
      "/products/product-12.jpg",
      "/products/product-8.jpg",
    ],
    category: "Men",
    subCategory: "Hoodie",
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    description:
      "Rich mocha brown fleece hoodie with bold white 'CHAOS' typography across chest and sleeve artwork. Premium winter essential.",
    fabricComposition: {
      mainFabric: "Heavyweight thermal cotton fleece",
      weight: "360 GSM",
      material: "80% Cotton, 20% Polyester",
      silhouette: "Regular athletic silhouette",
    },
  },
  {
    id: "prod-14",
    title: "Men 'NOW TREND' Streetwear Fleece Hoodie - Jet Black",
    price: 2190.0,
    originalPrice: 2850.0,
    imageUrl: "/products/product-12.jpg",
    images: [
      "/products/product-12.jpg",
      "/products/product-10.jpg",
      "/products/product-15.jpg",
    ],
    category: "Men",
    subCategory: "Hoodie",
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Deep reactive jet black hoodie with white 'NOW TREND' dripping graffiti art. Double lined hood with contrast grey interior.",
    fabricComposition: {
      mainFabric: "Reactive-dyed ring-spun fleece",
      weight: "350 GSM",
      material: "85% Cotton, 15% Polyester",
      silhouette: "Relaxed tailored fit",
    },
  },
  {
    id: "prod-15",
    title: "Men 'DOPE' Graffiti Colorblock Hoodie - Crimson & Grey",
    price: 2290.0,
    originalPrice: 2950.0,
    imageUrl: "/products/product-14.jpg",
    images: [
      "/products/product-14.jpg",
      "/products/product-15.jpg",
      "/products/product-6.jpg",
    ],
    category: "Men",
    subCategory: "Hoodie",
    inStock: true,
    sizes: ["M", "L", "XL", "XXL"],
    description:
      "Eye-catching crimson and charcoal colorblock hoodie with prominent 'DOPE' street graffiti graphic and deep kangaroo pocket.",
    fabricComposition: {
      mainFabric: "Heavyweight combed cotton blend fleece",
      weight: "360 GSM",
      material: "80% Cotton, 20% Polyester",
      silhouette: "Oversized drop-shoulder hoodie",
    },
  },
];

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewArrivals: builder.query<{ success: boolean; data: ProductItem[] }, void>({
      query: () => ({
        url: "/products/new-arrivals",
        method: "GET",
      }),
      providesTags: ["products"],
    }),
    getProducts: builder.query<
      { success: boolean; data: ProductItem[] },
      GetProductsParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.set("category", params.category);
        if (params?.sub) queryParams.set("sub", params.sub);
        if (params?.search) queryParams.set("search", params.search);
        if (params?.sort) queryParams.set("sort", params.sort);
        const queryStr = queryParams.toString();
        return {
          url: `/products${queryStr ? `?${queryStr}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["products"],
    }),
    getProductById: builder.query<{ success: boolean; data: ProductItem }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "products", id }],
    }),
    getProductBySlugOrId: builder.query<{ success: boolean; data: ProductItem }, string>({
      query: (slugOrId) => ({
        url: `/products/${slugOrId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "products", id }],
    }),
    createProduct: builder.mutation<{ success: boolean; data: ProductItem }, any>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["products", "categories", "analytics"],
    }),
    updateProduct: builder.mutation<{ success: boolean; data: ProductItem }, { id: string } & any>({
      query: ({ id, ...body }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["products", "categories", "analytics"],
    }),
    deleteProduct: builder.mutation<{ success: boolean; data: ProductItem }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products", "categories", "analytics"],
    }),
    uploadProductImage: builder.mutation<{ success: boolean; data: { imageUrl: string } }, FormData>({
      query: (body) => ({
        url: "/products/upload-image",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetNewArrivalsQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugOrIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
} = productApi;
