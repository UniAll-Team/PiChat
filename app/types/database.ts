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
      images: {
        Row: {
          document: string | null
          embedding: unknown | null
          id: number
          last_modified_date: string | null
          name: string
          object_id: string
          user_id: string | null
          voyage_embedding: string | null
        }
        Insert: {
          document?: string | null
          embedding?: unknown | null
          id?: never
          last_modified_date?: string | null
          name: string
          object_id: string
          user_id?: string | null
          voyage_embedding?: string | null
        }
        Update: {
          document?: string | null
          embedding?: unknown | null
          id?: never
          last_modified_date?: string | null
          name?: string
          object_id?: string
          user_id?: string | null
          voyage_embedding?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      _image_details: {
        Row: {
          created_at: string | null
          embedding: unknown | null
          filename: string | null
          id: number | null
          last_accessed_at: string | null
          last_modified_date: string | null
          metadata: Json | null
          name: string | null
          owner_id: string | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
          voyage_embedding: string | null
        }
        Relationships: []
      }
      image_details: {
        Row: {
          created_at: string | null
          embedding: unknown | null
          filename: string | null
          id: number | null
          last_accessed_at: string | null
          last_modified_date: string | null
          metadata: Json | null
          name: string | null
          owner_id: string | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
          voyage_embedding: string | null
        }
        Relationships: []
      }
      normal_sized_images: {
        Row: {
          created_at: string | null
          embedding: unknown | null
          filename: string | null
          id: number | null
          last_accessed_at: string | null
          last_modified_date: string | null
          metadata: Json | null
          name: string | null
          owner_id: string | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
          voyage_embedding: string | null
        }
        Relationships: []
      }
      oversized_images: {
        Row: {
          created_at: string | null
          embedding: unknown | null
          filename: string | null
          id: number | null
          last_accessed_at: string | null
          last_modified_date: string | null
          metadata: Json | null
          name: string | null
          owner_id: string | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
          voyage_embedding: string | null
        }
        Relationships: []
      }
      used_storage: {
        Row: {
          size: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      search_images: {
        Args: {
          query_embedding: string
        }
        Returns: {
          id: number
          owner_id: string
          name: string
          filename: string
          last_modified_date: string
          created_at: string
          updated_at: string
          last_accessed_at: string
          version: string
          metadata: Json
          user_metadata: Json
          similarity: number
        }[]
      }
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
