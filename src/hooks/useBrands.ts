import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Brand {
  id: string;
  name: string;
  name_ar?: string | null;
  description?: string | null;
  description_ar?: string | null;
  logo_url?: string | null;
  website_url?: string | null;
  supplier_id?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string | null;
}

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("brands")
          .select("*")
          .eq("is_active", true)
          .order("name", { ascending: true });

        if (error) throw error;
        setBrands(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
        console.error("Error fetching brands:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, loading, error };
}
