import React, { useRef, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Upload,
  X,
  DollarSign,
  Package,
  Save,
  Globe,
  Info,
  Tag,
} from "lucide-react";
import { Tables } from "@/types/supabase";
import { useBrands } from "@/hooks/useBrands";

type Product = Tables<"products">;
type Category = Tables<"categories">;
type Brand = Tables<"brands">;

interface ProductFormProps {
  product: Partial<Product>;
  setProduct: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  categories: Category[];
  errors: Record<string, string>;
  isUploading: boolean;
  uploadProgress: number;
  isSaving: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageSelect: (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit?: boolean,
  ) => void;
  removeImage: (index: number, isEdit?: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  isEdit?: boolean;
  brands?: Brand[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  setProduct,
  categories,
  errors,
  isUploading,
  uploadProgress,
  isSaving,
  fileInputRef,
  handleImageSelect,
  removeImage,
  onSave,
  onCancel,
  isEdit = false,
  brands = [],
}) => {
  // Fetch brands if not provided
  const { brands: fetchedBrands, loading: brandsLoading } = useBrands();
  const availableBrands = brands.length > 0 ? brands : fetchedBrands;
  const [activeTab, setActiveTab] = useState("basic");

  // Helper function to handle specifications updates
  const handleSpecificationChange = (key: string, value: string) => {
    const currentSpecs = product.specifications || {};
    setProduct({
      ...product,
      specifications: {
        ...currentSpecs,
        [key]: value,
      },
    });
  };

  // Helper function to add a new feature
  const addFeature = (feature: string) => {
    if (!feature.trim()) return;
    const currentFeatures = Array.isArray(product.features)
      ? [...product.features]
      : [];
    if (!currentFeatures.includes(feature)) {
      setProduct({
        ...product,
        features: [...currentFeatures, feature],
      });
    }
  };

  // Helper function to remove a feature
  const removeFeature = (index: number) => {
    const currentFeatures = Array.isArray(product.features)
      ? [...product.features]
      : [];
    currentFeatures.splice(index, 1);
    setProduct({
      ...product,
      features: currentFeatures,
    });
  };

  return (
    <div className="grid gap-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="optional">Optional Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={isEdit ? `edit-name-${product.id}` : "new-name"}>
                Product Name
              </Label>
              <Input
                id={isEdit ? `edit-name-${product.id}` : "new-name"}
                value={product.name || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
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
              <Label htmlFor={isEdit ? `edit-sku-${product.id}` : "new-sku"}>
                SKU
              </Label>
              <Input
                id={isEdit ? `edit-sku-${product.id}` : "new-sku"}
                value={product.sku || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
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
            <Label
              htmlFor={
                isEdit ? `edit-description-${product.id}` : "new-description"
              }
            >
              Description
            </Label>
            <Textarea
              id={isEdit ? `edit-description-${product.id}` : "new-description"}
              value={product.description || ""}
              onChange={(e) =>
                setProduct({
                  ...product,
                  description: e.target.value,
                })
              }
              placeholder="Product description"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor={isEdit ? `edit-price-${product.id}` : "new-price"}
              >
                Price
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id={isEdit ? `edit-price-${product.id}` : "new-price"}
                  type="number"
                  value={product.price || 0}
                  onChange={(e) =>
                    setProduct({
                      ...product,
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
              <Label
                htmlFor={isEdit ? `edit-stock-${product.id}` : "new-stock"}
              >
                Stock Quantity
              </Label>
              <div className="relative">
                <Package className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id={isEdit ? `edit-stock-${product.id}` : "new-stock"}
                  type="number"
                  value={product.stock || 0}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      stock: parseInt(e.target.value),
                    })
                  }
                  placeholder="0"
                  className="pl-8"
                />
              </div>
              {errors.stock && (
                <p className="text-sm text-red-500">{errors.stock}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor={
                  isEdit ? `edit-category-${product.id}` : "new-category"
                }
              >
                Category
              </Label>
              <Select
                value={product.category_id || "uncategorized"}
                onValueChange={(value) =>
                  setProduct({
                    ...product,
                    category_id: value === "uncategorized" ? null : value,
                  })
                }
              >
                <SelectTrigger
                  id={isEdit ? `edit-category-${product.id}` : "new-category"}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uncategorized">Uncategorized</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor={isEdit ? `edit-regions-${product.id}` : "new-regions"}
              >
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  Available Regions
                </div>
              </Label>
              <Select
                value={
                  product.regions && product.regions.length > 0
                    ? product.regions[0]
                    : "all"
                }
                onValueChange={(value) =>
                  setProduct({
                    ...product,
                    regions: [value],
                  })
                }
              >
                <SelectTrigger
                  id={isEdit ? `edit-regions-${product.id}` : "new-regions"}
                >
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="Egypt">Egypt</SelectItem>
                  <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                  <SelectItem value="Kuwait">Kuwait</SelectItem>
                  <SelectItem value="UAE">UAE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor={isEdit ? `edit-brand-${product.id}` : "new-brand"}
              >
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Brand
                </div>
              </Label>
              <Select
                value={product.brand_id || "none"}
                onValueChange={(value) =>
                  setProduct({
                    ...product,
                    brand_id: value === "none" ? null : value,
                  })
                }
              >
                <SelectTrigger
                  id={isEdit ? `edit-brand-${product.id}` : "new-brand"}
                >
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Brand</SelectItem>
                  {availableBrands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="space-y-2 flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={isEdit ? `edit-featured-${product.id}` : "new-featured"}
                  checked={product.is_featured || false}
                  onCheckedChange={(checked) =>
                    setProduct({
                      ...product,
                      is_featured: checked as boolean,
                    })
                  }
                />
                <Label
                  htmlFor={
                    isEdit ? `edit-featured-${product.id}` : "new-featured"
                  }
                >
                  Featured Product
                </Label>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="optional" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">
                Product Specifications
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add key-value pairs for product specifications
              </p>
              <div className="grid grid-cols-1 gap-4 mt-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Material"
                    value={product.specifications?.material || ""}
                    onChange={(e) =>
                      handleSpecificationChange("material", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Value"
                    value={product.specifications?.dimensions || ""}
                    onChange={(e) =>
                      handleSpecificationChange("dimensions", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Weight"
                    value={product.specifications?.weight || ""}
                    onChange={(e) =>
                      handleSpecificationChange("weight", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Color"
                    value={product.specifications?.color || ""}
                    onChange={(e) =>
                      handleSpecificationChange("color", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Warranty"
                    value={product.specifications?.warranty || ""}
                    onChange={(e) =>
                      handleSpecificationChange("warranty", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Manufacturer"
                    value={product.specifications?.manufacturer || ""}
                    onChange={(e) =>
                      handleSpecificationChange("manufacturer", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Label className="text-base font-medium">Product Features</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add key features of the product
              </p>
              <div className="flex items-center space-x-2 mb-2">
                <Input
                  id="new-feature"
                  placeholder="Add a feature"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addFeature((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = document.getElementById(
                      "new-feature",
                    ) as HTMLInputElement;
                    addFeature(input.value);
                    input.value = "";
                  }}
                >
                  Add
                </Button>
              </div>
              {product.features && product.features.length > 0 && (
                <div className="space-y-2 mt-2">
                  {product.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted p-2 rounded-md"
                    >
                      <span>{feature}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <Label className="text-base font-medium">
                Additional Information
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="delivery-time">Delivery Time</Label>
                  <Input
                    id="delivery-time"
                    placeholder="e.g., 3-5 business days"
                    value={product.delivery_time || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        delivery_time: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    placeholder="0"
                    value={product.discount || 0}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        discount: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
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
                      onChange={(e) => handleImageSelect(e, isEdit)}
                      disabled={isUploading}
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
              {product.image_urls && product.image_urls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {product.image_urls.map((url, index) => (
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
                        onClick={() => removeImage(index, isEdit)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            "Saving..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEdit ? "Save Changes" : "Save Product"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
