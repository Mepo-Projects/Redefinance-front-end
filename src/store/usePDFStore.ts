import { create } from 'zustand';

interface PDFState {
  isOpen: boolean;
  documentId: string | null;
  currentPage: number;
  totalPages: number;
  zoom: number;
  openPDF: (docId: string, page: number) => void;
  navigateToPage: (page: number) => void;
  closePDF: () => void;
  setTotalPages: (total: number) => void;
  setZoom: (zoom: number) => void;
  resetPDF: () => void;
}

export const usePDFStore = create<PDFState>((set) => ({
  isOpen: false,
  documentId: null,
  currentPage: 1,
  totalPages: 0,
  zoom: 1.0,
  
  openPDF: (docId: string, page: number) => set({ 
    isOpen: true, 
    documentId: docId, 
    currentPage: page 
  }),
  
  navigateToPage: (page: number) => set({ currentPage: page }),
  
  closePDF: () => set({ 
    isOpen: false, 
    documentId: null, 
    currentPage: 1 
  }),
  
  setTotalPages: (total: number) => set({ totalPages: total }),
  
  resetPDF: () => set({
    isOpen: false,
    documentId: null,
    currentPage: 1,
    totalPages: 0,
    zoom: 1.0,
  }),
}));
