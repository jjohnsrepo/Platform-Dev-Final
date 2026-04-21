export interface Book {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishDate: string;
  coverUrl: string;
  description: string;
  isRead: boolean;
  notes: string;
  addedAt: string;
}

export type BookUpdate = Partial<Pick<Book, 'isRead' | 'notes'>>;
