export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface CategoriesDB {
  public: {
    Tables: {
      categories: {
        Row: {
          uuid: string;
          name: string | null;
        };
        Insert: {
          uuid: string;
          name: string | null;
        };
        Update: {
          uuid: string;
          name: string | null;
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
