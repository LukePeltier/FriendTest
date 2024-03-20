<script lang="ts">
  import Auth from '$lib/Auth.svelte';

  export let data;
  let { supabase } = data;
  $: ({ supabase } = data);
</script>

<Auth {supabase} />
