/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  parentCategory: string;
  itemCount: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<{ success: boolean; data: CategoryItem[] }, { status?: string; search?: string } | void>({
      query: (params) => ({
        url: "/categories",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["categories"],
    }),

    getCategoryById: builder.query<{ success: boolean; data: CategoryItem }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "categories", id }],
    }),

    createCategory: builder.mutation<{ success: boolean; data: CategoryItem }, { name: string; parentCategory?: string; status?: "ACTIVE" | "INACTIVE" }>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["categories"],
    }),

    updateCategory: builder.mutation<
      { success: boolean; data: CategoryItem },
      { id: string; name?: string; parentCategory?: string; status?: "ACTIVE" | "INACTIVE" }
    >({
      query: ({ id, ...body }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["categories"],
    }),

    deleteCategory: builder.mutation<{ success: boolean; data: CategoryItem }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;

export default categoryApi;
