import { TResponseRedux } from '@/types/global.type';
import { baseApi } from '../../api/baseApi';

export type Education = {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  grade?: string;
  activities?: string;
  description?: string[];
  profileId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateEducationPayload = {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  grade?: string;
  activities?: string;
  description?: string[];
};

export type UpdateEducationPayload = Partial<CreateEducationPayload> & {
  id: string;
};

export const educationBaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEducations: builder.query<Education[], void>({
      query: () => '/educations',
      transformResponse: (response: TResponseRedux<Education[]>) =>
        response.data || [],
      providesTags: ['Education'],
    }),
    getEducation: builder.query({
      query: (id) => `/educations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Education', id }],
    }),
    createEducation: builder.mutation<Education, CreateEducationPayload>({
      query: (education) => ({
        url: '/educations',
        method: 'POST',
        body: education,
      }),
      invalidatesTags: ['Education'],
    }),
    updateEducation: builder.mutation<Education, UpdateEducationPayload>({
      query: ({ id, ...education }) => ({
        url: `/educations/${id}`,
        method: 'PATCH',
        body: education,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Education', id }],
    }),
    deleteEducation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/educations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Education'],
    }),
  }),
});

export const {
  useGetEducationsQuery,
  useGetEducationQuery,
  useCreateEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} = educationBaseApi;
