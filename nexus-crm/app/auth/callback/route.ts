import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    console.error('[auth/callback] No code parameter received');
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const supabase = (await createClient()) as any;

  // Step 1: Exchange code for session
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error('[auth/callback] exchangeCodeForSession failed:', exchangeError.message);
    return NextResponse.redirect(`${origin}/login?error=exchange_failed`);
  }

  // Step 2: Get authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('[auth/callback] getUser failed:', userError?.message ?? 'no user');
    return NextResponse.redirect(`${origin}/login?error=user_not_found`);
  }

  console.log('[auth/callback] User authenticated:', user.email);

  // Step 3: Check/create profile
  try {
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const role = user.email === superAdminEmail ? 'super_admin' : 'client';

    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('[auth/callback] Profile lookup error:', profileError.message);
      // Profile lookup failed but auth succeeded — continue to redirect
      // The trigger may have already created the profile
    } else if (!existingProfile) {
      console.log('[auth/callback] Creating new profile for:', user.email, 'with role:', role);
      const profileData: any = {
        id: user.id,
        email: user.email ?? '',
        full_name:
          user.user_metadata?.full_name ??
          user.email?.split('@')[0] ??
          'User',
        avatar_url: user.user_metadata?.avatar_url ?? null,
        role,
        phone: null,
      };
      const { error: insertError } = await supabase.from('profiles').insert(profileData);

      if (insertError) {
        console.error('[auth/callback] Profile insert error:', insertError.message);
        // The database trigger may have already created it — continue anyway
      } else {
        console.log('[auth/callback] Profile created successfully');
      }
    } else {
      console.log('[auth/callback] Existing profile found for:', user.email, 'role:', existingProfile.role);
      // Upgrade to super_admin if needed
      if (user.email === superAdminEmail && existingProfile.role !== 'super_admin') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'super_admin' })
          .eq('id', user.id);

        if (updateError) {
          console.error('[auth/callback] Role upgrade error:', updateError.message);
        } else {
          console.log('[auth/callback] Role upgraded to super_admin');
        }
      }
    }
  } catch (err) {
    console.error('[auth/callback] Profile creation threw:', err);
    // Auth still succeeded, don't block the user
  }

  // Step 4: Redirect to dashboard
  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';

  const redirectUrl = isLocalEnv
    ? `${origin}${next}`
    : forwardedHost
      ? `https://${forwardedHost}${next}`
      : `${origin}${next}`;

  console.log('[auth/callback] Redirecting to:', redirectUrl);
  return NextResponse.redirect(redirectUrl);
}
