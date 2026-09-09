export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: "tenant" | "owner" | "admin"
          is_verified: boolean
          is_banned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: "tenant" | "owner" | "admin"
          is_verified?: boolean
          is_banned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          [key: string]: any
        }
      }
      listings: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string | null
          price: number
          currency: string
          category: "appartement" | "studio" | "villa" | "bureau" | "terrain"
          surface_m2: number | null
          rooms_count: number | null
          city: string
          district: string
          address: string | null
          latitude: number | null
          longitude: number | null
          images_urls: string[] // Correction du nom ici
          status: "pending" | "published" | "archived" | "rejected" // Correction ici
          rejection_reason: string | null
          amenities: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description?: string | null
          price: number
          currency?: string
          category: "appartement" | "studio" | "villa" | "bureau" | "terrain"
          surface_m2?: number | null
          rooms_count?: number | null
          city: string
          district: string
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          images_urls: string[]
          status?: "pending" | "published" | "archived" | "rejected"
          rejection_reason?: string | null
          amenities?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          [key: string]: any
        }
      }
    }
    Views: {}
    Functions: {}
  }
}