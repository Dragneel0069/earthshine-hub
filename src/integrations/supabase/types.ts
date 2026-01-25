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
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
      credit_orders: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          beneficiary_name: string | null
          beneficiary_type: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          catalog_id: string
          created_at: string | null
          created_by: string
          escrow_released_at: string | null
          escrow_started_at: string | null
          failed_at: string | null
          failure_reason: string | null
          gst_amount: number
          id: string
          order_number: string
          org_id: string
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          platform_fee: number
          price_per_ton: number
          quantity: number
          registry_retirement_id: string | null
          retired_at: string | null
          retirement_reason: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          beneficiary_name?: string | null
          beneficiary_type?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          catalog_id: string
          created_at?: string | null
          created_by: string
          escrow_released_at?: string | null
          escrow_started_at?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          gst_amount?: number
          id?: string
          order_number: string
          org_id: string
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          platform_fee?: number
          price_per_ton: number
          quantity: number
          registry_retirement_id?: string | null
          retired_at?: string | null
          retirement_reason?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          beneficiary_name?: string | null
          beneficiary_type?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          catalog_id?: string
          created_at?: string | null
          created_by?: string
          escrow_released_at?: string | null
          escrow_started_at?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          gst_amount?: number
          id?: string
          order_number?: string
          org_id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          platform_fee?: number
          price_per_ton?: number
          quantity?: number
          registry_retirement_id?: string | null
          retired_at?: string | null
          retirement_reason?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_orders_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "credits_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_orders_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      credits_catalog: {
        Row: {
          available_credits: number
          co_benefits: string[] | null
          country: string
          created_at: string | null
          currency: string
          description: string | null
          documentation_url: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          listed_by: string | null
          methodology_id: string | null
          price_per_ton: number
          project_name: string
          project_type: string
          quality_breakdown: Json | null
          quality_score: number
          registry: string
          reserved_credits: number
          retired_credits: number
          sdg_alignment: number[] | null
          state: string | null
          total_credits: number
          updated_at: string | null
          verification_body: string | null
          verification_date: string | null
          vintage_year: number
        }
        Insert: {
          available_credits?: number
          co_benefits?: string[] | null
          country?: string
          created_at?: string | null
          currency?: string
          description?: string | null
          documentation_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          listed_by?: string | null
          methodology_id?: string | null
          price_per_ton: number
          project_name: string
          project_type: string
          quality_breakdown?: Json | null
          quality_score?: number
          registry: string
          reserved_credits?: number
          retired_credits?: number
          sdg_alignment?: number[] | null
          state?: string | null
          total_credits?: number
          updated_at?: string | null
          verification_body?: string | null
          verification_date?: string | null
          vintage_year: number
        }
        Update: {
          available_credits?: number
          co_benefits?: string[] | null
          country?: string
          created_at?: string | null
          currency?: string
          description?: string | null
          documentation_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          listed_by?: string | null
          methodology_id?: string | null
          price_per_ton?: number
          project_name?: string
          project_type?: string
          quality_breakdown?: Json | null
          quality_score?: number
          registry?: string
          reserved_credits?: number
          retired_credits?: number
          sdg_alignment?: number[] | null
          state?: string | null
          total_credits?: number
          updated_at?: string | null
          verification_body?: string | null
          verification_date?: string | null
          vintage_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "credits_catalog_listed_by_fkey"
            columns: ["listed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emissions_records: {
        Row: {
          activity_data: number
          activity_unit: string
          approved_at: string | null
          approved_by: string | null
          category: string
          co2e_kg: number
          created_at: string | null
          created_by: string
          emission_factor: number | null
          emission_factor_source: string | null
          evidence_url: string | null
          facility_location: string | null
          id: string
          locked_at: string | null
          notes: string | null
          org_id: string
          rejection_reason: string | null
          reporting_period_end: string
          reporting_period_start: string
          reporting_year: number
          scope: number
          source: string | null
          status: Database["public"]["Enums"]["record_status"]
          sub_category: string | null
          updated_at: string | null
        }
        Insert: {
          activity_data: number
          activity_unit: string
          approved_at?: string | null
          approved_by?: string | null
          category: string
          co2e_kg: number
          created_at?: string | null
          created_by: string
          emission_factor?: number | null
          emission_factor_source?: string | null
          evidence_url?: string | null
          facility_location?: string | null
          id?: string
          locked_at?: string | null
          notes?: string | null
          org_id: string
          rejection_reason?: string | null
          reporting_period_end: string
          reporting_period_start: string
          reporting_year: number
          scope: number
          source?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          sub_category?: string | null
          updated_at?: string | null
        }
        Update: {
          activity_data?: number
          activity_unit?: string
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          co2e_kg?: number
          created_at?: string | null
          created_by?: string
          emission_factor?: number | null
          emission_factor_source?: string | null
          evidence_url?: string | null
          facility_location?: string | null
          id?: string
          locked_at?: string | null
          notes?: string | null
          org_id?: string
          rejection_reason?: string | null
          reporting_period_end?: string
          reporting_period_start?: string
          reporting_year?: number
          scope?: number
          source?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          sub_category?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emissions_records_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emissions_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emissions_records_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ledger: {
        Row: {
          action: string
          after_state: Json | null
          before_state: Json | null
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          ip_address: unknown
          metadata: Json | null
          org_id: string | null
          performed_by: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          org_id?: string | null
          performed_by?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          org_id?: string | null
          performed_by?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ledger_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          is_active: boolean | null
          org_id: string
          org_role: Database["public"]["Enums"]["org_role"]
          permissions: Database["public"]["Enums"]["permission_type"][] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          org_id: string
          org_role?: Database["public"]["Enums"]["org_role"]
          permissions?: Database["public"]["Enums"]["permission_type"][] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          org_id?: string
          org_role?: Database["public"]["Enums"]["org_role"]
          permissions?: Database["public"]["Enums"]["permission_type"][] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          annual_revenue: number | null
          baseline_year: number | null
          cin: string | null
          city: string | null
          country: string | null
          created_at: string | null
          employee_count: number | null
          financial_year_start: string | null
          gst_number: string | null
          id: string
          is_active: boolean | null
          legal_name: string | null
          logo_url: string | null
          name: string
          pan: string | null
          sector: string | null
          state: string | null
          sub_sector: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          annual_revenue?: number | null
          baseline_year?: number | null
          cin?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          employee_count?: number | null
          financial_year_start?: string | null
          gst_number?: string | null
          id?: string
          is_active?: boolean | null
          legal_name?: string | null
          logo_url?: string | null
          name: string
          pan?: string | null
          sector?: string | null
          state?: string | null
          sub_sector?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          annual_revenue?: number | null
          baseline_year?: number | null
          cin?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          employee_count?: number | null
          financial_year_start?: string | null
          gst_number?: string | null
          id?: string
          is_active?: boolean | null
          legal_name?: string | null
          logo_url?: string | null
          name?: string
          pan?: string | null
          sector?: string | null
          state?: string | null
          sub_sector?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          phone: string | null
          platform_role: Database["public"]["Enums"]["platform_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          phone?: string | null
          platform_role?: Database["public"]["Enums"]["platform_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          platform_role?: Database["public"]["Enums"]["platform_role"] | null
          updated_at?: string | null
        }
        Relationships: []
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
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
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
      reports: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          created_by: string
          file_url: string | null
          id: string
          locked_at: string | null
          locked_by: string | null
          notes: string | null
          org_id: string
          rejection_reason: string | null
          report_data: Json
          report_type: Database["public"]["Enums"]["report_type"]
          reporting_period_end: string | null
          reporting_period_start: string | null
          reporting_year: number
          status: Database["public"]["Enums"]["record_status"]
          summary: string | null
          supporting_docs: Json | null
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by: string
          file_url?: string | null
          id?: string
          locked_at?: string | null
          locked_by?: string | null
          notes?: string | null
          org_id: string
          rejection_reason?: string | null
          report_data?: Json
          report_type: Database["public"]["Enums"]["report_type"]
          reporting_period_end?: string | null
          reporting_period_start?: string | null
          reporting_year: number
          status?: Database["public"]["Enums"]["record_status"]
          summary?: string | null
          supporting_docs?: Json | null
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string
          file_url?: string | null
          id?: string
          locked_at?: string | null
          locked_by?: string | null
          notes?: string | null
          org_id?: string
          rejection_reason?: string | null
          report_data?: Json
          report_type?: Database["public"]["Enums"]["report_type"]
          reporting_period_end?: string | null
          reporting_period_start?: string | null
          reporting_year?: number
          status?: Database["public"]["Enums"]["record_status"]
          summary?: string | null
          supporting_docs?: Json | null
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_locked_by_fkey"
            columns: ["locked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      retirement_proofs: {
        Row: {
          beneficiary_name: string
          beneficiary_type: string | null
          blockchain_tx_id: string | null
          catalog_snapshot: Json
          certificate_number: string
          certificate_url: string | null
          created_at: string | null
          generated_at: string | null
          id: string
          order_id: string
          org_id: string
          quantity: number
          registry: string
          registry_confirmation_date: string | null
          registry_retirement_id: string | null
          retirement_reason: string | null
          verification_hash: string | null
        }
        Insert: {
          beneficiary_name: string
          beneficiary_type?: string | null
          blockchain_tx_id?: string | null
          catalog_snapshot: Json
          certificate_number: string
          certificate_url?: string | null
          created_at?: string | null
          generated_at?: string | null
          id?: string
          order_id: string
          org_id: string
          quantity: number
          registry: string
          registry_confirmation_date?: string | null
          registry_retirement_id?: string | null
          retirement_reason?: string | null
          verification_hash?: string | null
        }
        Update: {
          beneficiary_name?: string
          beneficiary_type?: string | null
          blockchain_tx_id?: string | null
          catalog_snapshot?: Json
          certificate_number?: string
          certificate_url?: string | null
          created_at?: string | null
          generated_at?: string | null
          id?: string
          order_id?: string
          org_id?: string
          quantity?: number
          registry?: string
          registry_confirmation_date?: string | null
          registry_retirement_id?: string | null
          retirement_reason?: string | null
          verification_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retirement_proofs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "credit_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retirement_proofs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_emission: { Args: { _emission_id: string }; Returns: Json }
      approve_report: { Args: { _report_id: string }; Returns: Json }
      cancel_order: {
        Args: { _order_id: string; _reason: string }
        Returns: Json
      }
      complete_retirement: {
        Args: { _order_id: string; _registry_retirement_id?: string }
        Returns: Json
      }
      generate_certificate_number: { Args: never; Returns: string }
      generate_order_number: { Args: never; Returns: string }
      has_org_role: {
        Args: {
          _org_id: string
          _role: Database["public"]["Enums"]["org_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_permission: {
        Args: {
          _org_id: string
          _permission: Database["public"]["Enums"]["permission_type"]
          _user_id: string
        }
        Returns: boolean
      }
      has_platform_role: {
        Args: {
          _role: Database["public"]["Enums"]["platform_role"]
          _user_id: string
        }
        Returns: boolean
      }
      initiate_order: {
        Args: {
          _beneficiary_name?: string
          _beneficiary_type?: string
          _catalog_id: string
          _org_id: string
          _quantity: number
          _retirement_reason?: string
        }
        Returns: Json
      }
      is_org_member: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      lock_report: { Args: { _report_id: string }; Returns: Json }
      log_to_ledger: {
        Args: {
          _action: string
          _after?: Json
          _before?: Json
          _entity_id: string
          _entity_type: string
          _metadata?: Json
          _org_id: string
        }
        Returns: undefined
      }
      mark_order_paid: {
        Args: { _order_id: string; _payment_reference: string }
        Returns: Json
      }
      reject_emission: {
        Args: { _emission_id: string; _reason: string }
        Returns: Json
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
      start_escrow: { Args: { _order_id: string }; Returns: Json }
      submit_emission_for_review: {
        Args: { _emission_id: string }
        Returns: Json
      }
      submit_report_for_review: { Args: { _report_id: string }; Returns: Json }
    }
    Enums: {
      order_status:
        | "initiated"
        | "paid"
        | "in_escrow"
        | "retired"
        | "cancelled"
        | "failed"
      org_role: "admin" | "editor" | "viewer"
      permission_type:
        | "can_view_emissions"
        | "can_edit_emissions"
        | "can_approve_emissions"
        | "can_view_reports"
        | "can_generate_reports"
        | "can_approve_reports"
        | "can_view_marketplace"
        | "can_transact"
        | "can_retire_credits"
        | "can_view_ledger"
        | "can_invite_members"
        | "can_manage_org"
      platform_role: "platform_admin" | "org_owner" | "consultant" | "auditor"
      record_status:
        | "draft"
        | "pending_review"
        | "approved"
        | "locked"
        | "rejected"
      report_type: "BRSR" | "GHG" | "CDP" | "Internal"
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
      order_status: [
        "initiated",
        "paid",
        "in_escrow",
        "retired",
        "cancelled",
        "failed",
      ],
      org_role: ["admin", "editor", "viewer"],
      permission_type: [
        "can_view_emissions",
        "can_edit_emissions",
        "can_approve_emissions",
        "can_view_reports",
        "can_generate_reports",
        "can_approve_reports",
        "can_view_marketplace",
        "can_transact",
        "can_retire_credits",
        "can_view_ledger",
        "can_invite_members",
        "can_manage_org",
      ],
      platform_role: ["platform_admin", "org_owner", "consultant", "auditor"],
      record_status: [
        "draft",
        "pending_review",
        "approved",
        "locked",
        "rejected",
      ],
      report_type: ["BRSR", "GHG", "CDP", "Internal"],
    },
  },
} as const
