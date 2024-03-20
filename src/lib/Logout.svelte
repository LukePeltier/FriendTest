<script lang="ts">
  import { goto } from '$app/navigation';
  import type { SupabaseClient } from '@supabase/supabase-js';

  export let supabase: SupabaseClient;

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      goto('/login');
    }
  }
</script>

<button on:click={signOut}>Logout</button>
