import { TResponseRedux } from '@/types/global.type';
import { baseApi } from '../../api/baseApi';

export type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  profileId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type UpdateContactPayload = Partial<CreateContactPayload> & {
  id: string;
};

export const contactBaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<Contact[], void>({
      query: () => '/contacts',
      transformResponse: (response: TResponseRedux<Contact[]>) =>
        response.data || [],
      providesTags: ['Contact'],
    }),
    getContact: builder.query<Contact, string>({
      query: (id) => `/contacts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Contact', id }],
    }),
    createContact: builder.mutation<Contact, CreateContactPayload>({
      query: (contact) => ({
        url: '/contacts',
        method: 'POST',
        body: contact,
      }),
      invalidatesTags: ['Contact'],
    }),
    updateContact: builder.mutation<Contact, UpdateContactPayload>({
      query: ({ id, ...contact }) => ({
        url: `/contacts/${id}`,
        method: 'PATCH',
        body: contact,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Contact', id }],
    }),
    deleteContact: builder.mutation<void, string>({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
});

export const {
  useGetContactsQuery,
  useGetContactQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactBaseApi;
