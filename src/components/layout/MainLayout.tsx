import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Globe,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";

interface MainLayoutProps {
  children: React.ReactNode;
  direction?: "ltr" | "rtl";
}

const MainLayout = ({ children, direction = "ltr" }: MainLayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { totalItems } = useCart();

  // Mock categories for demonstration
  const categories = [
    {
      name: "Building Materials",
      subcategories: [
        {
          name: "Cement & Concrete",
          subcategories: [
            {
              name: "Portland Cement",
              subcategories: [
                { name: "Type I", subcategories: [] },
                { name: "Type II", subcategories: [] },
              ],
            },
            { name: "Ready Mix", subcategories: [] },
          ],
        },
        { name: "Bricks & Blocks", subcategories: [] },
      ],
    },
    {
      name: "Interior Decoration",
      subcategories: [
        { name: "Flooring", subcategories: [] },
        { name: "Wall Coverings", subcategories: [] },
      ],
    },
    {
      name: "Plumbing",
      subcategories: [],
    },
    {
      name: "Electrical",
      subcategories: [],
    },
  ];

  // Mock regions for demonstration
  const regions = ["Egypt", "Saudi Arabia", "Kuwait", "UAE"];

  return (
    <div dir={direction} className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex flex-col space-y-4">
                    {categories.map((category) => (
                      <div key={category.name} className="space-y-2">
                        <div className="font-medium">{category.name}</div>
                        {category.subcategories.length > 0 && (
                          <div className="pl-4 space-y-1 text-sm">
                            {category.subcategories.map((subcat) => (
                              <div key={subcat.name} className="py-1">
                                {subcat.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                  <div className="mt-auto space-y-4">
                    <div className="space-y-2">
                      <div className="font-medium">Region</div>
                      <div className="flex flex-wrap gap-2">
                        {regions.map((region) => (
                          <Button key={region} variant="outline" size="sm">
                            {region}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium">Language</div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate("/", { replace: true })}
                        >
                          English
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate("/", { replace: true })}
                        >
                          العربية
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">BuildMart</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {categories.map((category) => (
                <DropdownMenu key={category.name}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1">
                      {category.name}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {category.subcategories.map((subcat) => (
                      <DropdownMenuItem key={subcat.name}>
                        {subcat.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </nav>

            {/* Search, User, Cart */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex relative w-full max-w-sm items-center">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pr-10"
                />
                <Search className="absolute right-3 h-4 w-4 text-muted-foreground" />
              </div>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Globe className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => navigate("/", { replace: true })}
                  >
                    English (LTR)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/", { replace: true })}
                  >
                    العربية (RTL)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Account */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Orders</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500">
                    Logout
                  </DropdownMenuItem>
                  <DropdownMenuItem className="font-semibold text-primary">
                    Admin CMS
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Shopping Cart */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/cart")}
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-3 md:hidden relative">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">BuildMart</h3>
              <p className="text-muted-foreground">
                Your one-stop shop for building materials and interior
                decoration across MENA region.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.name}>
                    <Link
                      to="/"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Returns & Refunds
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Regions</h3>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <Button key={region} variant="outline" size="sm">
                    {region}
                  </Button>
                ))}
              </div>
              <h3 className="font-semibold mt-6 mb-2">Language</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/", { replace: true })}
                >
                  English
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/", { replace: true })}
                >
                  العربية
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} BuildMart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
