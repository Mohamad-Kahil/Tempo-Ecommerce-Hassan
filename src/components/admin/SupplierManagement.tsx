import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image, Upload, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.from("suppliers").select("*");
      if (error) throw error;
      setSuppliers(data || []);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Failed to load suppliers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleSupplierSave = async () => {
    setLoading(true);
    setError("");
    try {
      if (selectedSupplier?.id) {
        // Update existing supplier
        const { error } = await supabase
          .from("suppliers")
          .update({
            name: selectedSupplier.name,
            description: selectedSupplier.description,
            contact_email: selectedSupplier.contact_email,
            contact_phone: selectedSupplier.contact_phone,
            website: selectedSupplier.website,
            logo_url: selectedSupplier.logo_url,
            regions: selectedSupplier.regions,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedSupplier.id);

        if (error) throw error;
      } else {
        // Add new supplier
        const newSupplier = {
          name: selectedSupplier?.name || "New Supplier",
          description: selectedSupplier?.description || "",
          contact_email: selectedSupplier?.contact_email || "",
          contact_phone: selectedSupplier?.contact_phone || "",
          website: selectedSupplier?.website || "",
          logo_url: selectedSupplier?.logo_url || "",
          regions: selectedSupplier?.regions || ["Egypt"],
          created_at: new Date().toISOString(),
        };

        const { error, data } = await supabase
          .from("suppliers")
          .insert(newSupplier)
          .select();

        if (error) throw error;
        if (data && data.length > 0) {
          setSelectedSupplier(data[0]);
        }
      }

      // Refresh the suppliers list
      await fetchSuppliers();
    } catch (err) {
      console.error("Error saving supplier:", err);
      setError("Failed to save supplier. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSupplierDelete = async (id) => {
    if (!id) return;

    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.from("suppliers").delete().eq("id", id);
      if (error) throw error;

      // Reset selected supplier if it was deleted
      if (selectedSupplier && selectedSupplier.id === id) {
        setSelectedSupplier(null);
      }

      // Refresh the suppliers list
      await fetchSuppliers();
    } catch (err) {
      console.error("Error deleting supplier:", err);
      setError("Failed to delete supplier. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedSupplier({
      name: "",
      description: "",
      contact_email: "",
      contact_phone: "",
      website: "",
      logo_url: "",
      regions: ["Egypt"],
    });
  };

  const handleRegionChange = (value) => {
    // Convert single value to array if needed
    const regions = Array.isArray(selectedSupplier.regions)
      ? [...selectedSupplier.regions]
      : [];

    // Check if the region is already in the array
    const index = regions.indexOf(value);
    if (index === -1) {
      // Add the region if it's not in the array
      regions.push(value);
    } else {
      // Remove the region if it's already in the array
      regions.splice(index, 1);
    }

    // Ensure at least one region is selected
    if (regions.length === 0) {
      regions.push("Egypt");
    }

    setSelectedSupplier({
      ...selectedSupplier,
      regions,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Suppliers</h3>
          <Button size="sm" onClick={handleCreateNew}>
            Add New
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="border rounded-md divide-y max-h-[600px] overflow-y-auto">
          {loading && suppliers.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading...
            </div>
          ) : suppliers.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No suppliers found. Add your first supplier.
            </div>
          ) : (
            suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className={`p-3 flex justify-between items-center cursor-pointer hover:bg-muted ${
                  selectedSupplier?.id === supplier.id ? "bg-muted" : ""
                }`}
                onClick={() => handleSupplierSelect(supplier)}
              >
                <div>
                  <p className="font-medium">{supplier.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {supplier.regions?.join(", ") || "No regions"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSupplierDelete(supplier.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedSupplier?.id
                ? "Edit Supplier"
                : selectedSupplier
                  ? "New Supplier"
                  : "Supplier Details"}
            </CardTitle>
            <CardDescription>
              {selectedSupplier?.id
                ? "Update supplier information"
                : selectedSupplier
                  ? "Add a new supplier to the system"
                  : "Select a supplier to view or edit details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedSupplier ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="supplier-name">Name *</Label>
                  <Input
                    id="supplier-name"
                    value={selectedSupplier.name || ""}
                    onChange={(e) =>
                      setSelectedSupplier({
                        ...selectedSupplier,
                        name: e.target.value,
                      })
                    }
                    placeholder="Supplier name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier-description">Description</Label>
                  <Textarea
                    id="supplier-description"
                    value={selectedSupplier.description || ""}
                    onChange={(e) =>
                      setSelectedSupplier({
                        ...selectedSupplier,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description of the supplier"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier-email">Contact Email</Label>
                    <Input
                      id="supplier-email"
                      type="email"
                      value={selectedSupplier.contact_email || ""}
                      onChange={(e) =>
                        setSelectedSupplier({
                          ...selectedSupplier,
                          contact_email: e.target.value,
                        })
                      }
                      placeholder="contact@supplier.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplier-phone">Contact Phone</Label>
                    <Input
                      id="supplier-phone"
                      value={selectedSupplier.contact_phone || ""}
                      onChange={(e) =>
                        setSelectedSupplier({
                          ...selectedSupplier,
                          contact_phone: e.target.value,
                        })
                      }
                      placeholder="+20 123 456 7890"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier-website">Website</Label>
                  <Input
                    id="supplier-website"
                    type="url"
                    value={selectedSupplier.website || ""}
                    onChange={(e) =>
                      setSelectedSupplier({
                        ...selectedSupplier,
                        website: e.target.value,
                      })
                    }
                    placeholder="https://supplier.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier-logo">Logo URL</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="supplier-logo"
                      value={selectedSupplier.logo_url || ""}
                      onChange={(e) =>
                        setSelectedSupplier({
                          ...selectedSupplier,
                          logo_url: e.target.value,
                        })
                      }
                      placeholder="https://example.com/logo.png"
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Regions *</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Egypt", "Saudi Arabia", "Kuwait", "UAE"].map(
                      (region) => (
                        <Button
                          key={region}
                          type="button"
                          variant={
                            selectedSupplier.regions?.includes(region)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleRegionChange(region)}
                        >
                          {region}
                        </Button>
                      ),
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select at least one region where this supplier operates
                  </p>
                </div>

                <div className="pt-4 flex space-x-2">
                  <Button
                    onClick={handleSupplierSave}
                    disabled={loading || !selectedSupplier.name}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSupplier(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Image className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Select a supplier to view or edit details, or create a new one
                </p>
                <Button className="mt-4" onClick={handleCreateNew}>
                  Create New Supplier
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierManagement;
