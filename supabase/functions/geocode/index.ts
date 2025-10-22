import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const US_STATE_MAP: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address, city, state, zipCode } = await req.json();
    
    console.log('Geocoding request:', { address, city, state, zipCode });

    if (!address || !city || !state || !zipCode) {
      throw new Error('Missing required fields: address, city, state, zipCode');
    }

    // Get full state name
    const stateName = US_STATE_MAP[state.toUpperCase()] || state;
    console.log('State mapping:', state, '->', stateName);

    // Try structured query first
    const structuredUrl = `https://nominatim.openstreetmap.org/search?` +
      `street=${encodeURIComponent(address)}&` +
      `city=${encodeURIComponent(city)}&` +
      `state=${encodeURIComponent(stateName)}&` +
      `postalcode=${encodeURIComponent(zipCode)}&` +
      `country=USA&format=json&limit=1`;

    console.log('Structured query URL:', structuredUrl);

    let response = await fetch(structuredUrl, {
      headers: {
        'User-Agent': 'SquadUp/1.0 (support@squadup.app)',
        'Accept': 'application/json',
        'Referer': 'https://squadup.app'
      },
    });

    console.log('API response status:', response.status);

    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a minute.');
    }

    if (!response.ok && response.status !== 404) {
      throw new Error(`Geocoding service error: ${response.status}`);
    }

    let data = await response.json();
    console.log('Structured query response:', data);

    // If structured query fails, try full-text search
    if (!data || data.length === 0) {
      console.log('Structured query failed, trying full-text search...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const fullAddress = `${address}, ${city}, ${stateName} ${zipCode}, USA`;
      const fullTextUrl = `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(fullAddress)}&format=json&limit=1`;

      console.log('Full-text query URL:', fullTextUrl);

      response = await fetch(fullTextUrl, {
        headers: {
          'User-Agent': 'SquadUp/1.0 (support@squadup.app)',
          'Accept': 'application/json',
          'Referer': 'https://squadup.app'
        },
      });

      if (!response.ok) {
        throw new Error(`Geocoding service error: ${response.status}`);
      }

      data = await response.json();
      console.log('Full-text query response:', data);
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Could not find coordinates for this address. Please verify the address is correct.'
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const result = {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };

    console.log('Geocoding successful:', result);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Geocoding error:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to geocode address'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
