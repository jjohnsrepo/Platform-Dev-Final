import { Ionicons } from '@expo/vector-icons';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BookList from '@/components/BookList';
import { useAuth } from '@/hooks/useAuth';
import { useBooksContext } from '@/context/BooksContext';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';

export default function Library() {
  const router = useRouter();
  const { result } = useLocalSearchParams<{ result?: string }>();
  const { user, logout } = useAuth();
  const { books, isLoading, error, loadBooks, addBook, deleteBook } = useBooksContext();
  const processedIsbn = useRef<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    if (result && result !== processedIsbn.current) {
      processedIsbn.current = result;
      addBook(result);
    }
  }, [result, addBook]);

  if (!user) {
    return <Redirect href="/" />;
  }

  async function handleLogout() {
    await logout();
    router.replace('/');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user.username}</Text>
          <Text style={styles.bookCount}>
            {books.length} {books.length === 1 ? 'book' : 'books'} in your library
          </Text>
        </View>
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutPressed]}
          hitSlop={8}
        >
          <Ionicons name="log-out-outline" size={22} color={Colors.textSecondary} />
        </Pressable>
      </View>

      <BookList
        books={books}
        isLoading={isLoading}
        error={error}
        onPressBook={(isbn) => router.push(`/book/${isbn}`)}
        onDeleteBook={deleteBook}
      />

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => router.navigate('/scanner')}
      >
        <Ionicons name="scan" size={28} color={Colors.textOnPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  greeting: {
    ...Typography.h2,
    color: Colors.text,
  },
  bookCount: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: 2,
  },
  logoutButton: {
    padding: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.borderLight,
  },
  logoutPressed: {
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  fabPressed: {
    backgroundColor: Colors.primaryDark,
    transform: [{ scale: 0.95 }],
  },
});
