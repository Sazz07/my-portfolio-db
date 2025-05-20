import { baseApi } from '../../api/baseApi';

export type Experience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  responsibilities: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateExperiencePayload = {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  responsibilities: string[];
};

export type UpdateExperiencePayload = Partial<CreateExperiencePayload> & {
  id: string;
};

export const experienceBaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExperiences: builder.query<Experience[], void>({
      query: () => '/experiences',
      providesTags: ['Experience'],
    }),
    getExperience: builder.query<Experience, string>({
      query: (id) => `/experiences/${id}`,
      providesTags: (result, error, id) => [{ type: 'Experience', id }],
    }),
    createExperience: builder.mutation<Experience, CreateExperiencePayload>({
      query: (experience) => ({
        url: '/experiences',
        method: 'POST',
        body: experience,
      }),
      invalidatesTags: ['Experience'],
    }),
    updateExperience: builder.mutation<Experience, UpdateExperiencePayload>({
      query: ({ id, ...experience }) => ({
        url: `/experiences/${id}`,
        method: 'PATCH',
        body: experience,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Experience', id }],
    }),
    deleteExperience: builder.mutation<void, string>({
      query: (id) => ({
        url: `/experiences/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Experience'],
    }),
  }),
});

export const {
  useGetExperiencesQuery,
  useGetExperienceQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} = experienceBaseApi;
