export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          archived: boolean
          archived_at: string | null
          created_at: string | null
          created_by: string
          description: string | null
          game_id: string | null
          id: string
          member_count: number | null
          name: string
          sport: Database["public"]["Enums"]["sport_type"] | null
          type: string
          visibility: Database["public"]["Enums"]["community_visibility"] | null
        }
        Insert: {
          archived?: boolean
          archived_at?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          game_id?: string | null
          id?: string
          member_count?: number | null
          name: string
          sport?: Database["public"]["Enums"]["sport_type"] | null
          type?: string
          visibility?:
            | Database["public"]["Enums"]["community_visibility"]
            | null
        }
        Update: {
          archived?: boolean
          archived_at?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          game_id?: string | null
          id?: string
          member_count?: number | null
          name?: string
          sport?: Database["public"]["Enums"]["sport_type"] | null
          type?: string
          visibility?:
            | Database["public"]["Enums"]["community_visibility"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "communities_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: Database["public"]["Enums"]["friendship_status"]
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: Database["public"]["Enums"]["friendship_status"]
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["friendship_status"]
          updated_at?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string
          current_players: number | null
          custom_emoji: string | null
          custom_sport_name: string | null
          description: string | null
          duration_minutes: number
          equipment_requirements: string | null
          game_date: string
          game_rules: string | null
          host_id: string
          id: string
          is_recurring: boolean | null
          latitude: number
          location_name: string
          longitude: number
          max_players: number
          skill_level: Database["public"]["Enums"]["skill_level"]
          sport: Database["public"]["Enums"]["sport_type"]
          start_time: string
          state: string | null
          status: Database["public"]["Enums"]["game_status"] | null
          updated_at: string
          visibility: Database["public"]["Enums"]["game_visibility"] | null
          zip_code: string | null
        }
        Insert: {
          address: string
          city: string
          country?: string
          created_at?: string
          current_players?: number | null
          custom_emoji?: string | null
          custom_sport_name?: string | null
          description?: string | null
          duration_minutes: number
          equipment_requirements?: string | null
          game_date: string
          game_rules?: string | null
          host_id: string
          id?: string
          is_recurring?: boolean | null
          latitude: number
          location_name: string
          longitude: number
          max_players: number
          skill_level: Database["public"]["Enums"]["skill_level"]
          sport: Database["public"]["Enums"]["sport_type"]
          start_time: string
          state?: string | null
          status?: Database["public"]["Enums"]["game_status"] | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["game_visibility"] | null
          zip_code?: string | null
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          current_players?: number | null
          custom_emoji?: string | null
          custom_sport_name?: string | null
          description?: string | null
          duration_minutes?: number
          equipment_requirements?: string | null
          game_date?: string
          game_rules?: string | null
          host_id?: string
          id?: string
          is_recurring?: boolean | null
          latitude?: number
          location_name?: string
          longitude?: number
          max_players?: number
          skill_level?: Database["public"]["Enums"]["skill_level"]
          sport?: Database["public"]["Enums"]["sport_type"]
          start_time?: string
          state?: string | null
          status?: Database["public"]["Enums"]["game_status"] | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["game_visibility"] | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "games_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_views: {
        Row: {
          created_at: string
          id: string
          last_viewed_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_viewed_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_viewed_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_votes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          community_id: string | null
          content: string
          created_at: string | null
          downvotes: number | null
          game_id: string | null
          id: string
          sport: string | null
          title: string
          upvotes: number | null
          user_id: string
        }
        Insert: {
          community_id?: string | null
          content: string
          created_at?: string | null
          downvotes?: number | null
          game_id?: string | null
          id?: string
          sport?: string | null
          title: string
          upvotes?: number | null
          user_id: string
        }
        Update: {
          community_id?: string | null
          content?: string
          created_at?: string | null
          downvotes?: number | null
          game_id?: string | null
          id?: string
          sport?: string | null
          title?: string
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accepted_terms_version: string | null
          account_status: Database["public"]["Enums"]["account_status"] | null
          bio: string | null
          city: string | null
          created_at: string
          date_of_birth: string
          first_name: string | null
          games_attended: number | null
          games_hosted: number | null
          id: string
          id_verified: boolean | null
          last_login_at: string | null
          last_name: string | null
          latitude: number | null
          longitude: number | null
          no_show_count: number | null
          notification_prefs: Json | null
          overall_rating: number | null
          phone_number: string | null
          phone_verified: boolean | null
          player_waiver_accepted: boolean | null
          player_waiver_accepted_at: string | null
          profile_photo: string | null
          state: string | null
          terms_last_accepted_at: string | null
          total_reviews: number | null
          updated_at: string
          username: string | null
          zip_code: string | null
        }
        Insert: {
          accepted_terms_version?: string | null
          account_status?: Database["public"]["Enums"]["account_status"] | null
          bio?: string | null
          city?: string | null
          created_at?: string
          date_of_birth: string
          first_name?: string | null
          games_attended?: number | null
          games_hosted?: number | null
          id: string
          id_verified?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          latitude?: number | null
          longitude?: number | null
          no_show_count?: number | null
          notification_prefs?: Json | null
          overall_rating?: number | null
          phone_number?: string | null
          phone_verified?: boolean | null
          player_waiver_accepted?: boolean | null
          player_waiver_accepted_at?: string | null
          profile_photo?: string | null
          state?: string | null
          terms_last_accepted_at?: string | null
          total_reviews?: number | null
          updated_at?: string
          username?: string | null
          zip_code?: string | null
        }
        Update: {
          accepted_terms_version?: string | null
          account_status?: Database["public"]["Enums"]["account_status"] | null
          bio?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string
          first_name?: string | null
          games_attended?: number | null
          games_hosted?: number | null
          id?: string
          id_verified?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          latitude?: number | null
          longitude?: number | null
          no_show_count?: number | null
          notification_prefs?: Json | null
          overall_rating?: number | null
          phone_number?: string | null
          phone_verified?: boolean | null
          player_waiver_accepted?: boolean | null
          player_waiver_accepted_at?: string | null
          profile_photo?: string | null
          state?: string | null
          terms_last_accepted_at?: string | null
          total_reviews?: number | null
          updated_at?: string
          username?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          game_id: string
          good_sportsmanship: number | null
          id: string
          is_anonymous: boolean | null
          overall_rating: number | null
          reviewee_id: string
          reviewer_id: string
          showed_up_on_time: number | null
          skill_accurate: number | null
          would_play_again: number | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          game_id: string
          good_sportsmanship?: number | null
          id?: string
          is_anonymous?: boolean | null
          overall_rating?: number | null
          reviewee_id: string
          reviewer_id: string
          showed_up_on_time?: number | null
          skill_accurate?: number | null
          would_play_again?: number | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          game_id?: string
          good_sportsmanship?: number | null
          id?: string
          is_anonymous?: boolean | null
          overall_rating?: number | null
          reviewee_id?: string
          reviewer_id?: string
          showed_up_on_time?: number | null
          skill_accurate?: number | null
          would_play_again?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rsvps: {
        Row: {
          attended: boolean | null
          cancelled_at: string | null
          game_id: string
          id: string
          marked_no_show: boolean | null
          rsvp_at: string
          status: Database["public"]["Enums"]["rsvp_status"]
          user_id: string
          waitlist_position: number | null
        }
        Insert: {
          attended?: boolean | null
          cancelled_at?: string | null
          game_id: string
          id?: string
          marked_no_show?: boolean | null
          rsvp_at?: string
          status?: Database["public"]["Enums"]["rsvp_status"]
          user_id: string
          waitlist_position?: number | null
        }
        Update: {
          attended?: boolean | null
          cancelled_at?: string | null
          game_id?: string
          id?: string
          marked_no_show?: boolean | null
          rsvp_at?: string
          status?: Database["public"]["Enums"]["rsvp_status"]
          user_id?: string
          waitlist_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_games: {
        Row: {
          created_at: string
          game_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sports: {
        Row: {
          created_at: string
          id: string
          skill_level: Database["public"]["Enums"]["skill_level"]
          sport: Database["public"]["Enums"]["sport_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          skill_level: Database["public"]["Enums"]["skill_level"]
          sport: Database["public"]["Enums"]["sport_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          skill_level?: Database["public"]["Enums"]["skill_level"]
          sport?: Database["public"]["Enums"]["sport_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_friendship_status: {
        Args: { user_id_1: string; user_id_2: string }
        Returns: Database["public"]["Enums"]["friendship_status"]
      }
      get_mutual_friends_count: {
        Args: { user_id_1: string; user_id_2: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      account_status: "ACTIVE" | "SUSPENDED" | "BANNED"
      app_role: "admin" | "moderator" | "user"
      community_visibility: "PUBLIC" | "FRIENDS_ONLY" | "INVITE_ONLY"
      friendship_status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED"
      game_status: "UPCOMING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
      game_visibility: "PUBLIC" | "FRIENDS_ONLY" | "INVITE_ONLY"
      rsvp_status: "CONFIRMED" | "WAITLISTED" | "CANCELLED"
      skill_level:
        | "BEGINNER"
        | "INTERMEDIATE"
        | "ADVANCED"
        | "EXPERT"
        | "ALL_LEVELS"
      sport_type:
        | "BASKETBALL"
        | "SOCCER"
        | "VOLLEYBALL"
        | "TENNIS"
        | "BASEBALL"
        | "FOOTBALL"
        | "ULTIMATE_FRISBEE"
        | "CRICKET"
        | "RUGBY"
        | "HOCKEY"
        | "OTHER"
        | "PICKLEBALL"
        | "RUNNING"
        | "CYCLING"
        | "BADMINTON"
        | "GOLF"
      user_role: "USER" | "ADMIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["ACTIVE", "SUSPENDED", "BANNED"],
      app_role: ["admin", "moderator", "user"],
      community_visibility: ["PUBLIC", "FRIENDS_ONLY", "INVITE_ONLY"],
      friendship_status: ["PENDING", "ACCEPTED", "DECLINED", "BLOCKED"],
      game_status: ["UPCOMING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      game_visibility: ["PUBLIC", "FRIENDS_ONLY", "INVITE_ONLY"],
      rsvp_status: ["CONFIRMED", "WAITLISTED", "CANCELLED"],
      skill_level: [
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED",
        "EXPERT",
        "ALL_LEVELS",
      ],
      sport_type: [
        "BASKETBALL",
        "SOCCER",
        "VOLLEYBALL",
        "TENNIS",
        "BASEBALL",
        "FOOTBALL",
        "ULTIMATE_FRISBEE",
        "CRICKET",
        "RUGBY",
        "HOCKEY",
        "OTHER",
        "PICKLEBALL",
        "RUNNING",
        "CYCLING",
        "BADMINTON",
        "GOLF",
      ],
      user_role: ["USER", "ADMIN"],
    },
  },
} as const
