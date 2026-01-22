'use client';

import { useState, useEffect } from 'react';
import { usePDFStore } from '@/store/usePDFStore';
import { getPDFPath } from '@/lib/pdf-utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure worker locally
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PDFViewer() {
  const { documentId, currentPage, totalPages, zoom, isOpen, navigateToPage, closePDF, setTotalPages, setZoom } = usePDFStore();
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pdfPath = documentId ? getPDFPath(documentId) : null;

  // Reset loading/error/state when viewer is closed
  useEffect(() => {
    if (!isOpen) {
      setLoading(true);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    setLoading(true);
    setError(null);
  }, [documentId]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    console.log('=== PDF Load Success ===, pages:', numPages);
    setNumPages(numPages);
    setTotalPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('=== PDF Load Error ===', error);
    setError(`Failed to load PDF: ${error.message}`);
    setLoading(false);
  }

  if (!isOpen || !pdfPath) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-neutral-900/50 border-l border-red-900/20 backdrop-blur-sm">
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 border-b border-red-900/20 bg-gradient-to-r from-neutral-900/80 to-neutral-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigateToPage(Math.max(1, currentPage - 1))} disabled={currentPage <= 1} className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-neutral-400 font-mono min-w-[80px] text-center">
            {numPages > 0 ? `${currentPage} / ${numPages}` : '...'}
          </span>
          <Button variant="ghost" size="icon" onClick={() => navigateToPage(Math.min(numPages, currentPage + 1))} disabled={currentPage >= numPages} className="h-8 w-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="h-8 w-8">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-neutral-500 font-mono min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" onClick={() => setZoom(Math.min(2.0, zoom + 0.1))} className="h-8 w-8">
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={closePDF} className="h-8 w-8 text-red-400 hover:text-red-300">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto p-4 flex items-start justify-center bg-neutral-950/30">
        {loading && (
          <div className="w-full max-w-2xl absolute z-10">
            <div className="bg-neutral-900/50 border border-red-900/20 rounded-lg p-8 animate-pulse">
               <div className="flex items-center justify-center h-64 gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-red-900/30 border-t-red-500 animate-spin glow-red" />
                <p className="text-sm text-neutral-400">Loading PDF...</p>
              </div>
            </div>
          </div>
        )}
        
        {error ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-red-400">
            <p className="text-sm">{error}</p>
            <Button variant="secondary" size="sm" onClick={closePDF}>Close</Button>
          </div>
        ) : (
          <Document
            file={pdfPath}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            className="shadow-2xl"
          >
            <Page
              pageNumber={currentPage}
              scale={zoom}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-lg border border-neutral-800"
            />
          </Document>
        )}
      </div>
    </div>
  );
}
