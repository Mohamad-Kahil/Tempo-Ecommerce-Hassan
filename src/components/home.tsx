import React from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ShoppingBag,
  Star,
  Search,
  Globe,
  Menu,
  X,
  User,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useSuppliers } from "@/hooks/useSuppliers";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface CategoryCardProps {
  name?: string;
  image?: string;
  id?: string;
  onClick?: (id: string) => void;
}

const CategoryCard = ({
  name = "Flooring",
  image = "https://images.unsplash.com/photo-1581430872221-d1cfed785922?w=500&q=80",
  id = "",
  onClick = () => {},
}: CategoryCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg group cursor-pointer">
      <div className="h-[150px] w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4"
        onClick={() => onClick(id)}
      >
        <h3 className="text-white font-medium">{name}</h3>
      </div>
    </div>
  );
};

const AdvertBanner = ({
  image = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
}) => {
  return (
    <div className="relative overflow-hidden rounded-lg h-[200px] w-full">
      <img
        src={image}
        alt="Advertisement"
        className="w-full h-full object-cover"
      />
      <div className="absolute top-4 left-4 bg-white/90 px-2 py-1 text-xs rounded">
        Advertisement
      </div>
    </div>
  );
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-xl font-bold">BuildMart</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <div className="relative group">
              <Link
                to="/categories"
                className="text-sm font-medium hover:text-primary"
              >
                Categories
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2 hidden group-hover:block z-50">
                <Link
                  to="/category/flooring"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                >
                  Flooring
                </Link>
                <Link
                  to="/category/paints"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                >
                  Paints & Finishes
                </Link>
                <Link
                  to="/category/bathroom"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                >
                  Bathroom Fixtures
                </Link>
                <Link
                  to="/category/kitchen"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                >
                  Kitchen Materials
                </Link>
              </div>
            </div>
            <div className="relative group">
              <Link
                to="/products"
                className="text-sm font-medium hover:text-primary"
              >
                Products
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2 hidden group-hover:block z-50">
                <Link
                  to="/products/featured"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                >
                  Featured Products
                </Link>
                <Link
                  to="/products/new"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                >
                  New Arrivals
                </Link>
                <Link
                  to="/products/popular"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                >
                  Popular Products
                </Link>
              </div>
            </div>
            <Link
              to="/suppliers"
              className="text-sm font-medium hover:text-primary"
            >
              Suppliers
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium hover:text-primary"
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5" />
            </Button>
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="mr-2">
                    Admin CMS
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link to="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Search bar */}
        <div className="py-3">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for products, brands, categories..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchValue}
                onChange={handleSearch}
                type="text"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3 space-y-2">
            <Link
              to="/"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/categories"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Categories
            </Link>
            <Link
              to="/products"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Products
            </Link>
            <Link
              to="/suppliers"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Suppliers
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Contact
            </Link>
            <Link
              to="/admin"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Admin CMS
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block py-2 text-sm font-medium hover:text-primary"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block py-2 text-sm font-medium hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-sm font-medium hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block py-2 text-sm font-medium hover:text-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const CategoriesGrid = () => {
  const { categories, loading, error } = useCategories({
    limit: 6,
    // Remove featured flag as the column doesn't exist
    // featured: true,
  });
  const navigate = useNavigate();

  const handleCategoryClick = (id: string) => {
    navigate(`/category/${id}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-[150px] w-full bg-gray-100 animate-pulse rounded-lg"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading categories: {error.message}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No categories found in the database.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          id={category.id}
          name={category.name}
          image={
            category.image_url ||
            "https://placehold.co/500x500/e2e8f0/475569?text=No+Image"
          }
          onClick={handleCategoryClick}
        />
      ))}
    </div>
  );
};

const SuppliersList = () => {
  const { suppliers, loading, error } = useSuppliers({ limit: 3 });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow animate-pulse">
            <div className="h-[200px] bg-gray-200"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading suppliers: {error.message}
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No suppliers found in the database.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {suppliers.map((supplier) => (
        <Card key={supplier.id} className="overflow-hidden bg-white">
          <div className="h-[200px] overflow-hidden bg-gray-100 flex items-center justify-center">
            {supplier.logo_url ? (
              <img
                src={supplier.logo_url}
                alt={supplier.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 text-center p-4">
                <p className="text-lg font-medium">{supplier.name}</p>
                <p className="text-sm">No logo available</p>
              </div>
            )}
          </div>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2">{supplier.name}</h3>
            <p className="text-muted-foreground">
              {supplier.description || "No description available"}
            </p>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                (window.location.href = `/supplier/${supplier.id}`)
              }
            >
              View Products
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">BuildMart</h3>
            <p className="text-gray-400 text-sm">
              Your one-stop shop for building materials and interior decoration
              across MENA region.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Flooring
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Paints & Finishes
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Bathroom Fixtures
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Kitchen Materials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Lighting
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Region</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Egypt
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Saudi Arabia
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Kuwait
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  UAE
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2023 BuildMart. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              English
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              العربية
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FeaturedProducts = () => {
  const { products, loading, error } = useProducts({
    featured: true,
    limit: 5,
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="w-full max-w-[280px] h-[380px] bg-gray-100 animate-pulse rounded-md"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading products: {error.message}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No featured products found in the database.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
          onViewDetails={(id) => (window.location.href = `/product/${id}`)}
        />
      ))}
    </div>
  );
};

const PopularProducts = () => {
  // Fetch popular products for the current region (Egypt in this example)
  const { products, loading, error } = useProducts({ limit: 5 });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="w-full max-w-[280px] h-[380px] bg-gray-100 animate-pulse rounded-md"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading products: {error.message}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No products found in the database.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
          onViewDetails={(id) => (window.location.href = `/product/${id}`)}
        />
      ))}
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {[
                {
                  image:
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
                  title: "Transform Your Space",
                  description:
                    "Discover premium building materials for your dream home",
                },
                {
                  image:
                    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
                  title: "Kitchen Essentials",
                  description:
                    "Modern fixtures and materials for your kitchen renovation",
                },
                {
                  image:
                    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
                  title: "Bathroom Luxury",
                  description: "Elegant fixtures and tiles for your bathroom",
                },
              ].map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[400px] md:h-[500px] w-full">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-8 md:px-16">
                      <h2 className="text-white text-3xl md:text-5xl font-bold mb-4">
                        {slide.title}
                      </h2>
                      <p className="text-white text-lg md:text-xl mb-6 max-w-md">
                        {slide.description}
                      </p>
                      <div>
                        <Button className="bg-primary hover:bg-primary/90">
                          Shop Now
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </section>

        {/* Categories Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Browse Categories</h2>
              <Button variant="link">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <CategoriesGrid />
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="new">New Arrivals</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <FeaturedProducts />
          </div>
        </section>

        {/* Advertisement Banner */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <AdvertBanner image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80" />
          </div>
        </section>

        {/* Popular in Your Region */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Popular in Egypt</h2>
              <Button variant="link">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <PopularProducts />
          </div>
        </section>

        {/* Supplier Spotlight */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Featured Suppliers</h2>
            <SuppliersList />
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="mb-8 max-w-2xl mx-auto">
              Stay updated with the latest products, trends, and exclusive
              offers in building materials and interior decoration.
            </p>

            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button className="bg-white text-primary hover:bg-white/90">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
