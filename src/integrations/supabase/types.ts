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
      blog_posts: {
        Row: {
          author_name: string
          category: string
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string
          category?: string
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          category?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      carbon_projects: {
        Row: {
          available_credits: number
          created_at: string
          description: string | null
          id: string
          impact_details: string | null
          location: string
          price_per_credit: number
          project_name: string
          project_type: string
          total_credits: number
          updated_at: string
          verification_status: string
        }
        Insert: {
          available_credits?: number
          created_at?: string
          description?: string | null
          id?: string
          impact_details?: string | null
          location: string
          price_per_credit: number
          project_name: string
          project_type: string
          total_credits?: number
          updated_at?: string
          verification_status?: string
        }
        Update: {
          available_credits?: number
          created_at?: string
          description?: string | null
          id?: string
          impact_details?: string | null
          location?: string
          price_per_credit?: number
          project_name?: string
          project_type?: string
          total_credits?: number
          updated_at?: string
          verification_status?: string
        }
        Relationships: []
      }
      certification_milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          is_completed: boolean
          order_index: number
          title: string
          user_certification_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          order_index?: number
          title: string
          user_certification_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          order_index?: number
          title?: string
          user_certification_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certification_milestones_user_certification_id_fkey"
            columns: ["user_certification_id"]
            isOneToOne: false
            referencedRelation: "user_certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_reports: {
        Row: {
          file_url: string | null
          generated_at: string
          id: string
          report_data: Json
          report_type: Database["public"]["Enums"]["certification_type"]
          reporting_year: number
          status: string
          user_id: string
        }
        Insert: {
          file_url?: string | null
          generated_at?: string
          id?: string
          report_data: Json
          report_type: Database["public"]["Enums"]["certification_type"]
          reporting_year: number
          status?: string
          user_id: string
        }
        Update: {
          file_url?: string | null
          generated_at?: string
          id?: string
          report_data?: Json
          report_type?: Database["public"]["Enums"]["certification_type"]
          reporting_year?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      emissions: {
        Row: {
          category: string
          co2e: number
          created_at: string
          date: string
          emission_factor: number | null
          id: string
          quantity: number
          scope: number
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          co2e: number
          created_at?: string
          date?: string
          emission_factor?: number | null
          id?: string
          quantity: number
          scope: number
          unit: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          co2e?: number
          created_at?: string
          date?: string
          emission_factor?: number | null
          id?: string
          quantity?: number
          scope?: number
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      offset_preferences: {
        Row: {
          budget_range: string | null
          created_at: string
          id: string
          preferred_locations: string[] | null
          preferred_project_types: string[] | null
          priority_factors: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_range?: string | null
          created_at?: string
          id?: string
          preferred_locations?: string[] | null
          preferred_project_types?: string[] | null
          priority_factors?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_range?: string | null
          created_at?: string
          id?: string
          preferred_locations?: string[] | null
          preferred_project_types?: string[] | null
          priority_factors?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offset_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_responses: {
        Row: {
          completed_at: string
          id: string
          quiz_type: string
          recommendations: Json | null
          responses: Json
          score: number | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string
          id?: string
          quiz_type?: string
          recommendations?: Json | null
          responses: Json
          score?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string
          id?: string
          quiz_type?: string
          recommendations?: Json | null
          responses?: Json
          score?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rag_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          document_id: string
          embedding: string | null
          id: string
          metadata: Json | null
          search_vector: unknown
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string
          document_id: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
          search_vector?: unknown
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          document_id?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
          search_vector?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "rag_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "rag_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      rag_conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rag_documents: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          search_vector: unknown
          source_type: string
          source_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          search_vector?: unknown
          source_type: string
          source_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          search_vector?: unknown
          source_type?: string
          source_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      rag_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          sources: Json | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          sources?: Json | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          sources?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "rag_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "rag_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      recs: {
        Row: {
          certificate_id: string | null
          created_at: string
          energy_source: string
          id: string
          project_name: string
          purchase_date: string
          purchase_price: number | null
          quantity_mwh: number
          registry: string | null
          user_id: string
          vintage_year: number
        }
        Insert: {
          certificate_id?: string | null
          created_at?: string
          energy_source: string
          id?: string
          project_name: string
          purchase_date?: string
          purchase_price?: number | null
          quantity_mwh: number
          registry?: string | null
          user_id: string
          vintage_year: number
        }
        Update: {
          certificate_id?: string | null
          created_at?: string
          energy_source?: string
          id?: string
          project_name?: string
          purchase_date?: string
          purchase_price?: number | null
          quantity_mwh?: number
          registry?: string | null
          user_id?: string
          vintage_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "recs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          razorpay_customer_id: string | null
          razorpay_subscription_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_certifications: {
        Row: {
          achieved_date: string | null
          certification_type: Database["public"]["Enums"]["certification_type"]
          created_at: string
          id: string
          notes: string | null
          progress_percentage: number
          status: string
          target_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achieved_date?: string | null
          certification_type: Database["public"]["Enums"]["certification_type"]
          created_at?: string
          id?: string
          notes?: string | null
          progress_percentage?: number
          status?: string
          target_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achieved_date?: string | null
          certification_type?: Database["public"]["Enums"]["certification_type"]
          created_at?: string
          id?: string
          notes?: string | null
          progress_percentage?: number
          status?: string
          target_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_certifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      users: {
        Row: {
          city: string | null
          company_name: string | null
          created_at: string
          gst_number: string | null
          id: string
          industry_type: string | null
          state: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          city?: string | null
          company_name?: string | null
          created_at?: string
          gst_number?: string | null
          id?: string
          industry_type?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          city?: string | null
          company_name?: string | null
          created_at?: string
          gst_number?: string | null
          id?: string
          industry_type?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_plan: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["subscription_plan"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      search_chunks_fulltext: {
        Args: { match_count?: number; search_query: string }
        Returns: {
          content: string
          document_id: string
          document_title: string
          id: string
          rank: number
        }[]
      }
      search_similar_chunks: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          document_id: string
          document_title: string
          id: string
          similarity: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      certification_type:
        | "bcorp"
        | "cdp"
        | "gri"
        | "csrd"
        | "tcfd"
        | "sasb"
        | "sec"
        | "ecovadis"
        | "sbti"
        | "issb"
      subscription_plan: "free" | "pro" | "enterprise"
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
      app_role: ["admin", "moderator", "user"],
      certification_type: [
        "bcorp",
        "cdp",
        "gri",
        "csrd",
        "tcfd",
        "sasb",
        "sec",
        "ecovadis",
        "sbti",
        "issb",
      ],
      subscription_plan: ["free", "pro", "enterprise"],
    },
  },
} as const
