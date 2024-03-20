import { writable } from 'svelte/store';
import { supabase } from './db';

export const user = writable(supabase.auth.session()?.user || null);

supabase.auth.onAuthStateChange((_event, session) => {
  user.set(session?.user || null);
});
