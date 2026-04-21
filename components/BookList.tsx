import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Book } from '@/types';
import BookCard from './BookCard';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface BookListProps {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  onPressBook?: (isbn: string) => void;
  onDeleteBook?: (isbn: string) => void;
}

export default function BookList({ books, isLoading, error, onPressBook, onDeleteBook }: BookListProps) {
  if (isLoading && books.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your library...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View style={styles.center}>
        <View style={styles.emptyIcon}>
          <Ionicons name="library-outline" size={56} color={Colors.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>Your shelf is empty</Text>
        <Text style={styles.emptySubtext}>
          Tap the scan button to add your first book
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.isbn}
      renderItem={({ item }) => <BookCard book={item} onPress={onPressBook} onDelete={onDeleteBook} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
    gap: Spacing.sm,
  },
  loadingText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  emptyIcon: {
    marginBottom: Spacing.sm,
    opacity: 0.6,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.text,
  },
  emptySubtext: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  list: {
    paddingVertical: Spacing.sm,
    paddingBottom: 100,
  },
});
