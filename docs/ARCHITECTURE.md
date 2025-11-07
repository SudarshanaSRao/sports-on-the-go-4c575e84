# Architecture Documentation

Technical architecture and design decisions for SquadUp.

## Table of Contents
- [System Overview](#system-overview)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Design](#database-design)
- [Security Architecture](#security-architecture)
- [API Design](#api-design)

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Application                    │
│                  (React + TypeScript)                    │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Pages   │  │Components│  │  Hooks   │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │             │             │                     │
│       └─────────────┴─────────────┘                     │
│                     │                                   │
│              ┌──────▼──────┐                           │
│              │   Context   │                           │
│              └──────┬──────┘                           │
│                     │                                   │
└─────────────────────┼───────────────────────────────────┘
                      │
                      │ HTTPS/WebSocket
                      │
┌─────────────────────▼───────────────────────────────────┐
│                Lovable Cloud / Supabase                 │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  PostgreSQL  │  │     Auth     │  │   Storage    │ │
│  │   Database   │  │   Service    │  │   Buckets    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │    Edge      │  │  Realtime    │                    │
│  │  Functions   │  │  Subscr.     │                    │
│  └──────────────┘  └──────────────┘                    │
└──────────────────────────────────────────────────────────┘
                      │
                      │ External APIs
                      │
┌─────────────────────▼───────────────────────────────────┐
│              External Services                           │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │   Geocoding  │  │  Leaflet/OSM │                    │
│  │     API      │  │     Maps     │                    │
│  └──────────────┘  └──────────────┘                    │
└──────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18 (UI framework)
- TypeScript (type safety)
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (routing)
- React Query (data fetching)
- React Leaflet (maps)

**Backend:**
- Supabase (BaaS)
- PostgreSQL (database)
- Edge Functions (serverless)
- PostGIS (geospatial)

**Infrastructure:**
- Lovable Cloud (hosting)
- CDN (asset delivery)
- SSL/TLS (security)

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI primitives (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── Navbar.tsx            # Navigation component
│   ├── GameMap.tsx           # Map visualization
│   ├── FriendCard.tsx        # Friend display
│   └── ...                   # Feature-specific components
│
├── pages/                     # Route components
│   ├── Index.tsx             # Landing page
│   ├── Discover.tsx          # Game discovery
│   ├── HostGame.tsx          # Game creation
│   ├── GameDetails.tsx       # Game details view
│   └── ...
│
├── contexts/                  # React contexts
│   └── AuthContext.tsx       # Authentication state
│
├── hooks/                     # Custom hooks
│   ├── use-toast.ts          # Toast notifications
│   ├── use-mobile.tsx        # Mobile detection
│   └── useFriends.ts         # Friend management
│
├── utils/                     # Utility functions
│   └── sportsUtils.ts        # Sport-related helpers
│
└── integrations/              # Third-party integrations
    └── supabase/
        ├── client.ts         # Supabase client
        └── types.ts          # Generated types
```

### State Management Strategy

**Server State (React Query):**
- Game data
- User profiles
- Friend lists
- Reviews
- Communities

**Global State (Context API):**
- Authentication state
- User session
- Theme preferences

**Local State (useState):**
- Form inputs
- UI toggles
- Modal states
- Temporary data

### Routing Architecture

```typescript
// Main routes
/                      → Index (Landing page)
/discover              → Discover (Game browser)
/host-game             → HostGame (Create game)
/game/:id              → GameDetails (Game details)
/my-games              → MyGames (User's games)
/friends               → Friends (Friend management)
/community             → Community (Communities list)
/leaderboard           → Leaderboard (Rankings)

// Auth routes
/auth                  → Auth (Login/Signup)
/auth/callback         → AuthCallback (OAuth callback)
/setup-username        → SetupUsername (First-time setup)

// Legal routes
/privacy               → Privacy (Privacy policy)
/terms                 → Terms (Terms of service)

// 404
*                      → NotFound (404 page)
```

### Design System

**Color Tokens:**
```css
/* Defined in src/index.css */
--primary              /* Main brand color */
--secondary            /* Accent color */
--background           /* Page background */
--foreground           /* Text color */
--muted                /* Subtle elements */
--accent               /* Highlights */
--destructive          /* Errors/warnings */
```

**Typography:**
- Font: Inter (sans-serif)
- Scale: Tailwind default + custom sizes
- Responsive: Mobile-first approach

**Spacing:**
- Based on Tailwind's spacing scale
- Consistent padding/margin
- Responsive breakpoints

## Backend Architecture

### Database Structure

**Core Tables:**
- `profiles` - User profiles
- `games` - Game listings
- `game_participants` - Game joiners
- `friends` - Friend relationships
- `friend_requests` - Pending requests
- `player_reviews` - User reviews
- `communities` - Community groups
- `community_members` - Community membership

**Relationships:**
```
profiles (1) ───── (N) games [host_id]
profiles (1) ───── (N) game_participants [user_id]
games (1) ──────── (N) game_participants [game_id]
profiles (1) ───── (N) player_reviews [reviewer/reviewed]
profiles (1) ───── (N) friends [user_id/friend_id]
communities (1) ─── (N) community_members [community_id]
games (1) ──────── (1) communities [game_id]
```

### Edge Functions

**geocode/**
```typescript
// Purpose: Convert addresses to coordinates
// Input: Address components
// Output: { latitude, longitude }
// External API: Nominatim/OpenStreetMap
```

**moderate-content/**
```typescript
// Purpose: Content moderation
// Input: User-generated text
// Output: Moderation result
// AI-based content filtering
```

### Authentication Flow

```
1. User submits credentials
   ↓
2. Supabase Auth validates
   ↓
3. JWT token generated
   ↓
4. Token stored in browser
   ↓
5. Subsequent requests include token
   ↓
6. Row Level Security enforces access
```

### Authorization Model

**Row Level Security (RLS) Policies:**

```sql
-- Example: Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Example: Anyone can view public games
CREATE POLICY "Public games are viewable"
ON games FOR SELECT
USING (visibility = 'PUBLIC');
```

## Database Design

### Schema Diagram

```
┌─────────────────┐
│    profiles     │
├─────────────────┤
│ id (uuid) PK    │
│ user_id (uuid)  │
│ username        │
│ display_name    │
│ overall_rating  │
│ games_hosted    │
│ games_attended  │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│      games      │
├─────────────────┤
│ id (uuid) PK    │
│ host_id FK      │
│ sport           │
│ game_date       │
│ start_time      │
│ location        │
│ latitude        │
│ longitude       │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────────┐
│ game_participants   │
├─────────────────────┤
│ id (uuid) PK        │
│ game_id FK          │
│ user_id FK          │
│ joined_at           │
└─────────────────────┘
```

### Indexes

```sql
-- Performance optimization
CREATE INDEX idx_games_date ON games(game_date);
CREATE INDEX idx_games_location ON games USING GIST(
  ll_to_earth(latitude, longitude)
);
CREATE INDEX idx_participants_game ON game_participants(game_id);
CREATE INDEX idx_participants_user ON game_participants(user_id);
```

### Geospatial Queries

```sql
-- Find games within radius
SELECT * FROM games
WHERE earth_distance(
  ll_to_earth(latitude, longitude),
  ll_to_earth($1, $2)
) < $3;
```

## Security Architecture

### Authentication Security

- **JWT Tokens**: Secure token-based auth
- **Token Refresh**: Automatic token renewal
- **Session Management**: Secure session handling
- **OAuth**: Secure third-party auth

### Data Security

**Row Level Security:**
- User data isolation
- Role-based access
- Query-level filtering
- Automatic enforcement

**Input Validation:**
- Client-side validation (Zod)
- Server-side validation (PostgreSQL)
- XSS prevention
- SQL injection prevention

**Secrets Management:**
- Environment variables
- No hardcoded secrets
- Rotation capability
- Access logging

### API Security

- **CORS**: Configured origins
- **Rate Limiting**: Request throttling
- **HTTPS Only**: Encrypted transport
- **CSRF Protection**: Token validation

## API Design

### Supabase Client Usage

```typescript
// Query pattern
const { data, error } = await supabase
  .from('games')
  .select('*, profiles(*)')
  .eq('status', 'UPCOMING')
  .order('game_date', { ascending: true });

// Insert pattern
const { data, error } = await supabase
  .from('games')
  .insert({
    host_id: user.id,
    sport: 'basketball',
    // ...
  })
  .select()
  .single();

// Update pattern
const { error } = await supabase
  .from('profiles')
  .update({ display_name: 'New Name' })
  .eq('user_id', user.id);
```

### Edge Function Patterns

```typescript
// Function structure
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  try {
    const { data } = await req.json();
    
    // Process request
    const result = await processData(data);
    
    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }
});
```

### Realtime Subscriptions

```typescript
// Subscribe to changes
const channel = supabase
  .channel('game-updates')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'games',
    },
    (payload) => {
      console.log('Game updated:', payload);
    }
  )
  .subscribe();

// Cleanup
channel.unsubscribe();
```

## Performance Optimization

### Frontend Optimization

- **Code Splitting**: Dynamic imports
- **Lazy Loading**: Components on demand
- **Image Optimization**: Compressed assets
- **Bundle Size**: Analyzed and minimized

### Database Optimization

- **Indexes**: Strategic indexing
- **Query Optimization**: Efficient queries
- **Connection Pooling**: Managed connections
- **Caching**: Result caching

### Caching Strategy

- **Browser Cache**: Static assets
- **React Query Cache**: API responses
- **Service Worker**: Offline support (future)

## Monitoring & Observability

### Error Tracking
- Console error monitoring
- Network request logging
- User action tracking

### Performance Metrics
- Page load times
- API response times
- Database query performance

### Analytics
- User behavior tracking
- Feature usage stats
- Conversion funnels

---

For implementation details, see individual component documentation or the [README](../README.md).
