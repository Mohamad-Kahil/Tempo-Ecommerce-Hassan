import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductGallery from "@/components/product/ProductGallery";
import ProductCard from "@/components/product/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Mock product data - would be fetched from API in real implementation
  const product = {
    id: id || "1",
    name: "Premium Ceramic Floor Tile - Marble Effect",
    description:
      "High-quality ceramic floor tiles with elegant marble effect. Perfect for kitchens, bathrooms, and living areas. Durable, stain-resistant, and easy to clean.",
    price: 249.99,
    currency: "AED",
    rating: 4.7,
    reviewCount: 124,
    stock: 56,
    sku: "TL-MRB-001",
    brand: "LuxTile",
    supplier: "Al Futtaim Building Materials",
    category: "Flooring > Tiles > Ceramic > Marble Effect",
    images: [
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7ddd0d03d62?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e4a92f082f6?w=800&q=80",
      "https://images.unsplash.com/photo-1600607688066-89667a2157c2?w=800&q=80",
    ],
    specifications: [
      { name: "Material", value: "Ceramic" },
      { name: "Size", value: "60cm x 60cm" },
      { name: "Thickness", value: "10mm" },
      { name: "Finish", value: "Polished" },
      { name: "Color", value: "White/Gray" },
      { name: "Water Absorption", value: "<0.5%" },
      { name: "Slip Resistance", value: "R9" },
      { name: "Package Quantity", value: "6 tiles (2.16 sq.m)" },
    ],
    features: [
      "Stain resistant",
      "Scratch resistant",
      "Frost resistant",
      "Easy to clean",
      "Low maintenance",
      "Suitable for underfloor heating",
    ],
    regions: ["UAE", "KSA", "Kuwait", "Egypt"],
    deliveryTime: "3-5 business days",
    tags: ["ceramic", "tile", "marble-effect", "flooring", "interior"],
  };

  // Mock related products
  const relatedProducts = [
    {
      id: "2",
      name: "Tile Adhesive - Premium Grade",
      price: 89.99,
      currency: "AED",
      rating: 4.5,
      reviewCount: 78,
      image:
        "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&q=80",
      supplier: "Al Futtaim Building Materials",
    },
    {
      id: "3",
      name: "Tile Grout - White",
      price: 45.99,
      currency: "AED",
      rating: 4.3,
      reviewCount: 56,
      image:
        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
      supplier: "Dubai Ceramics",
    },
    {
      id: "4",
      name: "Tile Spacers (200 pcs)",
      price: 12.99,
      currency: "AED",
      rating: 4.8,
      reviewCount: 112,
      image:
        "https://images.unsplash.com/photo-1581092160607-ee22731c9c7c?w=800&q=80",
      supplier: "Tools & More",
    },
    {
      id: "5",
      name: "Tile Cutter - Professional",
      price: 349.99,
      currency: "AED",
      rating: 4.6,
      reviewCount: 43,
      image:
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80",
      supplier: "Tools & More",
    },
  ];

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    // In a real app, this would add the product to the cart
    console.log(`Added ${product.name} to cart, quantity: ${quantity}`);
    // Optionally navigate to cart
    // navigate('/cart');
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 text-sm">
        <div className="flex items-center text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <a href="/category/flooring" className="hover:text-primary">
            Flooring
          </a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <a href="/category/flooring/tiles" className="hover:text-primary">
            Tiles
          </a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <a
            href="/category/flooring/tiles/ceramic"
            className="hover:text-primary"
          >
            Ceramic
          </a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground font-medium truncate">
            {product.name}
          </span>
        </div>
      </div>

      {/* Product Main Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Gallery */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <ProductGallery productId={id} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <span className="text-sm text-muted-foreground">
                  SKU: {product.sku}
                </span>
              </div>
            </div>

            <div className="flex items-baseline">
              <span className="text-3xl font-bold">
                {product.currency} {product.price.toFixed(2)}
              </span>
              <span className="ml-2 text-sm text-muted-foreground">
                per package
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-32 text-sm font-medium">Brand:</div>
                <div>{product.brand}</div>
              </div>
              <div className="flex items-center">
                <div className="w-32 text-sm font-medium">Supplier:</div>
                <div>{product.supplier}</div>
              </div>
              <div className="flex items-center">
                <div className="w-32 text-sm font-medium">Availability:</div>
                <div className="flex items-center">
                  {product.stock > 0 ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      In Stock ({product.stock} available)
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-32 text-sm font-medium">Delivery:</div>
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-primary" />
                  {product.deliveryTime}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={decrementQuantity}
                  className="px-3 py-2 text-lg border-r hover:bg-muted transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 w-12 text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="px-3 py-2 text-lg border-l hover:bg-muted transition-colors"
                >
                  +
                </button>
              </div>
              <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Advertisement Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-blue-800">
                  Special Offer from {product.supplier}
                </h3>
                <p className="text-sm text-blue-600">
                  Get 10% off when you buy 3 or more packages!
                </p>
              </div>
              <Button
                variant="outline"
                className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                View Offer
              </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="specifications"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="features"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
            >
              Features
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
            >
              Reviews ({product.reviewCount})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Available in Regions:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.regions.map((region) => (
                      <Badge key={region} variant="outline">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex border-b pb-2">
                      <div className="w-1/2 font-medium">{spec.name}:</div>
                      <div className="w-1/2 text-muted-foreground">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="features" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">Customer Reviews</h3>
                  <p className="text-muted-foreground">
                    Reviews will be displayed here.
                  </p>
                  <Button className="mt-4" variant="outline">
                    Write a Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Google Ads Banner */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Advertisement</p>
          <div className="h-24 flex items-center justify-center bg-gray-200 rounded">
            <span className="text-gray-400">Google Ads Banner Placeholder</span>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Recommended Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              currency={product.currency}
              rating={product.rating}
              reviewCount={product.reviewCount}
              image={product.image}
              supplier={product.supplier}
            />
          ))}
        </div>
      </div>

      {/* Supplier Advertisement */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                From {product.supplier}
              </h3>
              <p className="text-blue-600 max-w-md">
                Discover our complete range of premium building materials for
                your next project.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                View Catalog
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Contact Supplier
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="container mx-auto px-4 py-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts
            .slice(0, 4)
            .reverse()
            .map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                currency={product.currency}
                rating={product.rating}
                reviewCount={product.reviewCount}
                image={product.image}
                supplier={product.supplier}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
