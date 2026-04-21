import { useCallback, useState } from 'react';
import { Book, BookUpdate } from '@/types';
import bookService from '@/services/bookService';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookService.getBooks();
      setBooks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load books');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addBook = useCallback(async (isbn: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const book = await bookService.addBook(isbn);
      setBooks((prev) => [...prev, book]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add book');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteBook = useCallback(async (isbn: string) => {
    setError(null);
    try {
      await bookService.deleteBook(isbn);
      setBooks((prev) => prev.filter((b) => b.isbn !== isbn));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete book');
    }
  }, []);

  const updateBook = useCallback(async (isbn: string, patch: BookUpdate) => {
    setError(null);
    // Optimistic update — revert if the request fails
    let prevSnapshot: Book[] = [];
    setBooks((prev) => {
      prevSnapshot = prev;
      return prev.map((b) => (b.isbn === isbn ? { ...b, ...patch } : b));
    });
    try {
      const updated = await bookService.updateBook(isbn, patch);
      setBooks((prev) => prev.map((b) => (b.isbn === isbn ? updated : b)));
      return updated;
    } catch (e) {
      setBooks(prevSnapshot);
      setError(e instanceof Error ? e.message : 'Failed to update book');
      throw e;
    }
  }, []);

  return { books, isLoading, error, loadBooks, addBook, deleteBook, updateBook };
}
