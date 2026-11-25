/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";
import { ProductItem } from "../product/productApi";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<{ success: boolean; data: ProductItem[] }, void>({
      query: () => ({
        url: "/wishlist",
        method: "GET",
      }),
      providesTags: ["wishlist"],
    }),

    toggleWishlist: builder.mutation<
      { success: boolean; data: { isWishlisted: boolean; message: string } },
      string
    >({
      query: (productId) => ({
        url: "/wishlist/toggle",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["wishlist"],
    }),

    checkWishlistStatus: builder.query<{ success: boolean; data: { isWishlisted: boolean } }, string>({
      query: (productId) => ({
        url: `/wishlist/check/${productId}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "wishlist", id }],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useToggleWishlistMutation,
  useCheckWishlistStatusQuery,
} = wishlistApi;

export default wishlistApi;
