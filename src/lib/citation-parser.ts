import { Citation } from '@/features/chat/chat.types';

export function parseCitations(text: string): { displayText: string, citations: Citation[] } {
  console.log('=== Citation Parser Input ===');
  console.log('Text to parse:', text);
  
  // Regex matches both formats:
  // 1. Извор: [Title, стр. Number]
  // 2. Извор: [Title, Year, стр. Number]
  // Year is optional: (?:,\s*\d{4})?
  const regex = /(?:Извор:\s*)?\[([^,\]]+)(?:,\s*(\d{4}))?,\s*(?:стр\.|p\.)\s*(\d+)(?:-\d+)?\]/gi;
  const citations: Citation[] = [];
  
  const displayText = text.replace(regex, (match, sourceId, year, page) => {
    console.log('=== Citation Match Found ===');
    console.log('Full match:', match);
    console.log('Source ID:', sourceId);
    console.log('Year (optional):', year);
    console.log('Page:', page);
    
    const id = Math.random().toString(36).substring(7);
    
    // Combine sourceId with year if present for document mapping
    const documentKey = year ? `${sourceId.trim()}, ${year}` : sourceId.trim();
    
    console.log('Document key for mapping:', documentKey);
    
    citations.push({
      id,
      text: match,  // Full citation text for extraction later
      sourceId: documentKey,  // Use combined key for document lookup
      pageNumber: parseInt(page, 10),
    });
    
    // Replace with a marker that the MessageBubble can detect
    return `[[CITATION:${id}]]`;
  });
  
  console.log('=== Citation Parser Output ===');
  console.log('Citations array:', citations);
  console.log('Display text:', displayText);
  
  return { displayText, citations };
}
