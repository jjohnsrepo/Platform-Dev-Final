import React, { createContext, useContext } from 'react';
import { useBooks as useBooksHook } from '@/hooks/useBooks';

type BooksContextType = ReturnType<typeof useBooksHook>;

const BooksContext = createContext<BooksContextType | null>(null);

export function BooksProvider({ children }: { children: React.ReactNode }) {
  const value = useBooksHook();
  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export function useBooksContext() {
  const ctx = useContext(BooksContext);
  if (!ctx) {
    throw new Error('useBooksContext must be used within a BooksProvider');
  }
  return ctx;
}
