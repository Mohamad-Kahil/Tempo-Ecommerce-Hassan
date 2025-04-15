import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

type Product = Tables<"products">;

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch products"),
      );
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: searchError } = await supabase
        .from("products")
        .select("*")
        .or(
          `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%`,
        );

      if (searchError) throw searchError;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Search failed"));
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">All Products</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
            <Button type="button" variant="outline">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6">
            {error.message}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="h-[350px] bg-gray-100 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price || 0}
                currency={product.currency || "USD"}
                rating={product.rating || 0}
                reviewCount={product.review_count || 0}
                image={product.image_urls?.[0] || ""}
                supplier={product.supplier_name || ""}
                discount={product.discount_percentage || 0}
                isNew={product.is_new || false}
                inStock={(product.stock ?? 0) > 0}
                product={product}
                onAddToCart={(id) => console.log(`Added product ${id} to cart`)}
                onViewDetails={(id) =>
                  (window.location.href = `/product/${id}`)
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? `We couldn't find any products matching "${searchQuery}". Try a different search term.`
                : "There are no products available at the moment."}
            </p>
            {searchQuery && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  fetchProducts();
                }}
              >
                View All Products
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
