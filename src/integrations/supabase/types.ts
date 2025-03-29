export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      diet_meals: {
        Row: {
          category: string
          diet_plan_id: string
          id: string
          name: string
          quantity: string
          time_slot: string
        }
        Insert: {
          category: string
          diet_plan_id: string
          id?: string
          name: string
          quantity: string
          time_slot: string
        }
        Update: {
          category?: string
          diet_plan_id?: string
          id?: string
          name?: string
          quantity?: string
          time_slot?: string
        }
        Relationships: [
          {
            foreignKeyName: "diet_meals_diet_plan_id_fkey"
            columns: ["diet_plan_id"]
            isOneToOne: false
            referencedRelation: "diet_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_plans: {
        Row: {
          created_at: string
          created_by: string | null
          date: string
          id: string
          member_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          member_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diet_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_plans_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      fees: {
        Row: {
          amount_paid: number
          created_at: string
          created_by: string | null
          due_date: string
          id: string
          member_id: string
          payment_date: string
          status: string
        }
        Insert: {
          amount_paid: number
          created_at?: string
          created_by?: string | null
          due_date: string
          id?: string
          member_id: string
          payment_date?: string
          status: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          created_by?: string | null
          due_date?: string
          id?: string
          member_id?: string
          payment_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fees_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fees_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          address: string
          admission_number: string
          created_at: string
          created_by: string | null
          gym_plan: string
          id: string
          name: string
          phone: string
        }
        Insert: {
          address: string
          admission_number: string
          created_at?: string
          created_by?: string | null
          gym_plan: string
          id?: string
          name: string
          phone: string
        }
        Update: {
          address?: string
          admission_number?: string
          created_at?: string
          created_by?: string | null
          gym_plan?: string
          id?: string
          name?: string
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: string
          name: string
          password: string
          role: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          password: string
          role: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          password?: string
          role?: string
          username?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
