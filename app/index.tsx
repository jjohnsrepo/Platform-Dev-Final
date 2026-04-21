import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, isLoading, login } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/library" />;
  }

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/library');
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? String(e);
      console.error('Login error:', e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.brandSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="book" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.appName}>BookShelf</Text>
          <Text style={styles.tagline}>Your personal library</Text>
        </View>

        <View style={styles.formSection}>
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoComplete="password"
            />
          </View>

          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.textOnPrimary} />
            ) : (
              <Text style={styles.primaryButtonText}>Sign In</Text>
            )}
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            onPress={() => router.push('/createAccount')}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  appName: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  tagline: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  formSection: {
    gap: Spacing.md,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.sm,
    ...Shadows.sm,
  },
  primaryButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  secondaryButton: {
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    ...Typography.button,
    color: Colors.primary,
  },
});
