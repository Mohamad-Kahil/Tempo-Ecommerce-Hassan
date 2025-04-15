import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

export type Category = Database["public"]["Tables"]["categories"]["Row"];

interface UseCategoriesOptions {
  parentId?: string | null;
  limit?: number;
  featured?: boolean;
  region?: string;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        // Start building the query
        let query = supabase.from("categories").select("*", { count: "exact" });

        // Apply filters based on options
        if (options.parentId !== undefined) {
          query = query.eq("parent_id", options.parentId);
        }

        if (options.featured) {
          query = query.eq("is_featured", true);
        }

        if (options.region) {
          query = query.contains("regions", [options.region]);
        }

        // Apply limit if specified
        if (options.limit) {
          query = query.limit(options.limit);
        }

        // Execute the query
        const { data, error, count } = await query;

        if (error) throw error;

        setCategories(data || []);
        setTotalCount(count || 0);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [options.parentId, options.limit, options.featured, options.region]);

  return { categories, loading, error, totalCount };
}

export function useCategory(id: string | undefined) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCategory = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setCategory(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
        console.error("Error fetching category:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  return { category, loading, error };
}

export function useNestedCategories(
  parentId: string | null = null,
  maxDepth: number = 4,
) {
  const [nestedCategories, setNestedCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNestedCategories = async (
      parentId: string | null = null,
      depth: number = 0,
    ) => {
      if (depth >= maxDepth) return [];

      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("parent_id", parentId);

        if (error) throw error;

        if (!data || data.length === 0) return [];

        const categoriesWithChildren = await Promise.all(
          data.map(async (category) => {
            const subcategories = await fetchNestedCategories(
              category.id,
              depth + 1,
            );
            return {
              ...category,
              subcategories,
            };
          }),
        );

        return categoriesWithChildren;
      } catch (err) {
        console.error("Error fetching nested categories:", err);
        return [];
      }
    };

    const loadCategories = async () => {
      try {
        setLoading(true);
        const result = await fetchNestedCategories(parentId);
        setNestedCategories(result);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [parentId, maxDepth]);

  return { nestedCategories, loading, error };
}
