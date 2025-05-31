import { TResponseRedux } from '@/types/global.type';
import { baseApi } from '../../api/baseApi';

export type TEmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'FREELANCE';

export type Experience = {
  id: string;
  title: string;
  company: string;
  location?: string;
  type: TEmploymentType;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string[];
  profileId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateExperiencePayload = {
  title: string;
  company: string;
  location?: string;
  type: TEmploymentType;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string[];
};

export type UpdateExperiencePayload = Partial<CreateExperiencePayload> & {
  id: string;
};

export const experienceBaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExperiences: builder.query<Experience[], void>({
      query: () => '/experiences',
      transformResponse: (response: TResponseRedux<Experience[]>) =>
        response.data || [],
      providesTags: ['Experience'],
    }),
    getExperience: builder.query({
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
