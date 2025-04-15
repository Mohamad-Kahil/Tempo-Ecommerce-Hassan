import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

export type ProductImage =
  Database["public"]["Tables"]["product_images"]["Row"];

export function useProductImages(productId: string | undefined) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchImages = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("product_images")
          .select("*")
          .eq("product_id", productId)
          .order("sort_order", { ascending: true });

        if (error) throw error;

        setImages(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
        console.error("Error fetching product images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [productId]);

  return { images, loading, error };
}

// Helper function to transform database images to component format
export function transformImagesToGalleryFormat(images: ProductImage[]) {
  return images.map((image) => ({
    id: image.id,
    url: image.url,
    alt: image.alt || "Product image",
    type: image.type as "image" | "video",
  }));
}

// Fallback function to handle product with image_urls array instead of separate images
export function useProductImageUrls(productId: string | undefined) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProductWithImages = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("products")
          .select("image_urls")
          .eq("id", productId)
          .single();

        if (error) throw error;

        setImages(data?.image_urls || []);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
        console.error("Error fetching product image URLs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductWithImages();
  }, [productId]);

  return { images, loading, error };
}
