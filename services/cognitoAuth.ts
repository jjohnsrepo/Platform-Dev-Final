import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  signOut as amplifySignOut,
  getCurrentUser,
  fetchUserAttributes,
  confirmSignUp as amplifyConfirmSignUp,
} from 'aws-amplify/auth';
import { User } from '@/types';

/** Sign in with email + password. Returns User on success. */
export async function cognitoSignIn(email: string, password: string): Promise<User> {
  await amplifySignIn({
    username: email,
    password,
    options: { authFlowType: 'USER_PASSWORD_AUTH' },
  });
  return getAuthenticatedUser();
}

/** Create new account. Returns { needsConfirmation } so UI can prompt for code. */
export async function cognitoSignUp(
  email: string,
  password: string,
  username: string,
): Promise<{ needsConfirmation: boolean }> {
  const { nextStep } = await amplifySignUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
        preferred_username: username,
      },
    },
  });
  return { needsConfirmation: nextStep.signUpStep === 'CONFIRM_SIGN_UP' };
}

/** Confirm sign-up with verification code */
export async function cognitoConfirmSignUp(email: string, code: string): Promise<void> {
  await amplifyConfirmSignUp({ username: email, confirmationCode: code });
}

/** Sign out — clears Amplify session */
export async function cognitoSignOut(): Promise<void> {
  await amplifySignOut();
}

/** Get current authenticated user (session restore on app launch) */
export async function cognitoGetCurrentUser(): Promise<User | null> {
  try {
    await getCurrentUser();
    return getAuthenticatedUser();
  } catch {
    return null;
  }
}

/** Fetch user attributes and build User object */
async function getAuthenticatedUser(): Promise<User> {
  const { userId } = await getCurrentUser();
  const attrs = await fetchUserAttributes();
  return {
    id: userId,
    email: attrs.email ?? '',
    username: attrs.preferred_username ?? attrs.email ?? '',
  };
}
