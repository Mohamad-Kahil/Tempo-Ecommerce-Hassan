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
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  Folder,
  FolderOpen,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
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
import { motion, AnimatePresence } from "framer-motion";

type Category = Tables<"categories">;

interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
  productCount: number;
  isExpanded?: boolean;
}

const ITEMS_PER_PAGE = 5;

const Categories = () => {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [hierarchicalCategories, setHierarchicalCategories] = useState<
    CategoryWithChildren[]
  >([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    slug: "",
    description: "",
    level: 1,
    parent_id: null,
    image_url: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Image upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Bulk operations state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering state
  const [filters, setFilters] = useState({
    name: "",
    level: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // View mode state (card or list)
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("level")
        .order("name");

      if (categoriesError) throw categoriesError;

      if (!categoriesData) {
        throw new Error("No categories data returned");
      }

      // Fetch products to count them per category
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("category_id");

      if (productsError) throw productsError;

      // Count products per category
      const productCountMap: Record<string, number> = {};
      if (productsData) {
        productsData.forEach((product) => {
          if (product.category_id) {
            productCountMap[product.category_id] =
              (productCountMap[product.category_id] || 0) + 1;
          }
        });
      }

      // Add product counts to categories
      const categoriesWithCounts = categoriesData.map((category) => ({
        ...category,
        productCount: productCountMap[category.id] || 0,
      }));

      setAllCategories(categoriesWithCounts);
      // Filter level 1 categories for parent selection
      setParentCategories(
        categoriesWithCounts.filter((cat) => cat.level === 1),
      );

      // Build hierarchical structure
      const hierarchical = buildCategoryHierarchy(categoriesWithCounts);
      setHierarchicalCategories(hierarchical);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to build category hierarchy
  const buildCategoryHierarchy = (
    categories: Category[],
  ): CategoryWithChildren[] => {
    // First, create a map of all categories by id
    const categoryMap: Record<string, CategoryWithChildren> = {};

    // Initialize each category with children array and expanded state
    categories.forEach((cat) => {
      categoryMap[cat.id] = {
        ...cat,
        children: [],
        productCount: cat.productCount || 0, // Use actual product count
        isExpanded: false,
      };
    });

    // Build the hierarchy by adding children to their parents
    const rootCategories: CategoryWithChildren[] = [];

    categories.forEach((cat) => {
      if (cat.parent_id && categoryMap[cat.parent_id]) {
        // This category has a parent, add it to the parent's children
        categoryMap[cat.parent_id].children?.push(categoryMap[cat.id]);
      } else if (cat.level === 1) {
        // This is a root category (level 1)
        rootCategories.push(categoryMap[cat.id]);
      }
    });

    return rootCategories;
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: string) => {
    // Update hierarchical categories for tree view
    setHierarchicalCategories((prevCategories) => {
      return toggleExpansionRecursive(prevCategories, categoryId);
    });

    // Also update the flat list for list view
    setAllCategories((prevCategories) => {
      return prevCategories.map((cat) => {
        if (cat.id === categoryId) {
          const isCurrentlyExpanded = (cat as CategoryWithChildren).isExpanded;
          return {
            ...cat,
            isExpanded: !isCurrentlyExpanded,
          } as CategoryWithChildren;
        }
        return cat;
      });
    });
  };

  // Helper function to recursively toggle expansion
  const toggleExpansionRecursive = (
    categories: CategoryWithChildren[],
    categoryId: string,
  ): CategoryWithChildren[] => {
    return categories.map((category) => {
      if (category.id === categoryId) {
        return { ...category, isExpanded: !category.isExpanded };
      }

      if (category.children && category.children.length > 0) {
        return {
          ...category,
          children: toggleExpansionRecursive(category.children, categoryId),
        };
      }

      return category;
    });
  };

  const validateForm = (category: Partial<Category>) => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!category.name || category.name.trim() === "") {
      newErrors.name = "Name is required";
    } else if (category.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    } else if (category.name.length > 50) {
      newErrors.name = "Name must be less than 50 characters long";
    }

    // Slug validation
    if (!category.slug || category.slug.trim() === "") {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(category.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    } else if (category.slug.length < 2) {
      newErrors.slug = "Slug must be at least 2 characters long";
    } else if (category.slug.length > 50) {
      newErrors.slug = "Slug must be less than 50 characters long";
    }

    // Level validation
    if (!category.level) {
      newErrors.level = "Level is required";
    } else if (category.level < 1 || category.level > 4) {
      newErrors.level = "Level must be between 1 and 4";
    }

    // Parent validation
    if (category.level && category.level > 1 && !category.parent_id) {
      newErrors.parent_id = "Parent category is required for subcategories";
    }

    // Image URL validation
    if (
      category.image_url &&
      !/^(https?:\/\/|\/).*\.(jpg|jpeg|png|gif|webp)$/i.test(category.image_url)
    ) {
      newErrors.image_url =
        "Image URL must be a valid URL to an image file (jpg, png, gif, webp)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `category-images/${fileName}`;

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
          contentType: file.type, // Explicitly set content type
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
        if (isEdit && editingCategory) {
          setEditingCategory({
            ...editingCategory,
            image_url: imageUrl,
          });
        } else {
          setNewCategory({
            ...newCategory,
            image_url: imageUrl,
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

  const handleAddCategory = async () => {
    if (!validateForm(newCategory)) return;

    try {
      setIsSaving(true);

      const { data, error } = await supabase
        .from("categories")
        .insert([
          {
            name: newCategory.name,
            slug: newCategory.slug,
            description: newCategory.description || null,
            level: newCategory.level || 1,
            parent_id: newCategory.parent_id || null,
            image_url: newCategory.image_url || null,
          },
        ])
        .select();

      if (error) throw error;

      if (data) {
        // Update both categories lists
        setAllCategories([...allCategories, ...data]);
        if (data[0].level === 1) {
          setParentCategories([...parentCategories, data[0]]);
        }
        setNewCategory({
          name: "",
          slug: "",
          description: "",
          level: 1,
          parent_id: null,
          image_url: "",
        });
        setIsAdding(false);
        toast({
          title: "Category Added",
          description: `${data[0].name} has been added successfully.`,
        });
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !validateForm(editingCategory)) return;

    try {
      setIsSaving(true);

      const { data, error } = await supabase
        .from("categories")
        .update({
          name: editingCategory.name,
          slug: editingCategory.slug,
          description: editingCategory.description,
          level: editingCategory.level,
          parent_id: editingCategory.parent_id,
          image_url: editingCategory.image_url,
        })
        .eq("id", editingCategory.id)
        .select();

      if (error) throw error;

      if (data) {
        // Update both categories lists
        setAllCategories(
          allCategories.map((cat) =>
            cat.id === editingCategory.id ? data[0] : cat,
          ),
        );
        if (data[0].level === 1) {
          setParentCategories(
            parentCategories.map((cat) =>
              cat.id === editingCategory.id ? data[0] : cat,
            ),
          );
        }
        setEditingCategory(null);
        toast({
          title: "Category Updated",
          description: `${data[0].name} has been updated successfully.`,
        });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;

      // Update both categories lists
      setAllCategories(allCategories.filter((cat) => cat.id !== id));
      setParentCategories(parentCategories.filter((cat) => cat.id !== id));

      // Clear selection if this category was selected
      setSelectedCategories(selectedCategories.filter((catId) => catId !== id));

      toast({
        title: "Category Deleted",
        description: "Category has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) return;

    try {
      setIsBulkDeleting(true);

      // Delete each selected category
      for (const id of selectedCategories) {
        const { error } = await supabase
          .from("categories")
          .delete()
          .eq("id", id);
        if (error) throw error;
      }

      // Update categories lists
      setAllCategories(
        allCategories.filter((cat) => !selectedCategories.includes(cat.id)),
      );
      setParentCategories(
        parentCategories.filter((cat) => !selectedCategories.includes(cat.id)),
      );

      // Clear selections
      setSelectedCategories([]);
      setIsDeleteDialogOpen(false);

      toast({
        title: "Categories Deleted",
        description: `${selectedCategories.length} categories have been deleted successfully.`,
      });
    } catch (error) {
      console.error("Error bulk deleting categories:", error);
      toast({
        title: "Error",
        description: "Failed to delete categories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const toggleCategorySelection = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id],
    );
  };

  const toggleAllCategories = () => {
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map((cat) => cat.id));
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setErrors({});
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewCategory({
      name: "",
      slug: "",
      description: "",
      level: 1,
      parent_id: null,
      image_url: "",
    });
    setErrors({});
  };

  // Apply filters and pagination to categories
  const filteredCategories = useMemo(() => {
    // First, filter categories based on search criteria
    const filteredBySearch = allCategories.filter((category) => {
      const nameMatch =
        !filters.name ||
        category.name.toLowerCase().includes(filters.name.toLowerCase());
      const levelMatch =
        !filters.level || category.level.toString() === filters.level;

      // If we're filtering by name, also include parent categories of matching children
      if (!nameMatch && filters.name && category.level === 1) {
        // Check if any child category matches the name filter
        const hasMatchingChild = allCategories.some(
          (child) =>
            child.parent_id === category.id &&
            child.name.toLowerCase().includes(filters.name.toLowerCase()),
        );
        if (hasMatchingChild) return true;
      }

      return nameMatch && levelMatch;
    });

    // Create a map of parent IDs to their children for better organization
    const parentChildMap: Record<string, Category[]> = {};

    // Initialize the map
    filteredBySearch.forEach((category) => {
      if (category.parent_id) {
        if (!parentChildMap[category.parent_id]) {
          parentChildMap[category.parent_id] = [];
        }
        parentChildMap[category.parent_id].push(category);
      }
    });

    // Sort by level first, then by parent_id (to group subcategories under their parents), then by name
    return filteredBySearch.sort((a, b) => {
      // First sort by level
      if (a.level !== b.level) return a.level - b.level;

      // For same level, sort by parent_id to group siblings together
      if (a.parent_id !== b.parent_id) {
        // Handle null parent_ids (top-level categories)
        if (a.parent_id === null) return -1;
        if (b.parent_id === null) return 1;
        return a.parent_id.localeCompare(b.parent_id);
      }

      // Finally sort by name
      return a.name.localeCompare(b.name);
    });
  }, [allCategories, filters]);

  // Filter hierarchical categories
  const filteredHierarchicalCategories = useMemo(() => {
    if (!filters.name && !filters.level) {
      return hierarchicalCategories;
    }

    // Helper function to filter hierarchical categories
    const filterCategoriesRecursive = (
      categories: CategoryWithChildren[],
    ): CategoryWithChildren[] => {
      return categories
        .map((category) => {
          const nameMatch =
            !filters.name ||
            category.name.toLowerCase().includes(filters.name.toLowerCase());
          const levelMatch =
            !filters.level || category.level.toString() === filters.level;

          // Process children recursively
          let filteredChildren: CategoryWithChildren[] = [];
          if (category.children && category.children.length > 0) {
            filteredChildren = filterCategoriesRecursive(category.children);
          }

          // Include this category if it matches or has matching children
          if ((nameMatch && levelMatch) || filteredChildren.length > 0) {
            return {
              ...category,
              children: filteredChildren,
              // Auto-expand if we're filtering
              isExpanded: filters.name ? true : category.isExpanded,
            };
          }

          return null;
        })
        .filter(
          (category): category is CategoryWithChildren => category !== null,
        );
    };

    return filterCategoriesRecursive(hierarchicalCategories);
  }, [hierarchicalCategories, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCategories.slice(startIndex, endIndex);
  }, [filteredCategories, currentPage]);

  // Update categories state for rendering
  useEffect(() => {
    setCategories(paginatedCategories);
  }, [paginatedCategories]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Update hierarchical categories when a category is added, updated, or deleted
  useEffect(() => {
    if (allCategories.length > 0) {
      const hierarchical = buildCategoryHierarchy(allCategories);
      setHierarchicalCategories(hierarchical);
    }
  }, [allCategories]);

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
      level: "",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Categories Management</CardTitle>
            <CardDescription>
              Manage your product categories and subcategories.
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
            <div className="flex border rounded-md">
              <Toggle
                pressed={viewMode === "card"}
                onPressedChange={() => setViewMode("card")}
                aria-label="Card view"
                className="px-3"
              >
                <LayoutGrid className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={viewMode === "list"}
                onPressedChange={() => setViewMode("list")}
                aria-label="List view"
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Toggle>
            </div>
            {selectedCategories.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Selected (
                {selectedCategories.length})
              </Button>
            )}
            <Button
              onClick={() => setIsAdding(true)}
              disabled={isAdding}
              className="ml-auto"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isFilterOpen && (
            <Card className="mb-6 border border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Filter Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <Label htmlFor="filter-level">Level</Label>
                    <Select
                      value={filters.level}
                      onValueChange={(value) =>
                        handleFilterChange("level", value)
                      }
                    >
                      <SelectTrigger id="filter-level">
                        <SelectValue placeholder="All levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All levels</SelectItem>
                        <SelectItem value="1">Level 1</SelectItem>
                        <SelectItem value="2">Level 2</SelectItem>
                        <SelectItem value="3">Level 3</SelectItem>
                        <SelectItem value="4">Level 4</SelectItem>
                      </SelectContent>
                    </Select>
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
                <CardTitle>Add New Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-name">Name</Label>
                      <Input
                        id="new-name"
                        value={newCategory.name}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            name: e.target.value,
                          })
                        }
                        placeholder="Category name"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-slug">Slug</Label>
                      <Input
                        id="new-slug"
                        value={newCategory.slug}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            slug: e.target.value,
                          })
                        }
                        placeholder="category-slug"
                      />
                      {errors.slug && (
                        <p className="text-sm text-red-500">{errors.slug}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-description">Description</Label>
                    <Textarea
                      id="new-description"
                      value={newCategory.description || ""}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          description: e.target.value,
                        })
                      }
                      placeholder="Category description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-level">Level</Label>
                      <Select
                        value={newCategory.level?.toString()}
                        onValueChange={(value) =>
                          setNewCategory({
                            ...newCategory,
                            level: parseInt(value),
                            parent_id:
                              parseInt(value) === 1
                                ? null
                                : newCategory.parent_id,
                          })
                        }
                      >
                        <SelectTrigger id="new-level">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Level 1 (Top)</SelectItem>
                          <SelectItem value="2">Level 2</SelectItem>
                          <SelectItem value="3">Level 3</SelectItem>
                          <SelectItem value="4">Level 4</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.level && (
                        <p className="text-sm text-red-500">{errors.level}</p>
                      )}
                    </div>
                    {newCategory.level && newCategory.level > 1 && (
                      <div className="space-y-2">
                        <Label htmlFor="new-parent">Parent Category</Label>
                        <Select
                          value={newCategory.parent_id || ""}
                          onValueChange={(value) =>
                            setNewCategory({
                              ...newCategory,
                              parent_id: value,
                            })
                          }
                        >
                          <SelectTrigger id="new-parent">
                            <SelectValue placeholder="Select parent" />
                          </SelectTrigger>
                          <SelectContent>
                            {parentCategories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.parent_id && (
                          <p className="text-sm text-red-500">
                            {errors.parent_id}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-image">Image</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Input
                            id="new-image"
                            value={newCategory.image_url || ""}
                            onChange={(e) =>
                              setNewCategory({
                                ...newCategory,
                                image_url: e.target.value,
                              })
                            }
                            placeholder="https://example.com/image.jpg"
                            className="flex-1"
                          />
                          <div className="relative">
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
                              className="relative"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              {isUploading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4" />
                              )}
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
                        {errors.image_url && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.image_url}
                          </p>
                        )}
                      </div>
                      {newCategory.image_url && (
                        <div className="flex items-center justify-center border rounded-md p-2">
                          <img
                            src={newCategory.image_url}
                            alt="Category preview"
                            className="max-h-24 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancelAdd}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddCategory} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Category"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="text-center py-4">Loading categories...</div>
          ) : filteredCategories.length === 0 &&
            filteredHierarchicalCategories.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              {allCategories.length === 0
                ? "No categories found. Add your first category to get started."
                : "No categories match your filters."}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex items-center">
                  <Checkbox
                    id="select-all"
                    checked={
                      categories.length > 0 &&
                      selectedCategories.length === categories.length
                    }
                    onCheckedChange={toggleAllCategories}
                  />
                  <Label
                    htmlFor="select-all"
                    className="ml-2 text-sm font-medium"
                  >
                    Select All
                  </Label>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedCategories.length} of {categories.length} selected
                </div>
              </div>

              {/* Hierarchical View removed */}

              {viewMode === "card" ? (
                // Card View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <Card
                      key={category.id}
                      className={`overflow-hidden h-full ${selectedCategories.includes(category.id) ? "border-primary border-2" : ""} hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
                    >
                      {editingCategory?.id === category.id ? (
                        <CardContent className="p-4">
                          <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`edit-name-${category.id}`}>
                                  Name
                                </Label>
                                <Input
                                  id={`edit-name-${category.id}`}
                                  value={editingCategory.name}
                                  onChange={(e) =>
                                    setEditingCategory({
                                      ...editingCategory,
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
                                <Label htmlFor={`edit-slug-${category.id}`}>
                                  Slug
                                </Label>
                                <Input
                                  id={`edit-slug-${category.id}`}
                                  value={editingCategory.slug}
                                  onChange={(e) =>
                                    setEditingCategory({
                                      ...editingCategory,
                                      slug: e.target.value,
                                    })
                                  }
                                />
                                {errors.slug && (
                                  <p className="text-sm text-red-500">
                                    {errors.slug}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor={`edit-description-${category.id}`}
                              >
                                Description
                              </Label>
                              <Textarea
                                id={`edit-description-${category.id}`}
                                value={editingCategory.description || ""}
                                onChange={(e) =>
                                  setEditingCategory({
                                    ...editingCategory,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`edit-level-${category.id}`}>
                                  Level
                                </Label>
                                <Select
                                  value={editingCategory.level.toString()}
                                  onValueChange={(value) =>
                                    setEditingCategory({
                                      ...editingCategory,
                                      level: parseInt(value),
                                      parent_id:
                                        parseInt(value) === 1
                                          ? null
                                          : editingCategory.parent_id,
                                    })
                                  }
                                >
                                  <SelectTrigger
                                    id={`edit-level-${category.id}`}
                                  >
                                    <SelectValue placeholder="Select level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">
                                      Level 1 (Top)
                                    </SelectItem>
                                    <SelectItem value="2">Level 2</SelectItem>
                                    <SelectItem value="3">Level 3</SelectItem>
                                    <SelectItem value="4">Level 4</SelectItem>
                                  </SelectContent>
                                </Select>
                                {errors.level && (
                                  <p className="text-sm text-red-500">
                                    {errors.level}
                                  </p>
                                )}
                              </div>
                              {editingCategory.level > 1 && (
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-parent-${category.id}`}>
                                    Parent Category
                                  </Label>
                                  <Select
                                    value={editingCategory.parent_id || ""}
                                    onValueChange={(value) =>
                                      setEditingCategory({
                                        ...editingCategory,
                                        parent_id: value,
                                      })
                                    }
                                  >
                                    <SelectTrigger
                                      id={`edit-parent-${category.id}`}
                                    >
                                      <SelectValue placeholder="Select parent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {parentCategories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                          {cat.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {errors.parent_id && (
                                    <p className="text-sm text-red-500">
                                      {errors.parent_id}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-image-${category.id}`}>
                                Image
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      id={`edit-image-${category.id}`}
                                      value={editingCategory.image_url || ""}
                                      onChange={(e) =>
                                        setEditingCategory({
                                          ...editingCategory,
                                          image_url: e.target.value,
                                        })
                                      }
                                      placeholder="https://example.com/image.jpg"
                                      className="flex-1"
                                    />
                                    <div className="relative">
                                      <Input
                                        type="file"
                                        ref={editFileInputRef}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        onChange={(e) =>
                                          handleImageSelect(e, true)
                                        }
                                        disabled={isUploading}
                                        onClick={(e) =>
                                          console.log("Edit file input clicked")
                                        }
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isUploading}
                                        className="relative"
                                        onClick={() =>
                                          editFileInputRef.current?.click()
                                        }
                                      >
                                        {isUploading ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Upload className="h-4 w-4" />
                                        )}
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
                                  {errors.image_url && (
                                    <p className="text-sm text-red-500 mt-1">
                                      {errors.image_url}
                                    </p>
                                  )}
                                </div>
                                {editingCategory.image_url && (
                                  <div className="flex items-center justify-center border rounded-md p-2">
                                    <img
                                      src={editingCategory.image_url}
                                      alt="Category preview"
                                      className="max-h-24 object-contain"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={handleCancelEdit}
                              >
                                <X className="mr-2 h-4 w-4" /> Cancel
                              </Button>
                              <Button
                                onClick={handleUpdateCategory}
                                disabled={isSaving}
                              >
                                {isSaving ? (
                                  "Saving..."
                                ) : (
                                  <>
                                    <Save className="mr-2 h-4 w-4" /> Save
                                    Changes
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      ) : (
                        <div className="flex flex-col h-full">
                          <CardHeader className="pb-2 pt-4 px-4 bg-muted/20">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`select-${category.id}`}
                                  checked={selectedCategories.includes(
                                    category.id,
                                  )}
                                  onCheckedChange={() =>
                                    toggleCategorySelection(category.id)
                                  }
                                />
                                <CardTitle
                                  className="text-base font-medium truncate max-w-[150px]"
                                  title={category.name}
                                >
                                  {category.name}
                                </CardTitle>
                              </div>
                              <div className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                                Level {category.level}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-2 flex-grow">
                            {category.image_url && (
                              <div className="mb-3 h-32 w-full overflow-hidden rounded-md bg-muted/30 shadow-sm flex items-center justify-center">
                                <img
                                  src={category.image_url}
                                  alt={category.name}
                                  className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-110"
                                />
                              </div>
                            )}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {category.parent_id && (
                                <div className="text-xs inline-flex items-center px-2 py-1 rounded-full bg-muted">
                                  <span>Has parent</span>
                                </div>
                              )}
                              <div className="text-xs inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 mr-1">
                                <span>Products: {category.productCount}</span>
                              </div>
                              {category.children &&
                                category.children.length > 0 && (
                                  <div className="text-xs inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700">
                                    <span>
                                      Subcategories: {category.children.length}
                                    </span>
                                  </div>
                                )}
                            </div>
                            {category.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                {category.description}
                              </p>
                            )}
                            {!category.description && (
                              <p className="text-sm text-muted-foreground italic line-clamp-2 mt-2">
                                No description available
                              </p>
                            )}
                          </CardContent>
                          <CardFooter className="p-3 pt-0 flex justify-between border-t mt-auto bg-muted/10">
                            <div className="text-xs text-muted-foreground">
                              Slug:{" "}
                              <span className="font-medium">
                                {category.slug}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClick(category)}
                                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                title="Edit category"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedCategories([category.id]);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                title="Delete category"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardFooter>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                // List View
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="w-8 p-2 text-left">
                          <Checkbox
                            id="select-all-list"
                            checked={
                              filteredCategories.length > 0 &&
                              selectedCategories.length ===
                                filteredCategories.length
                            }
                            onCheckedChange={toggleAllCategories}
                          />
                        </th>
                        <th className="p-2 text-left font-medium">Name</th>
                        <th className="p-2 text-left font-medium">Level</th>
                        <th className="p-2 text-left font-medium">Parent</th>
                        <th className="p-2 text-left font-medium">
                          Description
                        </th>
                        <th className="p-2 text-left font-medium">Products</th>
                        <th className="p-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {/* Render top-level categories first */}
                      {filteredCategories
                        .filter((category) => category.level === 1)
                        .map((category) => (
                          <CategoryTreeItem
                            key={category.id}
                            category={category}
                            allCategories={filteredCategories}
                            selectedCategories={selectedCategories}
                            toggleCategorySelection={toggleCategorySelection}
                            handleEditClick={handleEditClick}
                            handleDeleteCategory={handleDeleteCategory}
                            isExpanded={
                              (category as CategoryWithChildren).isExpanded
                            }
                            onToggleExpand={(categoryId) =>
                              toggleCategoryExpansion(categoryId)
                            }
                          />
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {filteredCategories.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredCategories.length,
                )}{" "}
                of {filteredCategories.length} categories
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
              {selectedCategories.length === 1
                ? "this category"
                : `these ${selectedCategories.length} categories`}{" "}
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

// Recursive CategoryTreeItem component for list view
const CategoryTreeItem = ({
  category,
  allCategories,
  selectedCategories,
  toggleCategorySelection,
  handleEditClick,
  handleDeleteCategory,
  level = 0,
  isExpanded = false,
  onToggleExpand,
}: {
  category: CategoryWithChildren;
  allCategories: Category[];
  selectedCategories: string[];
  toggleCategorySelection: (id: string) => void;
  handleEditClick: (category: Category) => void;
  handleDeleteCategory: (id: string) => void;
  level?: number;
  isExpanded?: boolean;
  onToggleExpand?: (categoryId: string) => void;
}) => {
  // Find parent category name if it exists
  const parentCategory = category.parent_id
    ? allCategories.find((cat) => cat.id === category.parent_id)
    : null;

  // Find children categories - only direct children for this category
  const childCategories = allCategories.filter(
    (cat) => cat.parent_id === category.id,
  );

  return (
    <>
      <tr
        key={category.id}
        className={`${selectedCategories.includes(category.id) ? "bg-primary/5" : ""}`}
      >
        <td className="p-2">
          <Checkbox
            id={`select-list-${category.id}`}
            checked={selectedCategories.includes(category.id)}
            onCheckedChange={() => toggleCategorySelection(category.id)}
          />
        </td>
        <td className="p-2">
          <div className="flex items-center">
            <div
              className="font-medium"
              style={{
                marginLeft: `${level * 20}px`,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {level > 0 && (
                <div className="text-muted-foreground mr-1">
                  {Array(level).fill("—").join("")}
                </div>
              )}
              {childCategories.length > 0 && (
                <button
                  type="button"
                  onClick={() => onToggleExpand && onToggleExpand(category.id)}
                  className="p-1 rounded-sm hover:bg-muted transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              )}
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="h-8 w-8 object-cover rounded-md"
                />
              ) : (
                <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
                  {category.level === 1 ? (
                    <Folder className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Image className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              )}
              {category.name}
              {childCategories.length > 0 && (
                <span className="text-xs text-muted-foreground ml-2">
                  ({childCategories.length} subcategories)
                </span>
              )}
            </div>
          </div>
        </td>
        <td className="p-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
            Level {category.level}
          </span>
        </td>
        <td className="p-2">
          {parentCategory ? (
            <span className="text-sm">{parentCategory.name}</span>
          ) : (
            <span className="text-sm text-muted-foreground">None</span>
          )}
        </td>
        <td className="p-2 max-w-xs truncate">{category.description || "-"}</td>
        <td className="p-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
            {category.productCount} products
          </span>
        </td>
        <td className="p-2">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditClick(category)}
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
              title="Edit category"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteCategory(category.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
              title="Delete category"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
      {isExpanded && childCategories.length > 0 && (
        <>
          {childCategories.map((childCategory) => (
            <CategoryTreeItem
              key={childCategory.id}
              category={childCategory as CategoryWithChildren}
              allCategories={allCategories}
              selectedCategories={selectedCategories}
              toggleCategorySelection={toggleCategorySelection}
              handleEditClick={handleEditClick}
              handleDeleteCategory={handleDeleteCategory}
              level={level + 1}
              isExpanded={(childCategory as CategoryWithChildren).isExpanded}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </>
      )}
    </>
  );
};

export default Categories;
