import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error('User authentication error:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Starting account deletion for user: ${user.id}`)

    // Create a service role client for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Delete all related data in the correct order (respecting foreign key constraints)
    
    // 1. Delete user's votes
    console.log('Deleting post votes...')
    const { error: votesError } = await supabaseClient
      .from('post_votes')
      .delete()
      .eq('user_id', user.id)
    if (votesError) console.error('Error deleting votes:', votesError)

    // 2. Delete user's comments
    console.log('Deleting comments...')
    const { error: commentsError } = await supabaseClient
      .from('comments')
      .delete()
      .eq('user_id', user.id)
    if (commentsError) console.error('Error deleting comments:', commentsError)

    // 3. Delete user's posts
    console.log('Deleting posts...')
    const { error: postsError } = await supabaseClient
      .from('posts')
      .delete()
      .eq('user_id', user.id)
    if (postsError) console.error('Error deleting posts:', postsError)

    // 4. Delete community memberships
    console.log('Deleting community memberships...')
    const { error: memberError } = await supabaseClient
      .from('community_members')
      .delete()
      .eq('user_id', user.id)
    if (memberError) console.error('Error deleting memberships:', memberError)

    // 5. Delete communities created by user
    console.log('Deleting communities...')
    const { error: communitiesError } = await supabaseClient
      .from('communities')
      .delete()
      .eq('created_by', user.id)
    if (communitiesError) console.error('Error deleting communities:', communitiesError)

    // 6. Delete reviews (both given and received)
    console.log('Deleting reviews...')
    const { error: reviewsError } = await supabaseClient
      .from('reviews')
      .delete()
      .or(`reviewer_id.eq.${user.id},reviewee_id.eq.${user.id}`)
    if (reviewsError) console.error('Error deleting reviews:', reviewsError)

    // 7. Delete RSVPs
    console.log('Deleting RSVPs...')
    const { error: rsvpsError } = await supabaseClient
      .from('rsvps')
      .delete()
      .eq('user_id', user.id)
    if (rsvpsError) console.error('Error deleting RSVPs:', rsvpsError)

    // 8. Delete friendships
    console.log('Deleting friendships...')
    const { error: friendshipsError } = await supabaseClient
      .from('friendships')
      .delete()
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    if (friendshipsError) console.error('Error deleting friendships:', friendshipsError)

    // 9. Delete games hosted by user
    console.log('Deleting hosted games...')
    const { error: gamesError } = await supabaseClient
      .from('games')
      .delete()
      .eq('host_id', user.id)
    if (gamesError) console.error('Error deleting games:', gamesError)

    // 10. Delete user sports preferences
    console.log('Deleting user sports...')
    const { error: sportsError } = await supabaseClient
      .from('user_sports')
      .delete()
      .eq('user_id', user.id)
    if (sportsError) console.error('Error deleting sports:', sportsError)

    // 11. Delete user roles
    console.log('Deleting user roles...')
    const { error: rolesError } = await supabaseClient
      .from('user_roles')
      .delete()
      .eq('user_id', user.id)
    if (rolesError) console.error('Error deleting roles:', rolesError)

    // 12. Delete profile
    console.log('Deleting profile...')
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .delete()
      .eq('id', user.id)
    if (profileError) console.error('Error deleting profile:', profileError)

    // 13. Finally, delete the auth user (requires service role)
    console.log('Deleting auth user...')
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
    if (authError) {
      console.error('Error deleting auth user:', authError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete user account', details: authError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Successfully deleted account for user: ${user.id}`)

    return new Response(
      JSON.stringify({ success: true, message: 'Account and all data deleted successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
