import { apiClient } from './client';
import type { ApiResponse, ContactRequest, ContactResponse } from '@/types';

// Mirrors ContactController (/api/contacts)
export const contactApi = {
  addContact: (payload: ContactRequest) =>
    apiClient.post<ApiResponse<ContactResponse>>('/contacts', payload).then((r) => r.data),

  getMyContacts: () =>
    apiClient.get<ApiResponse<ContactResponse[]>>('/contacts').then((r) => r.data),

  getContactById: (id: number) =>
    apiClient.get<ApiResponse<ContactResponse>>(`/contacts/${id}`).then((r) => r.data),

  updateContact: (id: number, payload: ContactRequest) =>
    apiClient.put<ApiResponse<ContactResponse>>(`/contacts/${id}`, payload).then((r) => r.data),

  deleteContact: (id: number) =>
    apiClient.delete<ApiResponse<string>>(`/contacts/${id}`).then((r) => r.data),
};
