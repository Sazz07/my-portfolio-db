import { baseApi } from '../../api/baseApi';

export type Project = {
  id: string;
  title: string;
  description: string;
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  status: 'ONGOING' | 'COMPLETED';
  technologies: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectPayload = {
  title: string;
  description: string;
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  status?: 'ONGOING' | 'COMPLETED';
  technologies: string[];
};

export type UpdateProjectPayload = Partial<CreateProjectPayload> & {
  id: string;
};

export const projectBaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => '/projects',
      providesTags: ['Project'],
    }),
    getProject: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation<Project, CreateProjectPayload>({
      query: (project) => ({
        url: '/projects',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<Project, UpdateProjectPayload>({
      query: ({ id, ...project }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body: project,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectBaseApi;
