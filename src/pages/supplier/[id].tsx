import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

type Supplier = Tables<"suppliers">;
type Product = Tables<"products">;

const SupplierPage = () => {
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSupplierAndProducts = async () => {
      try {
        setLoading(true);
        if (!id) return;

        // Fetch supplier
        const { data: supplierData, error: supplierError } = await supabase
          .from("suppliers")
          .select("*")
          .eq("id", id)
          .single();

        if (supplierError) throw supplierError;
        setSupplier(supplierData);

        // Fetch products from this supplier
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("supplier_id", id)
          .order("created_at", { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch supplier data"),
        );
        console.error("Error fetching supplier data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierAndProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 bg-gray-100 animate-pulse rounded w-1/4 mb-8"></div>
        <div className="h-40 bg-gray-100 animate-pulse rounded mb-8"></div>
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

  if (error || !supplier) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          Error Loading Supplier
        </h2>
        <p className="text-gray-600">
          {error?.message || "Supplier not found"}
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
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/suppliers" className="hover:text-primary">
            Suppliers
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-700">{supplier.name}</span>
        </div>

        {/* Supplier Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {supplier.logo_url ? (
                <img
                  src={supplier.logo_url}
                  alt={supplier.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-3xl font-bold text-gray-300">
                  {supplier.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{supplier.name}</h1>
              <p className="text-gray-600 mb-4">
                {supplier.description || "No description available"}
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {supplier.website && (
                  <Button variant="outline" asChild>
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>
                  </Button>
                )}
                <Button>Contact Supplier</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Products from {supplier.name}
          </h2>

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
                  supplier={supplier.name}
                  discount={product.discount || 0}
                  isNew={product.is_new || false}
                  inStock={(product.stock ?? 0) > 0}
                  product={product}
                  onAddToCart={(id) =>
                    console.log(`Added product ${id} to cart`)
                  }
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
                This supplier doesn't have any products listed yet.
              </p>
              <Button asChild>
                <Link to="/">Browse All Products</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Supplier Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Supplier Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">Contact Information</h3>
              <ul className="mt-2 space-y-2">
                {supplier.email && (
                  <li className="text-gray-600">Email: {supplier.email}</li>
                )}
                {supplier.phone && (
                  <li className="text-gray-600">Phone: {supplier.phone}</li>
                )}
                {supplier.address && (
                  <li className="text-gray-600">Address: {supplier.address}</li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Business Details</h3>
              <ul className="mt-2 space-y-2">
                {supplier.established && (
                  <li className="text-gray-600">
                    Established: {supplier.established}
                  </li>
                )}
                {supplier.regions && supplier.regions.length > 0 && (
                  <li className="text-gray-600">
                    Regions: {supplier.regions.join(", ")}
                  </li>
                )}
                {supplier.certifications &&
                  supplier.certifications.length > 0 && (
                    <li className="text-gray-600">
                      Certifications: {supplier.certifications.join(", ")}
                    </li>
                  )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierPage;
