import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
  const {
    url,
    locals: { supabase, getSession }
  } = event;
  const code = url.searchParams.get('code') as string;
  const next = url.searchParams.get('next') ?? '/';

  if (code) {
    console.log('Received code');
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if a profile already exists for the user
      const user = (await getSession())?.user;
      if (user == undefined) {
        throw redirect(303, '/auth/auth-code-error');
      }
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id ?? '')
        .maybeSingle();

      console.log('profile', profile);

      // If no profile exists, create a new one
      if (profile == null && !profileError) {
        const { data: data, error: insertError } = await supabase
          .from('profiles')
          .insert([
            { id: user.id, name: user.user_metadata?.name, avatar: user.user_metadata?.picture }
          ]);

        if (insertError) {
          console.error('Error creating profile:', insertError);
        }

        console.log('Profile created:', data);
      }

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw redirect(303, '/auth/auth-code-error');
      }
      throw redirect(303, `/${next.slice(1)}`);
    }
  }

  // return the user to an error page with instructions
  throw redirect(303, '/auth/auth-code-error');
};
