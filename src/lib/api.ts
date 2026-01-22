const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...init } = options;
  
  // Construct URL carefully handling leading slashes
  const baseUrl = API_BASE_URL.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${baseUrl}${path}`, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
    ...init,
  });

  if (!response.ok) {
    // Attempt to parse error message from JSON
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Ignore json parse error
    }
    
    throw new ApiError(response.status, errorMessage);
  }

  return response.json();
}
