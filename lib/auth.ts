import {
  signUp,
  signIn,
  signOut,
  confirmSignUp,
  getCurrentUser,
  fetchAuthSession,
} from 'aws-amplify/auth';

export async function registerUser(email: string, password: string, name: string) {
  const { nextStep } = await signUp({
    username: email,
    password,
    options: {
      userAttributes: { email, name },
    },
  });
  return nextStep;
}

export async function confirmEmail(email: string, code: string) {
  const { nextStep } = await confirmSignUp({
    username: email,
    confirmationCode: code,
  });
  return nextStep;
}

export async function loginUser(email: string, password: string) {
  const { nextStep } = await signIn({ username: email, password });
  return nextStep; // signInStep === 'DONE' means success
}

export async function logoutUser() {
  await signOut();
}

export async function getUser() {
  try {
    return await getCurrentUser();
  } catch {
    return null;
  }
}

export async function getJwtToken() {
  const session = await fetchAuthSession();
  return session.tokens?.accessToken?.toString();
}