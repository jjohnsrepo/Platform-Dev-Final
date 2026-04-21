import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export default function CreateAccount() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const { signup, confirmSignUp, login } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  async function handleCreateAccount() {
    if (!email.trim() || !username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await signup(email, password, username);
      if (result.needsConfirmation) {
        setNeedsConfirmation(true);
      } else {
        // Auto-confirmed — sign in directly
        await login(email, password);
        router.replace('/library');
      }
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? String(e);
      console.error('Signup error:', e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!confirmCode.trim()) {
      setError('Please enter the verification code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await confirmSignUp(email, confirmCode);
      await login(email, password);
      router.replace('/library');
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? String(e);
      console.error('Confirm error:', e);
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
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>

        <View style={styles.headerSection}>
          <Text style={styles.title}>
            {needsConfirmation ? 'Verify Email' : 'Create Account'}
          </Text>
          <Text style={styles.subtitle}>
            {needsConfirmation
              ? 'Enter the code sent to your email'
              : 'Start building your personal library'}
          </Text>
        </View>

        <View style={styles.formSection}>
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {needsConfirmation ? (
            <>
              <View style={styles.inputWrapper}>
                <Ionicons name="keypad-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Verification code"
                  placeholderTextColor={Colors.textMuted}
                  value={confirmCode}
                  onChangeText={setConfirmCode}
                  keyboardType="number-pad"
                  autoComplete="one-time-code"
                />
              </View>

              <Pressable
                style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
                onPress={handleConfirm}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.textOnPrimary} />
                ) : (
                  <Text style={styles.primaryButtonText}>Verify & Sign In</Text>
                )}
              </Pressable>
            </>
          ) : (
            <>
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
                <Ionicons name="person-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor={Colors.textMuted}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoComplete="username"
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
                  autoComplete="new-password"
                />
              </View>

              <Pressable
                style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
                onPress={handleCreateAccount}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.textOnPrimary} />
                ) : (
                  <Text style={styles.primaryButtonText}>Create Account</Text>
                )}
              </Pressable>
            </>
          )}

          <Pressable style={styles.linkRow} onPress={() => router.back()}>
            <Text style={styles.linkText}>Already have an account? </Text>
            <Text style={styles.linkAction}>Sign In</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  backButton: {
    position: 'absolute',
    top: Spacing.md,
    left: 0,
    padding: Spacing.sm,
  },
  headerSection: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
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
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  linkText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  linkAction: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
});
