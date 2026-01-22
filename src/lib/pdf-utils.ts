/**
 * Maps document identifiers from citations to actual PDF filenames
 * Future: This will be replaced by backend API calls
 */

const DOCUMENT_MAP: Record<string, string> = {
  // Company name + year format (what backend returns in citations)
  'Македонски Телеком АД – Скопје, 2024': '/docs/3.1_MKT IFRS Finansiski Izvestai 2024 so revizorsko mislenje.pdf',
  'Македонски Телеком АД – Скопје, 2023': '/docs/3.1_MKT IFRS Finansiski Izvestai 2023 so revizorsko mislenje.pdf',
  
  // Format appearing in latest logs (no comma before year)
  'Македонски Телеком АД – Скопје 2024': '/docs/3.1_MKT IFRS Finansiski Izvestai 2024 so revizorsko mislenje.pdf',
  'Македонски Телеком АД – Скопје 2023': '/docs/3.1_MKT IFRS Finansiski Izvestai 2023 so revizorsko mislenje.pdf',
  
  // Without "Скопје" (alternative format)
  'Македонски Телеком АД, 2024': '/docs/3.1_MKT IFRS Finansiski Izvestai 2024 so revizorsko mislenje.pdf',
  'Македонски Телеком АД, 2023': '/docs/3.1_MKT IFRS Finansiski Izvestai 2023 so revizorsko mislenje.pdf',
  
  // Legacy formats (keep for backward compatibility)
  '3.1_MKT IFRS Финансиски Извештаи 2024 со ревизорско мислење': '/docs/3.1_MKT IFRS Finansiski Izvestai 2024 so revizorsko mislenje.pdf',
  '3.1_MKT IFRS Финансиски Извештаи 2023 со ревизорско мислење': '/docs/3.1_MKT IFRS Finansiski Izvestai 2023 so revizorsko mislenje.pdf',
};

/**
 * Extracts document ID from citation text
 * Format: Извор: [Title, стр. Page] OR Извор: [Title, Year, стр. Page]
 */
export function extractDocumentFromCitation(citationText: string): { documentId: string | null, pageNumber: number | null } {
  // Match pattern with optional year: (?:,\s*\d{4})?
  const match = citationText.match(/(?:Извор:\s*)?\[([^,\]]+)(?:,\s*\d{4})?,\s*(?:стр\.|p\.)\s*(\d+)\]/i);
  
  if (!match) {
    return { documentId: null, pageNumber: null };
  }
  
  const title = match[1].trim();
  const pageNumber = parseInt(match[2], 10);
  
  return { 
    documentId: title, 
    pageNumber 
  };
}

/**
 * Gets the PDF file path for a given document ID
 */
export function getPDFPath(documentId: string): string | null {
  const path = DOCUMENT_MAP[documentId] || null;
  return path ? encodeURI(path) : null;
}

/**
 * Checks if a PDF exists for the given document ID
 */
export function hasPDF(documentId: string): boolean {
  return documentId in DOCUMENT_MAP;
}
