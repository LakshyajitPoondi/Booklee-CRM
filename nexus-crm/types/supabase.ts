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
      applications: {
        Row: {
          course: string
          created_at: string
          deadline: string
          fee: number
          id: string
          intake: string
          owner_id: string
          status: Database["public"]["Enums"]["application_status"]
          student_email: string
          student_name: string
          university_id: string | null
          updated_at: string
        }
        Insert: {
          course?: string
          created_at?: string
          deadline?: string
          fee?: number
          id?: string
          intake?: string
          owner_id: string
          status?: Database["public"]["Enums"]["application_status"]
          student_email?: string
          student_name: string
          university_id?: string | null
          updated_at?: string
        }
        Update: {
          course?: string
          created_at?: string
          deadline?: string
          fee?: number
          id?: string
          intake?: string
          owner_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          student_email?: string
          student_name?: string
          university_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          address: string
          company_name: string
          email: string
          founded: string
          id: string
          phone: string
          updated_at: string
          website: string
        }
        Insert: {
          address?: string
          company_name?: string
          email?: string
          founded?: string
          id?: string
          phone?: string
          updated_at?: string
          website?: string
        }
        Update: {
          address?: string
          company_name?: string
          email?: string
          founded?: string
          id?: string
          phone?: string
          updated_at?: string
          website?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: Database["public"]["Enums"]["document_category"]
          expiry_date: string | null
          file_size: number
          file_type: string
          id: string
          name: string
          owner_id: string
          status: Database["public"]["Enums"]["document_status"]
          storage_path: string
          student_id: string
          student_name: string
          uploaded_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["document_category"]
          expiry_date?: string | null
          file_size?: number
          file_type?: string
          id?: string
          name: string
          owner_id: string
          status?: Database["public"]["Enums"]["document_status"]
          storage_path?: string
          student_id?: string
          student_name?: string
          uploaded_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["document_category"]
          expiry_date?: string | null
          file_size?: number
          file_type?: string
          id?: string
          name?: string
          owner_id?: string
          status?: Database["public"]["Enums"]["document_status"]
          storage_path?: string
          student_id?: string
          student_name?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          counselor_id: string | null
          country: string
          created_at: string
          email: string
          follow_up_date: string | null
          group_name: string
          id: string
          name: string
          notes: string
          owner_id: string
          phone: string
          source: string
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          value: number
        }
        Insert: {
          assigned_to?: string | null
          counselor_id?: string | null
          country?: string
          created_at?: string
          email?: string
          follow_up_date?: string | null
          group_name?: string
          id?: string
          name: string
          notes?: string
          owner_id: string
          phone?: string
          source?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          value?: number
        }
        Update: {
          assigned_to?: string | null
          counselor_id?: string | null
          country?: string
          created_at?: string
          email?: string
          follow_up_date?: string | null
          group_name?: string
          id?: string
          name?: string
          notes?: string
          owner_id?: string
          phone?: string
          source?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          application_status_update: boolean
          document_uploaded_verified: boolean
          follow_up_due_today: boolean
          id: string
          new_lead_assigned: boolean
          updated_at: string
          user_id: string
          visa_decision_received: boolean
          weekly_performance_report: boolean
        }
        Insert: {
          application_status_update?: boolean
          document_uploaded_verified?: boolean
          follow_up_due_today?: boolean
          id?: string
          new_lead_assigned?: boolean
          updated_at?: string
          user_id: string
          visa_decision_received?: boolean
          weekly_performance_report?: boolean
        }
        Update: {
          application_status_update?: boolean
          document_uploaded_verified?: boolean
          follow_up_due_today?: boolean
          id?: string
          new_lead_assigned?: boolean
          updated_at?: string
          user_id?: string
          visa_decision_received?: boolean
          weekly_performance_report?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          description: string
          id: string
          owner_id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          owner_id: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          owner_id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_responses: {
        Row: {
          author_id: string
          author_name: string
          created_at: string
          id: string
          message: string
          ticket_id: string
        }
        Insert: {
          author_id: string
          author_name?: string
          created_at?: string
          id?: string
          message: string
          ticket_id: string
        }
        Update: {
          author_id?: string
          author_name?: string
          created_at?: string
          id?: string
          message?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_responses_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_responses_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          acceptance_rate: number
          active_applications: number
          city: string
          contact_email: string
          country: string
          created_at: string
          id: string
          intake: string[]
          name: string
          partner_since: string
          website: string
        }
        Insert: {
          acceptance_rate?: number
          active_applications?: number
          city?: string
          contact_email?: string
          country?: string
          created_at?: string
          id?: string
          intake?: string[]
          name: string
          partner_since?: string
          website?: string
        }
        Update: {
          acceptance_rate?: number
          active_applications?: number
          city?: string
          contact_email?: string
          country?: string
          created_at?: string
          id?: string
          intake?: string[]
          name?: string
          partner_since?: string
          website?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin_or_above: { Args: never; Returns: boolean }
    }
    Enums: {
      application_status:
        | "application_started"
        | "documentation"
        | "submission"
        | "approved"
        | "visa_filing"
      document_category:
        | "passport"
        | "transcript"
        | "sop"
        | "lor"
        | "financial"
        | "test_score"
        | "visa"
      document_status: "verified" | "pending_review" | "expired"
      lead_status:
        | "new_lead"
        | "contacted"
        | "follow_up"
        | "qualified"
        | "application_started"
        | "documentation"
        | "submission"
        | "approved"
        | "rejected"
        | "converted"
        | "lost"
        | "closed"
        | "closed_lost"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
      user_role: "super_admin" | "admin" | "staff" | "client"
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
      application_status: [
        "application_started",
        "documentation",
        "submission",
        "approved",
        "visa_filing",
      ],
      document_category: [
        "passport",
        "transcript",
        "sop",
        "lor",
        "financial",
        "test_score",
        "visa",
      ],
      document_status: ["verified", "pending_review", "expired"],
      lead_status: [
        "new_lead",
        "contacted",
        "follow_up",
        "qualified",
        "application_started",
        "documentation",
        "submission",
        "approved",
        "rejected",
        "converted",
        "lost",
        "closed",
        "closed_lost",
      ],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
      user_role: ["super_admin", "admin", "staff", "client"],
    },
  },
} as const
