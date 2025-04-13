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

const CategoryCard = ({
  name = "Flooring",
  image = "https://images.unsplash.com/photo-1581430872221-d1cfed785922?w=500&q=80",
}) => {
  return (
    <div className="relative overflow-hidden rounded-lg group cursor-pointer">
      <div className="h-[150px] w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
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

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
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
            <a href="#" className="text-sm font-medium hover:text-primary">
              Categories
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
              Deals
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
              Suppliers
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
              Contact
            </a>
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
            <a
              href="#"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Categories
            </a>
            <a
              href="#"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Deals
            </a>
            <a
              href="#"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Suppliers
            </a>
            <a
              href="#"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Contact
            </a>
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            currency="USD"
            rating={4.5}
            reviewCount={10}
            image={product.image_urls?.[0] || ""}
            supplier={product.supplier_name || ""}
            onAddToCart={(id) => console.log(`Added product ${id} to cart`)}
            onViewDetails={(id) => (window.location.href = `/product/${id}`)}
          />
        ))
      ) : (
        // Fallback to static cards if no products are found
        <>
          <ProductCard
            id="1"
            name="Modern Ceramic Floor Tile"
            price={299}
            currency="EGP"
            image="https://images.unsplash.com/photo-1581430872221-d1cfed785922?w=500&q=80"
            rating={4.5}
            reviewCount={120}
            supplier="Premium Tiles Co."
            onAddToCart={(id) => console.log(`Added product ${id} to cart`)}
            onViewDetails={(id) => (window.location.href = `/product/${id}`)}
          />
          <ProductCard
            id="2"
            name="Luxury Bathroom Faucet - Brushed Gold"
            price={1299}
            currency="SAR"
            image="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80"
            rating={4.8}
            reviewCount={85}
            supplier="Royal Fixtures"
            onAddToCart={(id) => console.log(`Added product ${id} to cart`)}
            onViewDetails={(id) => (window.location.href = `/product/${id}`)}
          />
          <ProductCard
            id="3"
            name="Premium Interior Wall Paint - 5L"
            price={450}
            currency="AED"
            image="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80"
            rating={4.2}
            reviewCount={65}
            supplier="ColorMaster"
            onAddToCart={(id) => console.log(`Added product ${id} to cart`)}
            onViewDetails={(id) => (window.location.href = `/product/${id}`)}
          />
          <ProductCard
            id="4"
            name="Marble Kitchen Countertop - Per Meter"
            price={3200}
            currency="KWD"
            image="https://images.unsplash.com/photo-1556911220-bda9f7f7597e?w=500&q=80"
            rating={4.7}
            reviewCount={42}
            supplier="Stone Experts"
            onAddToCart={(id) => console.log(`Added product ${id} to cart`)}
            onViewDetails={(id) => (window.location.href = `/product/${id}`)}
          />
          <ProductCard
            id="5"
            name="Modern Pendant Light Fixture"
            price={899}
            currency="EGP"
            image="https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=500&q=80"
            rating={4.4}
            reviewCount={78}
            supplier="LightWorks"
            onAddToCart={(id) => console.log(`Added product ${id} to cart`)}
            onViewDetails={(id) => (window.location.href = `/product/${id}`)}
          />
        </>
      )}
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            currency="USD"
            rating={4.5}
            reviewCount={10}
            image={product.image_urls?.[0] || ""}
            supplier={product.supplier_name || ""}
            onAddToCart={(id) => console.log(`Added product ${id} to cart`)}
            onViewDetails={(id) => (window.location.href = `/product/${id}`)}
          />
        ))
      ) : (
        // Fallback to static cards if no products are found
        <>
          <ProductCard
            id="6"
            name="Egyptian Marble Flooring Tiles"
            price={499}
            currency="EGP"
            image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80"
            rating={4.6}
            reviewCount={92}
            supplier="Cairo Marble"
            onAddToCart={(id) => console.log(`Added product ${id} to cart`)}
            onViewDetails={(id) => (window.location.href = `/product/${id}`)}
          />
          <ProductCard
            id="7"
            name="Traditional Ceramic Wall Tiles"
            price={199}
            currency="EGP"
            image="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&q=80"
            rating={4.3}
            reviewCount={54}
            supplier="Alexandria Ceramics"
            onAddToCart={(id) => console.log(`Added product ${id} to cart`)}
            onViewDetails={(id) => (window.location.href = `/product/${id}`)}
          />
          <ProductCard
            id="8"
            name="Premium Door Handle Set"
            price={350}
            currency="EGP"
            image="https://images.unsplash.com/photo-1544161513-0179fe746fd5?w=500&q=80"
            rating={4.4}
            reviewCount={37}
            supplier="Hardware Plus"
            onAddToCart={(id) => console.log(`Added product ${id} to cart`)}
            onViewDetails={(id) => (window.location.href = `/product/${id}`)}
          />
          <ProductCard
            id="9"
            name="Modern Ceiling Fan with LED Light"
            price={1200}
            currency="EGP"
            image="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80"
            rating={4.2}
            reviewCount={28}
            supplier="Cool Breeze"
            onAddToCart={(id) => console.log(`Added product ${id} to cart`)}
            onViewDetails={(id) => (window.location.href = `/product/${id}`)}
          />
          <ProductCard
            id="10"
            name="Luxury Bathroom Shower Set"
            price={2499}
            currency="EGP"
            image="https://images.unsplash.com/photo-1564540583246-934409427776?w=500&q=80"
            rating={4.7}
            reviewCount={63}
            supplier="Bath Elegance"
            onAddToCart={(id) => console.log(`Added product ${id} to cart`)}
            onViewDetails={(id) => (window.location.href = `/product/${id}`)}
          />
        </>
      )}
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <CategoryCard
                name="Flooring"
                image="https://images.unsplash.com/photo-1581430872221-d1cfed785922?w=500&q=80"
              />
              <CategoryCard
                name="Paints & Finishes"
                image="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80"
              />
              <CategoryCard
                name="Bathroom Fixtures"
                image="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80"
              />
              <CategoryCard
                name="Kitchen Materials"
                image="https://images.unsplash.com/photo-1556911220-bda9f7f7597e?w=500&q=80"
              />
              <CategoryCard
                name="Lighting"
                image="https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=500&q=80"
              />
              <CategoryCard
                name="Doors & Windows"
                image="https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=500&q=80"
              />
            </div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Premium Tiles Co.",
                  image:
                    "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=500&q=80",
                  description:
                    "Leading supplier of premium tiles and flooring solutions",
                },
                {
                  name: "Royal Fixtures",
                  image:
                    "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=500&q=80",
                  description:
                    "Luxury bathroom and kitchen fixtures for modern homes",
                },
                {
                  name: "Stone Experts",
                  image:
                    "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=500&q=80",
                  description:
                    "Specialists in marble, granite and natural stone products",
                },
              ].map((supplier, index) => (
                <Card key={index} className="overflow-hidden bg-white">
                  <div className="h-[200px] overflow-hidden">
                    <img
                      src={supplier.image}
                      alt={supplier.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">{supplier.name}</h3>
                    <p className="text-muted-foreground">
                      {supplier.description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button variant="outline" className="w-full">
                      View Products
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
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
