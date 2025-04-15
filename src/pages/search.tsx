import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

type Product = Tables<"products">;

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // Update URL without reloading the page
      const newUrl = `${window.location.pathname}?q=${encodeURIComponent(searchQuery)}`;
      window.history.pushState({ path: newUrl }, "", newUrl);

      // Search products
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

  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Search Products</h1>

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

        {/* Search Results */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6">
            {error.message}
          </div>
        )}

        {initialQuery && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Search Results for "{initialQuery}"
            </h2>
            <p className="text-gray-600">{products.length} products found</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
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
                discount={product.discount || 0}
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
        ) : initialQuery ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any products matching "{initialQuery}". Try a
              different search term.
            </p>
            <Button asChild>
              <a href="/">Browse All Products</a>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;
