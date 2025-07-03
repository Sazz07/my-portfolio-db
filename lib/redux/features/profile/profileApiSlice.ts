import { baseApi } from '../../api/baseApi';

export const profileApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => '/users/profile',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/users/profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApiSlice;
