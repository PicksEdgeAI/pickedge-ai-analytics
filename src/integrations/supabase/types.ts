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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_picks: {
        Row: {
          confidence: number | null
          created_at: string
          game_id: string | null
          grade: string | null
          id: string
          odds: number | null
          pick_label: string
          pick_type: string
          reasoning: string | null
          result: Database["public"]["Enums"]["pick_result"]
          sport: string | null
          updated_at: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          game_id?: string | null
          grade?: string | null
          id?: string
          odds?: number | null
          pick_label: string
          pick_type: string
          reasoning?: string | null
          result?: Database["public"]["Enums"]["pick_result"]
          sport?: string | null
          updated_at?: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          game_id?: string | null
          grade?: string | null
          id?: string
          odds?: number | null
          pick_label?: string
          pick_type?: string
          reasoning?: string | null
          result?: Database["public"]["Enums"]["pick_result"]
          sport?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_picks_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          away_score: number | null
          away_team: string
          commence_time: string
          created_at: string
          home_score: number | null
          home_team: string
          id: string
          league: string | null
          odds_api_id: string | null
          sport: string
          status: string
          updated_at: string
        }
        Insert: {
          away_score?: number | null
          away_team: string
          commence_time: string
          created_at?: string
          home_score?: number | null
          home_team: string
          id?: string
          league?: string | null
          odds_api_id?: string | null
          sport: string
          status?: string
          updated_at?: string
        }
        Update: {
          away_score?: number | null
          away_team?: string
          commence_time?: string
          created_at?: string
          home_score?: number | null
          home_team?: string
          id?: string
          league?: string | null
          odds_api_id?: string | null
          sport?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      injuries: {
        Row: {
          ai_impact: string | null
          description: string | null
          id: string
          league: string | null
          player_name: string
          reported_at: string
          status: string
          team: string | null
        }
        Insert: {
          ai_impact?: string | null
          description?: string | null
          id?: string
          league?: string | null
          player_name: string
          reported_at?: string
          status: string
          team?: string | null
        }
        Update: {
          ai_impact?: string | null
          description?: string | null
          id?: string
          league?: string | null
          player_name?: string
          reported_at?: string
          status?: string
          team?: string | null
        }
        Relationships: []
      }
      odds: {
        Row: {
          bookmaker: string
          game_id: string
          id: string
          last_update: string
          market: string
          outcome_name: string
          point: number | null
          price: number
        }
        Insert: {
          bookmaker: string
          game_id: string
          id?: string
          last_update?: string
          market: string
          outcome_name: string
          point?: number | null
          price: number
        }
        Update: {
          bookmaker?: string
          game_id?: string
          id?: string
          last_update?: string
          market?: string
          outcome_name?: string
          point?: number | null
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "odds_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      parlays: {
        Row: {
          ai_grade: string | null
          created_at: string
          id: string
          legs: Json
          status: Database["public"]["Enums"]["pick_result"]
          total_odds: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_grade?: string | null
          created_at?: string
          id?: string
          legs: Json
          status?: Database["public"]["Enums"]["pick_result"]
          total_odds?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_grade?: string | null
          created_at?: string
          id?: string
          legs?: Json
          status?: Database["public"]["Enums"]["pick_result"]
          total_odds?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      player_props: {
        Row: {
          ai_grade: string | null
          created_at: string
          game_id: string | null
          hit_rate_l10: number | null
          hit_rate_l20: number | null
          hit_rate_l5: number | null
          id: string
          line: number
          over_price: number | null
          player_name: string
          prop_type: string
          team: string | null
          under_price: number | null
          updated_at: string
        }
        Insert: {
          ai_grade?: string | null
          created_at?: string
          game_id?: string | null
          hit_rate_l10?: number | null
          hit_rate_l20?: number | null
          hit_rate_l5?: number | null
          id?: string
          line: number
          over_price?: number | null
          player_name: string
          prop_type: string
          team?: string | null
          under_price?: number | null
          updated_at?: string
        }
        Update: {
          ai_grade?: string | null
          created_at?: string
          game_id?: string | null
          hit_rate_l10?: number | null
          hit_rate_l20?: number | null
          hit_rate_l5?: number | null
          id?: string
          line?: number
          over_price?: number | null
          player_name?: string
          prop_type?: string
          team?: string | null
          under_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_props_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          plan: Database["public"]["Enums"]["app_plan"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          plan?: Database["public"]["Enums"]["app_plan"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["app_plan"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_picks: {
        Row: {
          ai_pick_id: string
          created_at: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          ai_pick_id: string
          created_at?: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          ai_pick_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_picks_ai_pick_id_fkey"
            columns: ["ai_pick_id"]
            isOneToOne: false
            referencedRelation: "ai_picks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard_stats: {
        Row: {
          display_name: string | null
          losses: number | null
          pushes: number | null
          total_picks: number | null
          user_id: string | null
          win_pct: number | null
          wins: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_plan: "free" | "pro" | "vip"
      app_role: "admin" | "user"
      pick_result: "pending" | "won" | "lost" | "push" | "void"
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
      app_plan: ["free", "pro", "vip"],
      app_role: ["admin", "user"],
      pick_result: ["pending", "won", "lost", "push", "void"],
    },
  },
} as const
