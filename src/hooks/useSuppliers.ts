import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

export type Supplier = Database["public"]["Tables"]["suppliers"]["Row"];

interface UseSuppliersOptions {
  limit?: number;
  offset?: number;
  region?: string;
  search?: string;
}

export function useSuppliers(options: UseSuppliersOptions = {}) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);

        // Start building the query
        let query = supabase.from("suppliers").select("*", { count: "exact" });

        // Apply filters based on options
        if (options.region) {
          query = query.contains("regions", [options.region]);
        }

        if (options.search) {
          query = query.ilike("name", `%${options.search}%`);
        }

        // Apply pagination
        if (options.limit) {
          query = query.limit(options.limit);
        }

        if (options.offset) {
          query = query.range(
            options.offset,
            options.offset + (options.limit || 10) - 1,
          );
        }

        // Execute the query
        const { data, error, count } = await query;

        if (error) throw error;

        setSuppliers(data || []);
        setTotalCount(count || 0);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
        console.error("Error fetching suppliers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [options.limit, options.offset, options.region, options.search]);

  return { suppliers, loading, error, totalCount };
}

export function useSupplier(id: string | undefined) {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchSupplier = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("suppliers")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setSupplier(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
        console.error("Error fetching supplier:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id]);

  return { supplier, loading, error };
}
