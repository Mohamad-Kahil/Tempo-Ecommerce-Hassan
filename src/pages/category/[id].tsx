import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, Filter, SlidersHorizontal } from "lucide-react";

type Category = Tables<"categories">;
type Product = Tables<"products">;

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        if (!id) return;

        // Fetch category
        const { data: categoryData, error: categoryError } = await supabase
          .from("categories")
          .select("*")
          .eq("id", id)
          .single();

        if (categoryError) throw categoryError;
        setCategory(categoryData);

        // Fetch products in this category
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("category_id", id)
          .order("created_at", { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch category data"),
        );
        console.error("Error fetching category data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 bg-gray-100 animate-pulse rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="h-[350px] bg-gray-100 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          Error Loading Category
        </h2>
        <p className="text-gray-600">
          {error?.message || "Category not found"}
        </p>
        <Button className="mt-4" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-primary">
            Home
          </a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <a href="/categories" className="hover:text-primary">
            Categories
          </a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-700">{category.name}</span>
        </div>

        {/* Category Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
            <p className="text-gray-600">
              {category.description ||
                `Browse our selection of ${category.name}`}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
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
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              There are no products in this category yet.
            </p>
            <Button asChild>
              <a href="/">Continue Shopping</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
