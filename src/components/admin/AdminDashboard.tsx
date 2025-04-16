import React, { useState } from "react";
import ProductsManagement from "./ProductsManagement";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  BarChart,
  Image,
  FileText,
  Layers,
  Globe,
  BookOpen,
  PanelLeft,
} from "lucide-react";
import ContentManagement from "./ContentManagement";
import SupplierManagement from "./SupplierManagement";
import Categories from "./Categories";
import ProductsManagementStoryboard from "./ProductsManagementStoryboard";
import HomepageLayoutManager from "./HomepageLayoutManager";
import BrandsManagement from "./BrandsManagement";

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin, isLoading, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Admin dashboard is now accessible to all users
  // No authentication check needed

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Logged in as: <span className="font-medium">{user?.email}</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/" target="_blank" rel="noopener noreferrer">
                  View Site
                </a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <Button
                      variant={activeTab === "overview" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("overview")}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Overview
                    </Button>
                    <Button
                      variant={activeTab === "products" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("products")}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Products
                    </Button>
                    <Button
                      variant={activeTab === "brands" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("brands")}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Brands
                    </Button>
                    <Button
                      variant={activeTab === "categories" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("categories")}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Categories
                    </Button>
                    <Button
                      variant={activeTab === "suppliers" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("suppliers")}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Suppliers
                    </Button>
                    <Button
                      variant={activeTab === "users" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("users")}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Users
                    </Button>
                    <Button
                      variant={activeTab === "content" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("content")}
                    >
                      <Image className="mr-2 h-4 w-4" />
                      Content
                    </Button>
                    <Button
                      variant={activeTab === "analytics" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("analytics")}
                    >
                      <BarChart className="mr-2 h-4 w-4" />
                      Analytics
                    </Button>
                    <Button
                      variant={
                        activeTab === "homepage_layout" ? "default" : "ghost"
                      }
                      className="w-full justify-start"
                      onClick={() => setActiveTab("homepage_layout")}
                    >
                      <Layers className="mr-2 h-4 w-4" />
                      Homepage Layout
                    </Button>
                    <Button
                      variant={activeTab === "pages" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("pages")}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Pages
                    </Button>
                    <Button
                      variant={activeTab === "seo" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("seo")}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      SEO Settings
                    </Button>
                    <Button
                      variant={activeTab === "settings" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3 space-y-6">
              {activeTab === "overview" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard Overview</CardTitle>
                    <CardDescription>
                      Welcome to the BuildMart admin dashboard. Here you can
                      manage your e-commerce platform.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-2xl font-bold">128</div>
                          <div className="text-sm text-muted-foreground">
                            Total Products
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-2xl font-bold">24</div>
                          <div className="text-sm text-muted-foreground">
                            Categories
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-2xl font-bold">1,024</div>
                          <div className="text-sm text-muted-foreground">
                            Registered Users
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "products" && <ProductsManagementStoryboard />}

              {activeTab === "brands" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Brand Management</CardTitle>
                    <CardDescription>
                      Manage brands for your products and link them to
                      suppliers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BrandsManagement />
                  </CardContent>
                </Card>
              )}

              {activeTab === "categories" && <Categories />}

              {activeTab === "suppliers" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Supplier Management</CardTitle>
                    <CardDescription>
                      Manage your suppliers and their information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SupplierManagement />
                  </CardContent>
                </Card>
              )}

              {activeTab === "users" && (
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage user accounts and permissions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      This section will be implemented in the next phase.
                    </p>
                  </CardContent>
                </Card>
              )}

              {activeTab === "content" && <ContentManagement />}

              {activeTab === "analytics" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>
                      View sales and user engagement analytics.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      This section will be implemented in the next phase.
                    </p>
                  </CardContent>
                </Card>
              )}

              {activeTab === "homepage_layout" && <HomepageLayoutManager />}

              {activeTab === "pages" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Page Builder</CardTitle>
                    <CardDescription>
                      Create and manage custom pages with rich content editor.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      This feature allows you to create custom pages with
                      multilingual content, SEO settings, and publish controls.
                    </p>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm font-medium">Coming soon</p>
                      <p className="text-xs text-muted-foreground">
                        This feature is currently being implemented.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "seo" && (
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                    <CardDescription>
                      Manage SEO settings for products, categories, and pages.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      This feature allows you to set meta titles, descriptions,
                      slugs, and OG images for better search engine
                      optimization.
                    </p>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm font-medium">Coming soon</p>
                      <p className="text-xs text-muted-foreground">
                        This feature is currently being implemented.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>
                      Configure your store settings and preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      This section will be implemented in the next phase.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
