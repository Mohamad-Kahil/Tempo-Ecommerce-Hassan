import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

export type Product = Database["public"]["Tables"]["products"]["Row"];

interface UseProductsOptions {
  categoryId?: string;
  supplierId?: string;
  limit?: number;
  searchQuery?: string;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  region?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Start building the query
        let query = supabase
          .from("products")
          .select("*, suppliers(name)", { count: "exact" });

        // Apply filters based on options
        if (options.categoryId) {
          query = query.eq("category_id", options.categoryId);
        }

        if (options.supplierId) {
          query = query.eq("supplier_id", options.supplierId);
        }

        if (options.featured) {
          query = query.eq("is_featured", true);
        }

        if (options.searchQuery) {
          query = query.ilike("name", `%${options.searchQuery}%`);
        }

        if (options.region) {
          query = query.contains("regions", [options.region]);
        }

        // Apply sorting
        if (options.sortBy) {
          query = query.order(options.sortBy, {
            ascending: options.sortOrder === "asc",
          });
        } else {
          // Default sorting
          query = query.order("created_at", { ascending: false });
        }

        // Apply limit if specified
        if (options.limit) {
          query = query.limit(options.limit);
        }

        // Execute the query
        const { data, error, count } = await query;

        if (error) throw error;

        // Add supplier_name to each product
        const productsWithSupplierName =
          data?.map((product) => ({
            ...product,
            supplier_name: product.suppliers?.name,
          })) || [];

        setProducts(productsWithSupplierName);
        setTotalCount(count || 0);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    options.categoryId,
    options.supplierId,
    options.limit,
    options.searchQuery,
    options.featured,
    options.sortBy,
    options.sortOrder,
    options.region,
  ]);

  return { products, loading, error, totalCount };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("products")
          .select("*, categories(name), suppliers(name)")
          .eq("id", id)
          .single();

        if (error) throw error;

        // Add derived fields
        const enhancedProduct = {
          ...data,
          category_name: data.categories?.name,
          supplier_name: data.suppliers?.name,
        };

        setProduct(enhancedProduct);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}
