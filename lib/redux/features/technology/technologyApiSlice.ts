import { baseApi } from '../../api/baseApi';

export type Technology = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTechnologyPayload = {
  name: string;
  value: string;
};

export type UpdateTechnologyPayload = Partial<CreateTechnologyPayload> & {
  id: string;
};

export const technologyBaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTechnologies: builder.query<Technology[], void>({
      query: () => '/technologies',
      transformResponse: (response: {
        data: Technology[];
        success: boolean;
        message: string;
      }) => {
        return response.data || [];
      },
      providesTags: ['Technology'],
    }),
    getTechnology: builder.query<Technology, string>({
      query: (id) => `/technologies/${id}`,
      transformResponse: (response: {
        data: Technology;
        success: boolean;
        message: string;
      }) => {
        return response.data;
      },
      providesTags: (result, error, id) => [{ type: 'Technology', id }],
    }),
    createTechnology: builder.mutation<Technology, CreateTechnologyPayload>({
      query: (technology) => ({
        url: '/technologies',
        method: 'POST',
        body: technology,
      }),
      transformResponse: (response: {
        data: Technology;
        success: boolean;
        message: string;
      }) => {
        return response.data;
      },
      invalidatesTags: ['Technology'],
    }),
    updateTechnology: builder.mutation<Technology, UpdateTechnologyPayload>({
      query: ({ id, ...technology }) => ({
        url: `/technologies/${id}`,
        method: 'PATCH',
        body: technology,
      }),
      transformResponse: (response: {
        data: Technology;
        success: boolean;
        message: string;
      }) => {
        return response.data;
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Technology', id }],
    }),
    deleteTechnology: builder.mutation<void, string>({
      query: (id) => ({
        url: `/technologies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Technology'],
    }),
  }),
});

export const {
  useGetTechnologiesQuery,
  useGetTechnologyQuery,
  useCreateTechnologyMutation,
  useUpdateTechnologyMutation,
  useDeleteTechnologyMutation,
} = technologyBaseApi;
