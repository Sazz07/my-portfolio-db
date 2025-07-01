import { TResponseRedux } from '@/types/global.type';
import { baseApi } from '../../api/baseApi';

export type Skill = {
  id: string;
  name: string;
  categoryId: string;
  proficiency: number;
  profileId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateSkillPayload = {
  name: string;
  level: number;
  category: string;
};

export type UpdateSkillPayload = Partial<CreateSkillPayload> & {
  id: string;
};

export type SkillCategory = {
  id: string;
  name: string;
};

export const skillBaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSkills: builder.query({
      query: () => '/skills',
      transformResponse: (response: TResponseRedux<Skill[]>) =>
        response.data || [],
      providesTags: ['Skill'],
    }),
    getSkill: builder.query({
      query: (id) => `/skills/${id}`,
      providesTags: (result, error, id) => [{ type: 'Skill', id }],
    }),
    createSkill: builder.mutation({
      query: (skill) => ({
        url: '/skills',
        method: 'POST',
        body: skill,
      }),
      invalidatesTags: ['Skill'],
    }),
    updateSkill: builder.mutation({
      query: ({ id, ...skill }) => ({
        url: `/skills/${id}`,
        method: 'PATCH',
        body: skill,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Skill', id }],
    }),
    deleteSkill: builder.mutation({
      query: (id) => ({
        url: `/skills/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Skill'],
    }),
    getSkillCategories: builder.query<SkillCategory[], void>({
      query: () => '/skill-categories',
      transformResponse: (response: TResponseRedux<SkillCategory[]>) =>
        response.data || [],
      providesTags: ['Skill'],
    }),
    createSkillCategory: builder.mutation<SkillCategory, { name: string }>({
      query: (category) => ({
        url: '/skill-categories',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['Skill'],
    }),
  }),
});

export const {
  useGetSkillsQuery,
  useGetSkillQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useGetSkillCategoriesQuery,
  useCreateSkillCategoryMutation,
} = skillBaseApi;
