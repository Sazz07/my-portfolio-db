import { baseApi } from '../../api/baseApi';

export type Quote = {
  id: string;
  text: string;
  author: string;
  source?: string;
  aboutId: string;
  createdAt: string;
  updatedAt: string;
};

export type About = {
  id: string;
  title: string;
  description: string;
  image?: string;
  resumeUrl?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  quotes?: Quote[];
};

export type CreateAboutPayload = {
  title: string;
  description: string;
  image?: string;
  resumeUrl?: string;
};

export type UpdateAboutPayload = Partial<CreateAboutPayload> & {
  id: string;
};

export type CreateQuotePayload = {
  text: string;
  author: string;
  source?: string;
};

export type UpdateQuotePayload = Partial<CreateQuotePayload> & {
  id: string;
};

export const aboutApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAbout: builder.query<About, void>({
      query: () => '/about',
      providesTags: ['About'],
    }),
    createAbout: builder.mutation<About, FormData>({
      query: (data) => ({
        url: '/about',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['About'],
    }),
    updateAbout: builder.mutation<About, FormData>({
      query: (data) => ({
        url: '/about',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['About'],
    }),
    deleteAbout: builder.mutation<void, string>({
      query: (id) => ({
        url: `/about/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['About'],
    }),
    // Quote endpoints
    getQuotes: builder.query<Quote[], void>({
      query: () => '/about/quotes',
      providesTags: ['Quotes'],
    }),
    getRandomQuote: builder.query<Quote, string>({
      query: (profileId) => `/about/profile/${profileId}/quote/random`,
      providesTags: ['Quotes'],
    }),
    createQuote: builder.mutation<Quote, CreateQuotePayload>({
      query: (quote) => ({
        url: '/about/quotes',
        method: 'POST',
        body: quote,
      }),
      invalidatesTags: ['Quotes', 'About'],
    }),
    updateQuote: builder.mutation<Quote, UpdateQuotePayload>({
      query: ({ id, ...quote }) => ({
        url: `/about/quotes/${id}`,
        method: 'PATCH',
        body: quote,
      }),
      invalidatesTags: ['Quotes', 'About'],
    }),
    deleteQuote: builder.mutation<void, string>({
      query: (id) => ({
        url: `/about/quotes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Quotes', 'About'],
    }),
  }),
});

export const {
  useGetAboutQuery,
  useCreateAboutMutation,
  useUpdateAboutMutation,
  useDeleteAboutMutation,
  useGetQuotesQuery,
  useGetRandomQuoteQuery,
  useCreateQuoteMutation,
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
} = aboutApiSlice;
