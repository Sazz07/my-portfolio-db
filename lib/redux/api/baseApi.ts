/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { setCredentials, logOut } from '../features/auth/authSlice';
import { Mutex } from 'async-mutex';

const BASE_URL = 'http://localhost:5000/api/v1';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.accessToken;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    } else {
      headers.delete('authorization');
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const release = await mutex.acquire();

  try {
    const state = api.getState() as RootState;
    const token = state.auth?.accessToken;

    if (state.auth?.isAuthenticated && !token) {
      const refreshResult = await baseQuery(
        { url: '/auth/refresh-token', method: 'POST' },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        const { accessToken } = refreshResult.data as { accessToken: string };

        api.dispatch(
          setCredentials({
            accessToken,
            user: state.auth?.user,
          })
        );
      }
    }

    let result = await baseQuery(args, api, extraOptions);

    // If we get a 401 Unauthorized response, try to refresh the token
    if (result?.error?.status === 401) {
      const refreshResult = await baseQuery(
        { url: '/auth/refresh-token', method: 'POST' },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        const { accessToken } = refreshResult.data as { accessToken: string };

        api.dispatch(
          setCredentials({
            accessToken,
            user: state.auth?.user,
          })
        );

        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logOut());
      }
    }

    return result;
  } finally {
    release();
  }
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Project',
    'Experience',
    'Education',
    'Skill',
    'Blog',
    'About',
    'Contact',
    'Technology',
    'Blog-Category',
    'Quotes',
  ],
  endpoints: () => ({}),
});
