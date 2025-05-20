import { baseApi } from '../../api/baseApi';

export type Blog = {
  id: string;
  title: string;
  content: string;
  image?: string;
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateBlogPayload = {
  title: string;
  content: string;
  image?: string;
  tags: string[];
};

export type UpdateBlogPayload = Partial<CreateBlogPayload> & {
  id: string;
};

export const blogBaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<Blog[], void>({
      query: () => '/blogs',
      providesTags: ['Blog'],
    }),
    getBlog: builder.query<Blog, string>({
      query: (id) => `/blogs/${id}`,
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
      query: ({ id, ...blog }) => ({
        url: `/blogs/${id}`,
        method: 'PATCH',
        body: blog,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Blog', id }],
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
} = blogBaseApi;
