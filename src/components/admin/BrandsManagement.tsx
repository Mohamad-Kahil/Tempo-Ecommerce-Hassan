import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useNameValidation } from "@/hooks/useNameValidation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Link as LinkIcon,
  Image,
  Upload,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface Brand {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  logo_url: string | null;
  website_url: string | null;
  supplier_id: string | null;
  supplier_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

interface Supplier {
  id: string;
  name: string;
}

const BrandsManagement = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [displayLanguage, setDisplayLanguage] = useState<"en" | "ar">("en");
  const [currentBrand, setCurrentBrand] = useState<Partial<Brand>>({
    name: "",
    name_ar: "",
    description: "",
    description_ar: "",
    logo_url: "",
    website_url: "",
    supplier_id: null,
    is_active: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBrands();
    fetchSuppliers();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("brands")
        .select(`*, suppliers(name)`)
        .order("name", { ascending: true });

      if (error) throw error;

      // Transform the data to include supplier_name
      const transformedData =
        data?.map((item) => ({
          ...item,
          supplier_name: item.suppliers?.name || null,
        })) || [];

      setBrands(transformedData);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast({
        title: "Error",
        description: "Failed to load brands",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast({
        title: "Error",
        description: "Failed to load suppliers",
        variant: "destructive",
      });
    }
  };

  const { checkNameUniqueness, isValidating } = useNameValidation();

  const handleCreateOrUpdate = async () => {
    try {
      if (!currentBrand.name) {
        toast({
          title: "Validation Error",
          description: "Brand name is required",
          variant: "destructive",
        });
        return;
      }

      // Check name uniqueness
      const { isUnique, field, message } = await checkNameUniqueness(
        currentBrand.name,
        currentBrand.name_ar,
        "brands",
        isEditing ? currentBrand.id : undefined,
      );

      if (!isUnique) {
        toast({
          title: "Validation Error",
          description: message || "Name must be unique",
          variant: "destructive",
        });
        return;
      }

      if (isEditing && currentBrand.id) {
        const { error } = await supabase
          .from("brands")
          .update({
            name: currentBrand.name,
            name_ar: currentBrand.name_ar,
            description: currentBrand.description,
            description_ar: currentBrand.description_ar,
            logo_url: currentBrand.logo_url,
            website_url: currentBrand.website_url,
            supplier_id: currentBrand.supplier_id,
            is_active: currentBrand.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentBrand.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Brand updated successfully",
        });
      } else {
        const { error } = await supabase.from("brands").insert([
          {
            name: currentBrand.name,
            name_ar: currentBrand.name_ar,
            description: currentBrand.description,
            description_ar: currentBrand.description_ar,
            logo_url: currentBrand.logo_url,
            website_url: currentBrand.website_url,
            supplier_id: currentBrand.supplier_id,
            is_active: currentBrand.is_active,
          },
        ]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Brand created successfully",
        });
      }

      setOpenDialog(false);
      resetForm();
      fetchBrands();
    } catch (error) {
      console.error("Error saving brand:", error);
      toast({
        title: "Error",
        description: "Failed to save brand",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (brand: Brand) => {
    setCurrentBrand(brand);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    try {
      // Check if brand is used in any products
      const { data: products, error: checkError } = await supabase
        .from("products")
        .select("id")
        .eq("brand_id", id);

      if (checkError) throw checkError;

      if (products && products.length > 0) {
        toast({
          title: "Cannot Delete",
          description: `This brand is used by ${products.length} product(s). Please reassign these products to another brand first.`,
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("brands").delete().eq("id", id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Brand deleted successfully",
      });
      fetchBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast({
        title: "Error",
        description: "Failed to delete brand",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setCurrentBrand({
      name: "",
      name_ar: "",
      description: "",
      description_ar: "",
      logo_url: "",
      website_url: "",
      supplier_id: null,
      is_active: true,
    });
    setIsEditing(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCurrentBrand((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentBrand((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setCurrentBrand((prev) => ({ ...prev, [name]: checked }));
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const fileExt = file.name.split(".").pop();
      const fileName = `brand_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `brand-logos/${fileName}`;

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

      // Upload the file to the brand-logos folder
      const { error: uploadError, data } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
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
      console.error("Error uploading logo:", error);
      toast({
        title: "Upload Failed",
        description:
          "There was an error uploading your logo: " +
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

  // Helper function to delete an image from storage
  const deleteImageFromStorage = async (imageUrl: string) => {
    try {
      // Extract the file path from the URL
      // The URL format is like: https://xxx.supabase.co/storage/v1/object/public/images/brand-logos/filename.jpg
      const urlParts = imageUrl.split("/images/");
      if (urlParts.length < 2) {
        console.error("Could not parse image URL:", imageUrl);
        return false;
      }

      const filePath = urlParts[1];
      console.log("Attempting to delete file at path:", filePath);

      const { error } = await supabase.storage
        .from("images")
        .remove([filePath]);

      if (error) {
        console.error("Error deleting image:", error);
        return false;
      }

      console.log("Successfully deleted image at path:", filePath);
      return true;
    } catch (error) {
      console.error("Error in deleteImageFromStorage:", error);
      return false;
    }
  };

  const handleLogoSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPG, PNG, GIF, SVG, or WEBP image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Set uploading state to prevent multiple uploads
      if (isUploading) return;

      // Delete the old image if it exists
      if (currentBrand.logo_url) {
        console.log("Deleting old logo:", currentBrand.logo_url);
        await deleteImageFromStorage(currentBrand.logo_url);
      }

      const logoUrl = await uploadLogo(file);
      if (logoUrl) {
        // Only update the state, don't save to database yet
        // This will be saved when the user clicks Save/Update button
        setCurrentBrand((prev) => ({ ...prev, logo_url: logoUrl }));
        toast({
          title: "Upload Successful",
          description:
            "Logo has been uploaded successfully. Remember to save your changes.",
        });
      }
    } catch (error) {
      console.error("Error in handleLogoSelect:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    }

    // Reset the file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeLogo = async () => {
    if (currentBrand.logo_url) {
      try {
        // Delete the image from storage
        const deleted = await deleteImageFromStorage(currentBrand.logo_url);

        if (deleted) {
          setCurrentBrand((prev) => ({ ...prev, logo_url: "" }));
          toast({
            title: "Logo Removed",
            description: "Brand logo has been removed.",
          });
        } else {
          // Still update the UI even if deletion fails
          setCurrentBrand((prev) => ({ ...prev, logo_url: "" }));
          toast({
            title: "Logo Removed",
            description:
              "Brand logo has been removed from the brand, but there was an issue deleting the file.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error removing logo:", error);
        // Still update the UI even if deletion fails
        setCurrentBrand((prev) => ({ ...prev, logo_url: "" }));
        toast({
          title: "Logo Removed",
          description:
            "Brand logo has been removed from the brand, but there was an issue deleting the file.",
          variant: "destructive",
        });
      }
    } else {
      setCurrentBrand((prev) => ({ ...prev, logo_url: "" }));
      toast({
        title: "Logo Removed",
        description: "Brand logo has been removed.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Brands Management</CardTitle>
            <CardDescription>
              Manage brands for your products and link them to suppliers.
            </CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="display-language">Display Language:</Label>
              <Select
                value={displayLanguage}
                onValueChange={(value) =>
                  setDisplayLanguage(value as "en" | "ar")
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setOpenDialog(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> New Brand
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Edit Brand" : "Create New Brand"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Update the details of your brand."
                    : "Create a new brand and link it to a supplier."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Brand Name (English) *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={currentBrand.name}
                          onChange={handleInputChange}
                          placeholder="Brand Name"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name_ar">Brand Name (Arabic)</Label>
                        <Input
                          id="name_ar"
                          name="name_ar"
                          value={currentBrand.name_ar || ""}
                          onChange={handleInputChange}
                          placeholder="اسم العلامة التجارية"
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">
                          Description (English)
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={currentBrand.description || ""}
                          onChange={handleInputChange}
                          placeholder="Describe the brand"
                          rows={3}
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description_ar">
                          Description (Arabic)
                        </Label>
                        <Textarea
                          id="description_ar"
                          name="description_ar"
                          value={currentBrand.description_ar || ""}
                          onChange={handleInputChange}
                          placeholder="وصف العلامة التجارية"
                          rows={3}
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="details" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="logo_upload">Brand Logo</Label>
                        <div className="grid grid-cols-1 gap-4">
                          {currentBrand.logo_url ? (
                            <div className="relative group">
                              <img
                                src={currentBrand.logo_url}
                                alt="Brand logo"
                                className="h-32 w-32 object-contain rounded-md border border-input"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={removeLogo}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="h-32 w-32 rounded-md border border-dashed border-input flex items-center justify-center bg-muted">
                              <Image className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <Input
                                type="file"
                                ref={fileInputRef}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                                onChange={handleLogoSelect}
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
                                Upload Logo
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
                          <p className="text-xs text-muted-foreground">
                            Recommended: Square image, max 2MB, JPG, PNG, GIF,
                            SVG, or WEBP format.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website_url">Website URL</Label>
                        <Input
                          id="website_url"
                          name="website_url"
                          value={currentBrand.website_url || ""}
                          onChange={handleInputChange}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supplier_id">Linked Supplier</Label>
                        <Select
                          value={currentBrand.supplier_id || ""}
                          onValueChange={(value) =>
                            handleSelectChange("supplier_id", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="null">None</SelectItem>
                            {suppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id}>
                                {supplier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          checked={currentBrand.is_active}
                          onCheckedChange={(checked) =>
                            handleSwitchChange("is_active", checked)
                          }
                        />
                        <Label htmlFor="is_active">Active</Label>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOrUpdate}>
                  {isEditing ? "Update Brand" : "Create Brand"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No brands found. Create your first brand to get started.
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {brand.logo_url ? (
                          <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                            <img
                              src={brand.logo_url}
                              alt={brand.name}
                              className="h-full w-full object-contain p-1"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                            <Image className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">
                            {displayLanguage === "en"
                              ? brand.name
                              : brand.name_ar || brand.name}
                          </div>
                          {brand.website_url && (
                            <a
                              href={brand.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 flex items-center"
                            >
                              <LinkIcon className="h-3 w-3 mr-1" />
                              Website
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {displayLanguage === "en"
                        ? brand.description
                        : brand.description_ar || brand.description}
                    </TableCell>
                    <TableCell>{brand.supplier_name || "Not linked"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${brand.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {brand.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(brand)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(brand.id)}
                          disabled={brand.name === "Generic"} // Prevent deleting the Generic brand
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandsManagement;
