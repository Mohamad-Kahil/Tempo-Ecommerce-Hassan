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
          .order("display_order", { ascending: true });

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
    url: image.image_url,
    alt: image.alt_text || "Product image",
    type: image.is_video ? "video" : ("image" as "image" | "video"),
  }));
}
