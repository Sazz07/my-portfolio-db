import { baseApi } from '../../api/baseApi';

export type About = {
  id: string;
  title: string;
  description: string;
  image?: string;
  resumeUrl?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAboutPayload = {
  title: string;
  description: string;
  image?: string;
  resumeUrl?: string;
};

export type UpdateAboutPayload = Partial<CreateAboutPayload> & {
  id: string;
};

export const aboutApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAbout: builder.query<About, void>({
      query: () => '/about',
      providesTags: ['About'],
    }),
    createAbout: builder.mutation<About, CreateAboutPayload>({
      query: (about) => ({
        url: '/about',
        method: 'POST',
        body: about,
      }),
      invalidatesTags: ['About'],
    }),
    updateAbout: builder.mutation<About, UpdateAboutPayload>({
      query: ({ id, ...about }) => ({
        url: `/about/${id}`,
        method: 'PATCH',
        body: about,
      }),
      invalidatesTags: ['About'],
    }),
    deleteAbout: builder.mutation<void, string>({
      query: (id) => ({
        url: `/about/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['About'],
    }),
  }),
});

export const {
  useGetAboutQuery,
  useCreateAboutMutation,
  useUpdateAboutMutation,
  useDeleteAboutMutation,
} = aboutApiSlice;
