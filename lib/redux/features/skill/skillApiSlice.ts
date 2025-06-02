import { TResponseRedux } from '@/types/global.type';
import { baseApi } from '../../api/baseApi';

export type Skill = {
  id: string;
  name: string;
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
  }),
});

export const {
  useGetSkillsQuery,
  useGetSkillQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} = skillBaseApi;
