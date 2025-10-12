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
      games: {
        Row: {
          address: string
          city: string
          cost_per_person: number | null
          created_at: string
          current_players: number | null
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
          cost_per_person?: number | null
          created_at?: string
          current_players?: number | null
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
          cost_per_person?: number | null
          created_at?: string
          current_players?: number | null
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
      profiles: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"] | null
          bio: string | null
          city: string
          created_at: string
          date_of_birth: string
          first_name: string
          games_attended: number | null
          games_hosted: number | null
          id: string
          id_verified: boolean | null
          last_login_at: string | null
          last_name: string
          latitude: number | null
          longitude: number | null
          no_show_count: number | null
          notification_prefs: Json | null
          overall_rating: number | null
          phone_number: string | null
          phone_verified: boolean | null
          profile_photo: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          state: string | null
          total_reviews: number | null
          updated_at: string
          username: string | null
          zip_code: string
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          bio?: string | null
          city: string
          created_at?: string
          date_of_birth: string
          first_name: string
          games_attended?: number | null
          games_hosted?: number | null
          id: string
          id_verified?: boolean | null
          last_login_at?: string | null
          last_name: string
          latitude?: number | null
          longitude?: number | null
          no_show_count?: number | null
          notification_prefs?: Json | null
          overall_rating?: number | null
          phone_number?: string | null
          phone_verified?: boolean | null
          profile_photo?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          state?: string | null
          total_reviews?: number | null
          updated_at?: string
          username?: string | null
          zip_code: string
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          bio?: string | null
          city?: string
          created_at?: string
          date_of_birth?: string
          first_name?: string
          games_attended?: number | null
          games_hosted?: number | null
          id?: string
          id_verified?: boolean | null
          last_login_at?: string | null
          last_name?: string
          latitude?: number | null
          longitude?: number | null
          no_show_count?: number | null
          notification_prefs?: Json | null
          overall_rating?: number | null
          phone_number?: string | null
          phone_verified?: boolean | null
          profile_photo?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          state?: string | null
          total_reviews?: number | null
          updated_at?: string
          username?: string | null
          zip_code?: string
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
      [_ in never]: never
    }
    Enums: {
      account_status: "ACTIVE" | "SUSPENDED" | "BANNED"
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
      ],
      user_role: ["USER", "ADMIN"],
    },
  },
} as const
