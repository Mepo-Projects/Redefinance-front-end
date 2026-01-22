export interface Citation {
  id: string;
  text: string;
  sourceId: string;
  pageNumber?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: number;
  isThinking?: boolean;
}
