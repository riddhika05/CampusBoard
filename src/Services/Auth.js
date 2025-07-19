import { supabase } from '../supabaseClient';

// Sign up with email & password
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

// Log in with email & password
export const logIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Log out
export const logOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Get current session (if needed)
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
};
