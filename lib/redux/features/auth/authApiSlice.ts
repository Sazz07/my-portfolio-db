import { baseApi } from '../../api/baseApi';
import { setCredentials, logOut } from './authSlice';

export const authApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: responseData } = await queryFulfilled;

          const { accessToken, user } = responseData.data;
          dispatch(setCredentials({ accessToken, user }));
        } catch {
          // Handle error if needed
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
        } catch {
          // Handle error if needed
        }
      },
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
      }),
    }),
    changePassword: builder.mutation({
      query: (credentials) => ({
        url: '/auth/change-password',
        method: 'PATCH',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useChangePasswordMutation,
} = authApiSlice;
