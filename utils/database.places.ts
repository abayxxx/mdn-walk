export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface PlacesDB {
  public: {
    Tables: {
      places: {
        Row: {
          uuid: string;
          updated_at: string | null;
          name: string | null;
          description: string | null;
          instagram: string | null;
          website: string | null;
          thumbnail: string | null;
          map: string | null;
        };
        Insert: {
          name: string | null;
          description: string | null;
          instagram: string | null;
          website: string | null;
          thumbnail: string | null;
          map: string | null;
          category_uuid: string | null;
        };
        Update: {
          uuid: string;
          updated_at: string | null;
          name: string | null;
          description: string | null;
          instagram: string | null;
          website: string | null;
          thumbnail: string | null;
          map: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
