<script lang="ts">
  import type { SupabaseClient } from '@supabase/supabase-js';

  export let supabase: SupabaseClient;
  async function signInWithDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: 'http://localhost:5173/auth/callback'
      }
    });
  }
</script>

<button on:click={signInWithDiscord} class="discord-button"> Sign in with Discord </button>

<style>
  .discord-button {
    background-color: #7289da;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 16px;
  }

  .discord-button:hover {
    background-color: #5865f2;
  }

  .discord-logo {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
</style>
