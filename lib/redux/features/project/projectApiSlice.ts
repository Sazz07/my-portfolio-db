import { baseApi } from '../../api/baseApi';

export type Project = {
  id: string;
  title: string;
  description: string;
  images?: string[];
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
      transformResponse: (response: {
        data: Project[];
        meta: any;
        success: boolean;
        message: string;
      }) => {
        return response.data || [];
      },
      providesTags: ['Project'],
    }),
    getProject: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      transformResponse: (response: {
        data: Project;
        success: boolean;
        message: string;
      }) => {
        return response.data;
      },
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation<Project, CreateProjectPayload>({
      query: (project) => ({
        url: '/projects',
        method: 'POST',
        body: project,
      }),
      transformResponse: (response: {
        data: Project;
        success: boolean;
        message: string;
      }) => {
        return response.data;
      },
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<Project, UpdateProjectPayload>({
      query: ({ id, ...project }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body: project,
      }),
      transformResponse: (response: {
        data: Project;
        success: boolean;
        message: string;
      }) => {
        return response.data;
      },
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
