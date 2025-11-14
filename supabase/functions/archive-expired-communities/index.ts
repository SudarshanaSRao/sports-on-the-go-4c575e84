import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting archive-expired-communities function');

    // Get all communities linked to games
    const { data: communities, error: communitiesError } = await supabase
      .from('communities')
      .select('id, game_id, archived')
      .not('game_id', 'is', null)
      .eq('archived', false);

    if (communitiesError) {
      console.error('Error fetching communities:', communitiesError);
      throw communitiesError;
    }

    console.log(`Found ${communities?.length || 0} active game-linked communities`);

    if (!communities || communities.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No active game-linked communities to process',
          archived: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all games for the communities
    const gameIds = communities.map(c => c.game_id).filter(Boolean);
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('id, game_date, start_time')
      .in('id', gameIds);

    if (gamesError) {
      console.error('Error fetching games:', gamesError);
      throw gamesError;
    }

    console.log(`Found ${games?.length || 0} games`);

    // Determine which communities should be archived
    const now = new Date();
    const communitiesToArchive: string[] = [];

    communities.forEach(community => {
      const game = games?.find(g => g.id === community.game_id);
      if (game) {
        // Combine date and time to create game datetime
        const gameDateTime = new Date(`${game.game_date}T${game.start_time}`);
        
        // Archive if game is in the past
        if (gameDateTime < now) {
          communitiesToArchive.push(community.id);
        }
      }
    });

    console.log(`Archiving ${communitiesToArchive.length} communities`);

    if (communitiesToArchive.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No communities need archiving',
          archived: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Archive the communities
    const { error: updateError } = await supabase
      .from('communities')
      .update({ 
        archived: true, 
        archived_at: now.toISOString() 
      })
      .in('id', communitiesToArchive);

    if (updateError) {
      console.error('Error archiving communities:', updateError);
      throw updateError;
    }

    console.log(`Successfully archived ${communitiesToArchive.length} communities`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Archived ${communitiesToArchive.length} expired game communities`,
        archived: communitiesToArchive.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in archive-expired-communities:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
