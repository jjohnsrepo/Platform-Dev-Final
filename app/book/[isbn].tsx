import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBooksContext } from '@/context/BooksContext';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';

export default function BookDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const { books, updateBook, error } = useBooksContext();

  const book = books.find((b) => b.isbn === isbn);

  const [notesDraft, setNotesDraft] = useState(book?.notes ?? '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingRead, setSavingRead] = useState(false);

  // Keep local notes in sync if the source book changes (e.g. after load)
  useEffect(() => {
    if (book) setNotesDraft(book.notes);
  }, [book?.notes]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isbn) return <Redirect href="/library" />;

  if (!book) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const notesDirty = notesDraft !== (book.notes ?? '');
  const isRead = book.isRead === true;

  async function handleToggleRead(value: boolean) {
    if (!book) return;
    setSavingRead(true);
    try {
      await updateBook(book.isbn, { isRead: value });
    } catch {
      // error is surfaced via context
    } finally {
      setSavingRead(false);
    }
  }

  async function handleSaveNotes() {
    if (!book) return;
    setSavingNotes(true);
    try {
      await updateBook(book.isbn, { notes: notesDraft });
    } catch {
      // error is surfaced via context
    } finally {
      setSavingNotes(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Book Details
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <View style={styles.hero}>
          {book.coverUrl ? (
            <Image source={{ uri: book.coverUrl }} style={styles.cover} contentFit="cover" />
          ) : (
            <View style={[styles.cover, styles.coverPlaceholder]}>
              <Ionicons name="book-outline" size={48} color={Colors.textMuted} />
            </View>
          )}
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>by {book.author}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.metaRow}>
            <Ionicons name="business-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.metaLabel}>Publisher</Text>
            <Text style={styles.metaValue} numberOfLines={1}>{book.publisher}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.metaLabel}>Published</Text>
            <Text style={styles.metaValue}>{book.publishDate}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="barcode-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.metaLabel}>ISBN</Text>
            <Text style={styles.metaValue}>{book.isbn}</Text>
          </View>
        </View>

        <Pressable
          onPress={() => handleToggleRead(!isRead)}
          disabled={savingRead}
          style={({ pressed }) => [
            styles.card,
            styles.readRow,
            pressed && styles.readRowPressed,
          ]}
        >
          <View style={styles.readLabelWrap}>
            <Ionicons
              name={isRead ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={isRead ? Colors.success : Colors.textMuted}
            />
            <View style={styles.readTextWrap}>
              <Text style={styles.readTitle}>Mark as read</Text>
              <Text style={styles.readSub}>
                {isRead ? 'You\u2019ve finished this book' : 'Tap to mark as read'}
              </Text>
            </View>
          </View>
          {savingRead ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <View style={[styles.readCheckbox, isRead && styles.readCheckboxOn]}>
              {isRead && <Ionicons name="checkmark" size={18} color={Colors.textOnPrimary} />}
            </View>
          )}
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Summary</Text>
          {book.description ? (
            <Text style={styles.description}>{book.description}</Text>
          ) : (
            <Text style={styles.emptyText}>No summary available for this book.</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={notesDraft}
            onChangeText={setNotesDraft}
            placeholder="Jot down your thoughts, quotes, or reflections…"
            placeholderTextColor={Colors.textMuted}
            multiline
            textAlignVertical="top"
          />
          <Pressable
            onPress={handleSaveNotes}
            disabled={!notesDirty || savingNotes}
            style={({ pressed }) => [
              styles.saveButton,
              (!notesDirty || savingNotes) && styles.saveButtonDisabled,
              pressed && notesDirty && !savingNotes && styles.saveButtonPressed,
            ]}
          >
            {savingNotes ? (
              <ActivityIndicator color={Colors.textOnPrimary} />
            ) : (
              <Text style={styles.saveButtonText}>
                {notesDirty ? 'Save Notes' : 'Saved'}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  cover: {
    width: 140,
    height: 210,
    borderRadius: Radius.md,
    backgroundColor: Colors.borderLight,
    ...Shadows.md,
  },
  coverPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  author: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    width: 80,
  },
  metaValue: {
    ...Typography.bodySmall,
    color: Colors.text,
    flex: 1,
  },
  readRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readRowPressed: {
    opacity: 0.6,
  },
  readLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  readTextWrap: {
    flex: 1,
  },
  readTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  readSub: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  readCheckbox: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readCheckboxOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  emptyText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  notesInput: {
    ...Typography.body,
    color: Colors.text,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    minHeight: 120,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.border,
  },
  saveButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.errorLight,
    padding: Spacing.md,
    borderRadius: Radius.sm,
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.error,
    flex: 1,
  },
});
