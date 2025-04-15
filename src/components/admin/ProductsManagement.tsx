import React, { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  Plus,
  Edit,
  Save,
  X,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Upload,
  CheckSquare,
  Square,
  AlertCircle,
  Image,
  Loader2,
  DollarSign,
  Tag,
  Layers,
  Package,
} from "lucide-react";
import { Tables } from "@/types/supabase";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

type Product = Tables<"products">;
type Category = Tables<"categories">;

const ITEMS_PER_PAGE = 5;

const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    category_id: null,
    image_urls: [],
    specifications: {},
    is_featured: false,
    sku: "",
  });
  // State to control the visibility of the add product form
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Image upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Bulk operations state
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering state
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setAllProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;

      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const validateForm = (product: Partial<Product>) => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!product.name || product.name.trim() === "") {
      newErrors.name = "Name is required";
    } else if (product.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    } else if (product.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters long";
    }

    // Price validation
    if (product.price === undefined || product.price === null) {
      newErrors.price = "Price is required";
    } else if (product.price < 0) {
      newErrors.price = "Price cannot be negative";
    }

    // Stock validation
    if (
      product.stock_quantity === undefined ||
      product.stock_quantity === null
    ) {
      newErrors.stock_quantity = "Stock quantity is required";
    } else if (product.stock_quantity < 0) {
      newErrors.stock_quantity = "Stock quantity cannot be negative";
    }

    // SKU validation
    if (!product.sku || product.sku.trim() === "") {
      newErrors.sku = "SKU is required";
    } else if (!/^[A-Za-z0-9-_]+$/.test(product.sku)) {
      newErrors.sku =
        "SKU can only contain letters, numbers, hyphens, and underscores";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const fileExt = file.name.split(".").pop();
      const fileName = `product_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      // Create a simulated progress update
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      console.log("Uploading file to path:", filePath);
      const { error: uploadError, data } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type, // Add explicit content type
        });

      clearInterval(progressInterval);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      setUploadProgress(100);

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      console.log("File uploaded successfully, public URL:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description:
          "There was an error uploading your image: " +
          (error instanceof Error ? error.message : String(error)),
        variant: "destructive",
      });
      return null;
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    isEdit = false,
  ) => {
    console.log("File input change detected");
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File selected:", file.name, file.type, file.size);

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPG, PNG, GIF, or WEBP image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Starting upload process");
      const imageUrl = await uploadImage(file);
      console.log("Upload completed, URL:", imageUrl);

      if (imageUrl) {
        if (isEdit && editingProduct) {
          const updatedImageUrls = [...(editingProduct.image_urls || [])];
          updatedImageUrls.push(imageUrl);
          setEditingProduct({
            ...editingProduct,
            image_urls: updatedImageUrls,
          });
        } else {
          const updatedImageUrls = [...(newProduct.image_urls || [])];
          updatedImageUrls.push(imageUrl);
          setNewProduct({
            ...newProduct,
            image_urls: updatedImageUrls,
          });
        }
        toast({
          title: "Upload Successful",
          description: "Image has been uploaded successfully.",
        });
      }
    } catch (error) {
      console.error("Error in handleImageSelect:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    }

    // Reset the file input so the same file can be selected again
    if (isEdit) {
      if (editFileInputRef.current) editFileInputRef.current.value = "";
    } else {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number, isEdit = false) => {
    if (isEdit && editingProduct) {
      const updatedImageUrls = [...(editingProduct.image_urls || [])];
      updatedImageUrls.splice(index, 1);
      setEditingProduct({
        ...editingProduct,
        image_urls: updatedImageUrls,
      });
    } else {
      const updatedImageUrls = [...(newProduct.image_urls || [])];
      updatedImageUrls.splice(index, 1);
      setNewProduct({
        ...newProduct,
        image_urls: updatedImageUrls,
      });
    }
  };

  const handleAddProduct = async () => {
    if (!validateForm(newProduct)) return;

    try {
      setIsSaving(true);

      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name: newProduct.name,
            description: newProduct.description || "",
            price: newProduct.price || 0,
            stock_quantity: newProduct.stock_quantity || 0,
            category_id: newProduct.category_id || null,
            image_urls: newProduct.image_urls || [],
            specifications: newProduct.specifications || {},
            is_featured: newProduct.is_featured || false,
            sku: newProduct.sku || "",
          },
        ])
        .select();

      if (error) throw error;

      if (data) {
        setAllProducts([...allProducts, ...data]);
        setNewProduct({
          name: "",
          description: "",
          price: 0,
          stock_quantity: 0,
          category_id: null,
          image_urls: [],
          specifications: {},
          is_featured: false,
          sku: "",
        });
        setIsAdding(false);
        toast({
          title: "Product Added",
          description: `${data[0].name} has been added successfully.`,
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !validateForm(editingProduct)) return;

    try {
      setIsSaving(true);

      const { data, error } = await supabase
        .from("products")
        .update({
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          stock_quantity: editingProduct.stock_quantity,
          category_id: editingProduct.category_id,
          image_urls: editingProduct.image_urls,
          specifications: editingProduct.specifications,
          is_featured: editingProduct.is_featured,
          sku: editingProduct.sku,
        })
        .eq("id", editingProduct.id)
        .select();

      if (error) throw error;

      if (data) {
        setAllProducts(
          allProducts.map((prod) =>
            prod.id === editingProduct.id ? data[0] : prod,
          ),
        );
        setEditingProduct(null);
        toast({
          title: "Product Updated",
          description: `${data[0].name} has been updated successfully.`,
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      setAllProducts(allProducts.filter((prod) => prod.id !== id));
      setSelectedProducts(selectedProducts.filter((prodId) => prodId !== id));

      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    try {
      setIsBulkDeleting(true);

      for (const id of selectedProducts) {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
      }

      setAllProducts(
        allProducts.filter((prod) => !selectedProducts.includes(prod.id)),
      );
      setSelectedProducts([]);
      setIsDeleteDialogOpen(false);

      toast({
        title: "Products Deleted",
        description: `${selectedProducts.length} products have been deleted successfully.`,
      });
    } catch (error) {
      console.error("Error bulk deleting products:", error);
      toast({
        title: "Error",
        description: "Failed to delete products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const toggleProductSelection = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((prodId) => prodId !== id)
        : [...prev, id],
    );
  };

  const toggleAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((prod) => prod.id));
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setErrors({});
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      category_id: null,
      image_urls: [],
      specifications: {},
      is_featured: false,
      sku: "",
    });
    setErrors({});
  };

  // Apply filters and pagination to products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const nameMatch =
        !filters.name ||
        product.name.toLowerCase().includes(filters.name.toLowerCase());
      const categoryMatch =
        !filters.category || product.category_id === filters.category;
      const minPriceMatch =
        !filters.minPrice || product.price >= parseFloat(filters.minPrice);
      const maxPriceMatch =
        !filters.maxPrice || product.price <= parseFloat(filters.maxPrice);
      return nameMatch && categoryMatch && minPriceMatch && maxPriceMatch;
    });
  }, [allProducts, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  // Update products state for rendering
  useEffect(() => {
    setProducts(paginatedProducts);
  }, [paginatedProducts]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Products Management</CardTitle>
            <CardDescription>
              Manage your product inventory, pricing, and details.
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            {selectedProducts.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Selected (
                {selectedProducts.length})
              </Button>
            )}
            <Button
              onClick={() => {
                console.log("Add Product button clicked");
                setIsAdding(true);
              }}
              disabled={isAdding}
              className="ml-auto"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isFilterOpen && (
            <Card className="mb-6 border border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Filter Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="filter-name">Name</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="filter-name"
                        placeholder="Search by name"
                        className="pl-8"
                        value={filters.name}
                        onChange={(e) =>
                          handleFilterChange("name", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filter-category">Category</Label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) =>
                        handleFilterChange("category", value)
                      }
                    >
                      <SelectTrigger id="filter-category">
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filter-min-price">Min Price</Label>
                    <Input
                      id="filter-min-price"
                      type="number"
                      placeholder="Min price"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filter-max-price">Max Price</Label>
                    <Input
                      id="filter-max-price"
                      type="number"
                      placeholder="Max price"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isAdding && (
            <Card className="mb-6 border-dashed border-2 border-primary/50">
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-name">Product Name</Label>
                      <Input
                        id="new-name"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            name: e.target.value,
                          })
                        }
                        placeholder="Product name"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-sku">SKU</Label>
                      <Input
                        id="new-sku"
                        value={newProduct.sku}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            sku: e.target.value,
                          })
                        }
                        placeholder="SKU-12345"
                      />
                      {errors.sku && (
                        <p className="text-sm text-red-500">{errors.sku}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-description">Description</Label>
                    <Textarea
                      id="new-description"
                      value={newProduct.description || ""}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      placeholder="Product description"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-price">Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="new-price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              price: parseFloat(e.target.value),
                            })
                          }
                          placeholder="0.00"
                          className="pl-8"
                        />
                      </div>
                      {errors.price && (
                        <p className="text-sm text-red-500">{errors.price}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-stock">Stock Quantity</Label>
                      <div className="relative">
                        <Package className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="new-stock"
                          type="number"
                          value={newProduct.stock_quantity}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              stock_quantity: parseInt(e.target.value),
                            })
                          }
                          placeholder="0"
                          className="pl-8"
                        />
                      </div>
                      {errors.stock_quantity && (
                        <p className="text-sm text-red-500">
                          {errors.stock_quantity}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-category">Category</Label>
                      <Select
                        value={newProduct.category_id || ""}
                        onValueChange={(value) =>
                          setNewProduct({
                            ...newProduct,
                            category_id: value || null,
                          })
                        }
                      >
                        <SelectTrigger id="new-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Uncategorized</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="new-featured"
                        checked={newProduct.is_featured}
                        onCheckedChange={(checked) =>
                          setNewProduct({
                            ...newProduct,
                            is_featured: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="new-featured">Featured Product</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Product Images</Label>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <Input
                              type="file"
                              ref={fileInputRef}
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                              accept="image/jpeg,image/png,image/gif,image/webp"
                              onChange={(e) => handleImageSelect(e)}
                              disabled={isUploading}
                              onClick={(e) => console.log("File input clicked")}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              disabled={isUploading}
                              className="w-full relative flex items-center justify-center"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              {isUploading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              Upload Image
                            </Button>
                          </div>
                        </div>
                        {isUploading && (
                          <div className="mt-2">
                            <Progress value={uploadProgress} className="h-2" />
                            <p className="text-xs text-center mt-1">
                              {uploadProgress}%
                            </p>
                          </div>
                        )}
                      </div>
                      {newProduct.image_urls &&
                        newProduct.image_urls.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {newProduct.image_urls.map((url, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={url}
                                  alt={`Product image ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-md"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancelAdd}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddProduct} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Product"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="text-center py-4">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              {allProducts.length === 0
                ? "No products found. Add your first product to get started."
                : "No products match your filters."}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex items-center">
                  <Checkbox
                    id="select-all"
                    checked={
                      products.length > 0 &&
                      selectedProducts.length === products.length
                    }
                    onCheckedChange={toggleAllProducts}
                  />
                  <Label
                    htmlFor="select-all"
                    className="ml-2 text-sm font-medium"
                  >
                    Select All
                  </Label>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedProducts.length} of {products.length} selected
                </div>
              </div>
              {products.map((product) => (
                <Card
                  key={product.id}
                  className={`overflow-hidden ${selectedProducts.includes(product.id) ? "border-primary" : ""}`}
                >
                  {editingProduct?.id === product.id ? (
                    <CardContent className="p-4">
                      <div className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`edit-name-${product.id}`}>
                              Product Name
                            </Label>
                            <Input
                              id={`edit-name-${product.id}`}
                              value={editingProduct.name}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  name: e.target.value,
                                })
                              }
                            />
                            {errors.name && (
                              <p className="text-sm text-red-500">
                                {errors.name}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-sku-${product.id}`}>
                              SKU
                            </Label>
                            <Input
                              id={`edit-sku-${product.id}`}
                              value={editingProduct.sku}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  sku: e.target.value,
                                })
                              }
                            />
                            {errors.sku && (
                              <p className="text-sm text-red-500">
                                {errors.sku}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edit-description-${product.id}`}>
                            Description
                          </Label>
                          <Textarea
                            id={`edit-description-${product.id}`}
                            value={editingProduct.description || ""}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`edit-price-${product.id}`}>
                              Price
                            </Label>
                            <div className="relative">
                              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id={`edit-price-${product.id}`}
                                type="number"
                                value={editingProduct.price}
                                onChange={(e) =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    price: parseFloat(e.target.value),
                                  })
                                }
                                className="pl-8"
                              />
                            </div>
                            {errors.price && (
                              <p className="text-sm text-red-500">
                                {errors.price}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-stock-${product.id}`}>
                              Stock Quantity
                            </Label>
                            <div className="relative">
                              <Package className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id={`edit-stock-${product.id}`}
                                type="number"
                                value={editingProduct.stock_quantity}
                                onChange={(e) =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    stock_quantity: parseInt(e.target.value),
                                  })
                                }
                                className="pl-8"
                              />
                            </div>
                            {errors.stock_quantity && (
                              <p className="text-sm text-red-500">
                                {errors.stock_quantity}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-category-${product.id}`}>
                              Category
                            </Label>
                            <Select
                              value={editingProduct.category_id || ""}
                              onValueChange={(value) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  category_id: value || null,
                                })
                              }
                            >
                              <SelectTrigger id={`edit-category-${product.id}`}>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">Uncategorized</SelectItem>
                                {categories.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-featured-${product.id}`}
                              checked={editingProduct.is_featured}
                              onCheckedChange={(checked) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  is_featured: checked as boolean,
                                })
                              }
                            />
                            <Label htmlFor={`edit-featured-${product.id}`}>
                              Featured Product
                            </Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Product Images</Label>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                  <Input
                                    type="file"
                                    ref={editFileInputRef}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={(e) => handleImageSelect(e, true)}
                                    disabled={isUploading}
                                    onClick={(e) =>
                                      console.log("Edit file input clicked")
                                    }
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isUploading}
                                    className="w-full relative flex items-center justify-center"
                                    onClick={() =>
                                      editFileInputRef.current?.click()
                                    }
                                  >
                                    {isUploading ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                      <Upload className="h-4 w-4 mr-2" />
                                    )}
                                    Upload Image
                                  </Button>
                                </div>
                              </div>
                              {isUploading && (
                                <div className="mt-2">
                                  <Progress
                                    value={uploadProgress}
                                    className="h-2"
                                  />
                                  <p className="text-xs text-center mt-1">
                                    {uploadProgress}%
                                  </p>
                                </div>
                              )}
                            </div>
                            {editingProduct.image_urls &&
                              editingProduct.image_urls.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                  {editingProduct.image_urls.map(
                                    (url, index) => (
                                      <div
                                        key={index}
                                        className="relative group"
                                      >
                                        <img
                                          src={url}
                                          alt={`Product image ${index + 1}`}
                                          className="w-full h-32 object-cover rounded-md"
                                        />
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="sm"
                                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={() =>
                                            removeImage(index, true)
                                          }
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ),
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={handleCancelEdit}>
                            <X className="mr-2 h-4 w-4" /> Cancel
                          </Button>
                          <Button
                            onClick={handleUpdateProduct}
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              "Saving..."
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <Checkbox
                            id={`select-${product.id}`}
                            className="mt-1 mr-3"
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() =>
                              toggleProductSelection(product.id)
                            }
                          />
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <h3 className="text-lg font-semibold flex items-center">
                                  {product.name}
                                  {product.is_featured && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                      Featured
                                    </span>
                                  )}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  SKU: {product.sku} • Category:{" "}
                                  {getCategoryName(product.category_id)}
                                </p>
                              </div>
                              <div className="mt-2 md:mt-0 flex items-center">
                                <p className="text-lg font-bold">
                                  ${product.price.toFixed(2)}
                                </p>
                                <p className="ml-4 text-sm">
                                  Stock: {product.stock_quantity}
                                </p>
                              </div>
                            </div>
                            {product.description && (
                              <p className="mt-2 text-sm line-clamp-2">
                                {product.description}
                              </p>
                            )}
                            {product.image_urls &&
                              product.image_urls.length > 0 && (
                                <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                                  {product.image_urls
                                    .slice(0, 4)
                                    .map((url, index) => (
                                      <img
                                        key={index}
                                        src={url}
                                        alt={`${product.name} image ${index + 1}`}
                                        className="h-16 w-16 object-cover rounded-md flex-shrink-0"
                                      />
                                    ))}
                                  {product.image_urls.length > 4 && (
                                    <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                      +{product.image_urls.length - 4}
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setIsDeleteDialogOpen(true) ||
                              setSelectedProducts([product.id])
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredProducts.length,
                )}{" "}
                of {filteredProducts.length} products
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {selectedProducts.length === 1
                ? "this product"
                : `these ${selectedProducts.length} products`}{" "}
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleBulkDelete();
              }}
              disabled={isBulkDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isBulkDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsManagement;
