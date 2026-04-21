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
      analysis_sessions: {
        Row: {
          created_at: string
          crop_id: string | null
          district_id: string | null
          farmer_session_id: string
          humidity: number | null
          id: string
          land_size_acres: number | null
          recommendations: string[] | null
          risk_level: string | null
          risk_reasons: string[] | null
          risk_score: number | null
          season: string | null
          session_type: string
          spoilage_hours: number | null
          storage_days: number | null
          temperature: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          crop_id?: string | null
          district_id?: string | null
          farmer_session_id: string
          humidity?: number | null
          id?: string
          land_size_acres?: number | null
          recommendations?: string[] | null
          risk_level?: string | null
          risk_reasons?: string[] | null
          risk_score?: number | null
          season?: string | null
          session_type?: string
          spoilage_hours?: number | null
          storage_days?: number | null
          temperature?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          crop_id?: string | null
          district_id?: string | null
          farmer_session_id?: string
          humidity?: number | null
          id?: string
          land_size_acres?: number | null
          recommendations?: string[] | null
          risk_level?: string | null
          risk_reasons?: string[] | null
          risk_score?: number | null
          season?: string | null
          session_type?: string
          spoilage_hours?: number | null
          storage_days?: number | null
          temperature?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      crops: {
        Row: {
          category: string
          created_at: string
          id: string
          ideal_humidity_max: number
          ideal_humidity_min: number
          ideal_temp_max: number
          ideal_temp_min: number
          max_storage_days: number
          name_en: string
          name_ta: string
          risk_factors: string[]
          seasons: string[]
          yield_per_acre_kg: number
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          ideal_humidity_max?: number
          ideal_humidity_min?: number
          ideal_temp_max?: number
          ideal_temp_min?: number
          max_storage_days?: number
          name_en: string
          name_ta: string
          risk_factors?: string[]
          seasons?: string[]
          yield_per_acre_kg?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          ideal_humidity_max?: number
          ideal_humidity_min?: number
          ideal_temp_max?: number
          ideal_temp_min?: number
          max_storage_days?: number
          name_en?: string
          name_ta?: string
          risk_factors?: string[]
          seasons?: string[]
          yield_per_acre_kg?: number
        }
        Relationships: []
      }
      district_crops: {
        Row: {
          created_at: string
          crop_id: string
          district_id: string
          id: string
        }
        Insert: {
          created_at?: string
          crop_id: string
          district_id: string
          id?: string
        }
        Update: {
          created_at?: string
          crop_id?: string
          district_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "district_crops_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "district_crops_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      districts: {
        Row: {
          climate_zone: string
          created_at: string
          id: string
          name_en: string
          name_ta: string
        }
        Insert: {
          climate_zone?: string
          created_at?: string
          id?: string
          name_en: string
          name_ta: string
        }
        Update: {
          climate_zone?: string
          created_at?: string
          id?: string
          name_en?: string
          name_ta?: string
        }
        Relationships: []
      }
      farmer_sessions: {
        Row: {
          created_at: string
          id: string
          language: string
          last_active_at: string
          session_token: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string
          last_active_at?: string
          session_token?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          last_active_at?: string
          session_token?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      mandi_prices: {
        Row: {
          created_at: string
          crop_name_en: string
          crop_name_ta: string
          current_price_per_kg: number
          id: string
          location: string
          prices_last_7_days: Json
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          crop_name_en: string
          crop_name_ta: string
          current_price_per_kg?: number
          id?: string
          location?: string
          prices_last_7_days?: Json
          unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          crop_name_en?: string
          crop_name_ta?: string
          current_price_per_kg?: number
          id?: string
          location?: string
          prices_last_7_days?: Json
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          language: string
          location: string
          message: string
          name: string
          rating: number
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string
          location: string
          message: string
          name: string
          rating?: number
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          location?: string
          message?: string
          name?: string
          rating?: number
        }
        Relationships: []
      }
      schemes: {
        Row: {
          apply_link: string | null
          benefits_en: string
          benefits_ta: string
          cold_storage_support: boolean
          contact_info: string | null
          created_at: string
          description_en: string
          description_ta: string
          eligibility_en: string
          eligibility_ta: string
          id: string
          is_active: boolean
          name_en: string
          name_ta: string
          scheme_type: string
        }
        Insert: {
          apply_link?: string | null
          benefits_en?: string
          benefits_ta?: string
          cold_storage_support?: boolean
          contact_info?: string | null
          created_at?: string
          description_en?: string
          description_ta?: string
          eligibility_en?: string
          eligibility_ta?: string
          id?: string
          is_active?: boolean
          name_en: string
          name_ta: string
          scheme_type?: string
        }
        Update: {
          apply_link?: string | null
          benefits_en?: string
          benefits_ta?: string
          cold_storage_support?: boolean
          contact_info?: string | null
          created_at?: string
          description_en?: string
          description_ta?: string
          eligibility_en?: string
          eligibility_ta?: string
          id?: string
          is_active?: boolean
          name_en?: string
          name_ta?: string
          scheme_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
