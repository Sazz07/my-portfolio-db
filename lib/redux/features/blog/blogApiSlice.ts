import { baseApi } from '../../api/baseApi';
import { TMeta } from '@/types/global.type';

export type Blog = {
  id: string;
  title: string;
  content: string;
  summary?: string;
  featuredImage?: string;
  images?: string[];
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogsResponse = {
  data: Blog[];
  meta: TMeta;
};

export type CreateBlogPayload = FormData;
export type UpdateBlogPayload = FormData;

export const blogApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<BlogsResponse, any>({
      query: (params) => ({
        url: '/blogs',
        params,
      }),
      providesTags: ['Blog'],
    }),
    getBlogsCategories: builder.query({
      query: (params) => ({
        url: '/blogs/categories',
        params,
      }),
      transformResponse: (response) => response.data,
      providesTags: ['Blog-Category'],
    }),
    getBlog: builder.query<Blog, string>({
      query: (id) => `/blogs/${id}`,
      transformResponse: (response: { data: Blog }) => response.data,
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),
    createBlog: builder.mutation<Blog, CreateBlogPayload>({
      query: (blog) => ({
        url: '/blogs',
        method: 'POST',
        body: blog,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation<Blog, UpdateBlogPayload>({
      query: (blog) => {
        const id = blog.get('id');
        return {
          url: `/blogs/${id}`,
          method: 'PATCH',
          body: blog,
        };
      },
      invalidatesTags: (result, error, arg) => [
        'Blog',
        { type: 'Blog', id: arg.get('id') as string },
      ],
    }),
    deleteBlog: builder.mutation<void, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogsCategoriesQuery,
} = blogApiSlice;
