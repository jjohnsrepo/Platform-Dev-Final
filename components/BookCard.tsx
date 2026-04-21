import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Book } from '@/types';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';

interface BookCardProps {
  book: Book;
  onPress?: (isbn: string) => void;
  onDelete?: (isbn: string) => void;
}

export default function BookCard({ book, onPress, onDelete }: BookCardProps) {
  return (
    <Pressable
      onPress={() => onPress?.(book.isbn)}
      style={({ pressed }) => [styles.card, pressed && onPress && styles.cardPressed]}
      disabled={!onPress}
    >
      <Image source={{ uri: book.coverUrl }} style={styles.cover} contentFit="cover" />
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
          {book.isRead && (
            <View style={styles.readBadge}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
              <Text style={styles.readText}>Read</Text>
            </View>
          )}
        </View>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="business-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.meta} numberOfLines={1}>{book.publisher}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.meta}>{book.publishDate}</Text>
        </View>
      </View>
      {onDelete && (
        <Pressable
          onPress={() => onDelete(book.isbn)}
          style={({ pressed }) => [styles.deleteButton, pressed && styles.deletePressed]}
          hitSlop={8}
        >
          <Ionicons name="trash-outline" size={20} color={Colors.error} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    ...Shadows.sm,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },
  cover: {
    width: 70,
    height: 105,
    borderRadius: Radius.sm,
    backgroundColor: Colors.borderLight,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: 2,
  },
  title: {
    ...Typography.h3,
    color: Colors.text,
    flex: 1,
  },
  readBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: Colors.successLight,
    borderRadius: Radius.sm,
  },
  readText: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: '600',
  },
  author: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
    flex: 1,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: Spacing.sm,
    width: 40,
  },
  deletePressed: {
    opacity: 0.5,
  },
});
