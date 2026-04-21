import { fetchAuthSession } from 'aws-amplify/auth';
import { Book, BookUpdate } from '@/types';

const API_URL = process.env.EXPO_PUBLIC_API_GATEWAY_URL!;

async function getIdToken(): Promise<string> {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  if (!token) throw new Error('Not authenticated');
  return token;
}

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res;
}

const bookService = {
  async getBooks(): Promise<Book[]> {
    const res = await apiFetch('/books');
    const data = await res.json();
    return (data.books ?? []) as Book[];
  },

  async addBook(isbn: string): Promise<Book> {
    const res = await apiFetch('/books', {
      method: 'POST',
      body: JSON.stringify({ isbn }),
    });
    const data = await res.json();
    if (!data.book) throw new Error(data.error ?? 'addBook: unexpected response from server');
    return data.book as Book;
  },

  async deleteBook(isbn: string): Promise<void> {
    await apiFetch(`/books/${isbn}`, { method: 'DELETE' });
  },

  async updateBook(isbn: string, patch: BookUpdate): Promise<Book> {
    const res = await apiFetch(`/books/${isbn}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (!data.book) throw new Error(data.error ?? 'updateBook: unexpected response from server');
    return data.book as Book;
  },
};

export default bookService;
