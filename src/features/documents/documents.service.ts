import { apiClient } from '@/lib/api';

export interface Document {
  document_id: string;
  company_name: string;
  company_ticker?: string;
  fiscal_year?: number;
  available_years?: number[];
  available_fields_count?: number;
  available_text_sections?: string[];
}

export const documentService = {
  getAll: async (): Promise<Document[]> => {
    const response = await apiClient<any>('/documents');
    console.log('=== Documents API Response ===', response);
    
    let docs: Document[] = [];
    if (Array.isArray(response)) docs = response;
    else if (response && Array.isArray(response.documents)) docs = response.documents;
    
    // Patch: Fix missing years based on ID if possible
    return docs.map(doc => {
      // If doc_id contains 2023 but year says differently (or is missing), fix it
      if (doc.document_id.includes('2023') && doc.fiscal_year !== 2023) {
        return { ...doc, fiscal_year: 2023 };
      }
      if (doc.document_id.includes('2024') && doc.fiscal_year !== 2024) {
        return { ...doc, fiscal_year: 2024 };
      }
      return doc;
    });
  },
};
