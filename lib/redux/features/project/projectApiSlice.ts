import { baseApi } from '../../api/baseApi';
import { TMeta, TQueryParam } from '@/types/global.type';

export type Project = {
  id: string;
  title: string;
  description: string;
  images: string[];
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

export type ProjectsResponse = {
  data: Project[];
  meta: TMeta;
};

export const projectBaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectsResponse, { page?: number; limit?: number; searchTerm?: string; status?: string; sortBy?: string; sortOrder?: string }>(
      {
        query: (params) => {
          const queryParams = new URLSearchParams();
          
          if (params.page) queryParams.append('page', params.page.toString());
          if (params.limit) queryParams.append('limit', params.limit.toString());
          if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
          if (params.status) queryParams.append('status', params.status);
          if (params.sortBy) queryParams.append('sortBy', params.sortBy);
          if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
          
          const queryString = queryParams.toString();
          return `/projects${queryString ? `?${queryString}` : ''}`;
        },
        transformResponse: (response: {
          data: Project[];
          meta: TMeta;
          success: boolean;
          message: string;
        }) => {
          return {
            data: response.data || [],
            meta: response.meta || { page: 1, limit: 10, total: 0, totalPage: 0 }
          };
        },
        providesTags: ['Project'],
      }
    ),
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
