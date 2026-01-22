import { apiClient } from '@/lib/api';

export interface CreateSessionResponse {
  session_id: string;
}

export const sessionService = {
  create: (documentIds: string[]) => 
    apiClient<CreateSessionResponse>('/session/create', {
      method: 'POST',
      body: JSON.stringify({ document_ids: documentIds }),
    }),
    
  delete: (sessionId: string) =>
    apiClient<void>(`/session/${sessionId}`, {
      method: 'DELETE',
    }),
};
