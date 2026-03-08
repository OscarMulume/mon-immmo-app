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
      listings: {
        Row: {
          id: string
          created_at: string
          title: string
          price: number
          category: string
          city: string
          district: string
          description: string
          images: string[]
          latitude: number
          longitude: number
          owner_id: string
          status: "pending" | "approved" | "rejected"
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          price: number
          category: string
          city: string
          district: string
          description: string
          images: string[]
          latitude?: number
          longitude?: number
          owner_id: string
          status?: "pending" | "approved" | "rejected"
        }
        Update: {
          id?: string
          [key: string]: any
        }
      }
    }
    Views: {}
    Functions: {}
  }
}