import { baseApi } from '../../api/baseApi';

export type Skill = {
  id: string;
  name: string;
  level: number;
  category: string;
  userId: string;
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
    getSkills: builder.query<Skill[], void>({
      query: () => '/skills',
      providesTags: ['Skill'],
    }),
    getSkill: builder.query<Skill, string>({
      query: (id) => `/skills/${id}`,
      providesTags: (result, error, id) => [{ type: 'Skill', id }],
    }),
    createSkill: builder.mutation<Skill, CreateSkillPayload>({
      query: (skill) => ({
        url: '/skills',
        method: 'POST',
        body: skill,
      }),
      invalidatesTags: ['Skill'],
    }),
    updateSkill: builder.mutation<Skill, UpdateSkillPayload>({
      query: ({ id, ...skill }) => ({
        url: `/skills/${id}`,
        method: 'PATCH',
        body: skill,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Skill', id }],
    }),
    deleteSkill: builder.mutation<void, string>({
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
