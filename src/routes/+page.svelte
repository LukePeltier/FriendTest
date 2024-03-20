<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Logout from '$lib/Logout.svelte';
  import type { Profile } from '$lib/types.js';
  import { writable } from 'svelte/store';
  // call getSession from hooks

  export let data;
  let { supabase, session } = data;
  $: ({ supabase } = data);
  //Profile store
  let profile = writable<Profile | null>(null);

  onMount(async () => {
    if (!session) {
      goto('/login');
    } else {
      let user = (await supabase.auth.getUser()).data.user;
      if (user === null) {
        goto('/login');
        return;
      }
      // get corresponding profile

      let { data: result, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single<Profile>();

      if (error) {
        console.error(error);
      } else {
        $profile = result;
      }
    }
  });

  // Get user name
</script>

{#if $profile === null}
  <p>Loading...</p>
{:else}
  <div class="profile-card card card-side w-64 border border-primary bg-base-300 shadow-xl">
    <div class="avatar">
      <div class="m-2 h-16 w-16 rounded-full">
        <img src={$profile.avatar} alt="Discord avatar" />
      </div>
    </div>
    <div class="flex flex-col">
      <h2 class="card-title m-2">{$profile.name}</h2>
      <div class="m-2">
        <Logout {supabase} />
      </div>
    </div>
  </div>
  <div class="flex h-screen items-center justify-center">
    <button class="btn btn-primary btn-lg">
      {#if $profile.host}
        Provide host answers
      {:else}
        Answer quiz
      {/if}
    </button>
  </div>
{/if}

<style>
  .profile-card {
    position: fixed;
    top: 10px;
    right: 10px;
  }
</style>
