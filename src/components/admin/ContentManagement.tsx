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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image, Upload, X } from "lucide-react";
import SupplierManagement from "./SupplierManagement";
import { supabase } from "@/lib/supabase";

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [heroSections, setHeroSections] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedHero, setSelectedHero] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);

  useEffect(() => {
    fetchHeroSections();
    fetchBanners();
  }, []);

  const fetchHeroSections = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .eq("placement", "hero");

      if (error) throw error;
      setHeroSections(data || []);
    } catch (err) {
      console.error("Error fetching hero sections:", err);
      setError("Failed to load hero sections. Please try again.");
      // Fallback to default data if fetch fails
      setHeroSections([
        {
          id: "1",
          title: "Transform Your Space",
          description:
            "Discover premium building materials for your dream home",
          image_url:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
          regions: ["all"],
          placement: "hero",
        },
        {
          id: "2",
          title: "Kitchen Essentials",
          description:
            "Modern fixtures and materials for your kitchen renovation",
          image_url:
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
          regions: ["all"],
          placement: "hero",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBanners = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .eq("placement", "banner");

      if (error) throw error;
      setBanners(data || []);
    } catch (err) {
      console.error("Error fetching banners:", err);
      setError("Failed to load banners. Please try again.");
      // Fallback to default data if fetch fails
      setBanners([
        {
          id: "1",
          title: "Summer Sale",
          description: "Get 20% off on all flooring materials",
          image_url:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
          link_url: "/sale",
          regions: ["Egypt"],
          placement: "banner",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSelect = (hero) => {
    setSelectedHero(hero);
  };

  const handleBannerSelect = (banner) => {
    setSelectedBanner(banner);
  };

  const handleHeroSave = async () => {
    setLoading(true);
    setError("");
    try {
      if (selectedHero?.id) {
        // Update existing hero section
        const { error } = await supabase
          .from("advertisements")
          .update({
            title: selectedHero.title,
            description: selectedHero.description,
            image_url: selectedHero.image_url || selectedHero.image,
            regions: Array.isArray(selectedHero.regions)
              ? selectedHero.regions
              : [selectedHero.region || "all"],
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedHero.id);

        if (error) throw error;
      } else {
        // Add new hero section
        const newHero = {
          title: selectedHero?.title || "New Hero Section",
          description: selectedHero?.description || "Add your description here",
          image_url:
            selectedHero?.image_url ||
            selectedHero?.image ||
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
          regions: Array.isArray(selectedHero?.regions)
            ? selectedHero.regions
            : [selectedHero?.region || "all"],
          placement: "hero",
          is_active: true,
          start_date: new Date().toISOString(),
          end_date: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ).toISOString(),
          created_at: new Date().toISOString(),
        };

        const { error, data } = await supabase
          .from("advertisements")
          .insert(newHero)
          .select();

        if (error) throw error;
        if (data && data.length > 0) {
          setSelectedHero(data[0]);
        }
      }

      // Refresh the hero sections list
      await fetchHeroSections();
    } catch (err) {
      console.error("Error saving hero section:", err);
      setError("Failed to save hero section. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBannerSave = async () => {
    setLoading(true);
    setError("");
    try {
      if (selectedBanner?.id) {
        // Update existing banner
        const { error } = await supabase
          .from("advertisements")
          .update({
            title: selectedBanner.title,
            description: selectedBanner.description,
            image_url: selectedBanner.image_url || selectedBanner.image,
            link_url: selectedBanner.link_url || selectedBanner.link,
            regions: Array.isArray(selectedBanner.regions)
              ? selectedBanner.regions
              : [selectedBanner.region || "all"],
            placement:
              selectedBanner.placement === "home" ||
              selectedBanner.placement === "category" ||
              selectedBanner.placement === "product"
                ? selectedBanner.placement
                : "banner",
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedBanner.id);

        if (error) throw error;
      } else {
        // Add new banner
        const newBanner = {
          title: selectedBanner?.title || "New Banner",
          description:
            selectedBanner?.description || "Add your description here",
          image_url:
            selectedBanner?.image_url ||
            selectedBanner?.image ||
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
          link_url: selectedBanner?.link_url || selectedBanner?.link || "/",
          regions: Array.isArray(selectedBanner?.regions)
            ? selectedBanner.regions
            : [selectedBanner?.region || "all"],
          placement: "banner",
          is_active: true,
          start_date: new Date().toISOString(),
          end_date: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ).toISOString(),
          created_at: new Date().toISOString(),
        };

        const { error, data } = await supabase
          .from("advertisements")
          .insert(newBanner)
          .select();

        if (error) throw error;
        if (data && data.length > 0) {
          setSelectedBanner(data[0]);
        }
      }

      // Refresh the banners list
      await fetchBanners();
    } catch (err) {
      console.error("Error saving banner:", err);
      setError("Failed to save banner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleHeroDelete = async (id) => {
    if (!id) return;

    setLoading(true);
    setError("");
    try {
      const { error } = await supabase
        .from("advertisements")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Reset selected hero if it was deleted
      if (selectedHero && selectedHero.id === id) {
        setSelectedHero(null);
      }

      // Refresh the hero sections list
      await fetchHeroSections();
    } catch (err) {
      console.error("Error deleting hero section:", err);
      setError("Failed to delete hero section. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBannerDelete = async (id) => {
    if (!id) return;

    setLoading(true);
    setError("");
    try {
      const { error } = await supabase
        .from("advertisements")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Reset selected banner if it was deleted
      if (selectedBanner && selectedBanner.id === id) {
        setSelectedBanner(null);
      }

      // Refresh the banners list
      await fetchBanners();
    } catch (err) {
      console.error("Error deleting banner:", err);
      setError("Failed to delete banner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>
            Manage hero sections, banners, and promotional content across
            regions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="hero">Hero Sections</TabsTrigger>
              <TabsTrigger value="banners">Banners</TabsTrigger>
              <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
              <TabsTrigger value="promotions">Promotions</TabsTrigger>
            </TabsList>

            <TabsContent value="hero" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Hero Sections</h3>
                    <Button size="sm" onClick={() => setSelectedHero(null)}>
                      Add New
                    </Button>
                  </div>
                  <div className="border rounded-md divide-y">
                    {heroSections.map((hero) => (
                      <div
                        key={hero.id}
                        className={`p-3 flex justify-between items-center cursor-pointer hover:bg-muted ${selectedHero?.id === hero.id ? "bg-muted" : ""}`}
                        onClick={() => handleHeroSelect(hero)}
                      >
                        <div>
                          <p className="font-medium">{hero.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Region:{" "}
                            {Array.isArray(hero.regions)
                              ? hero.regions.join(", ")
                              : hero.region || "all"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHeroDelete(hero.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {selectedHero
                          ? "Edit Hero Section"
                          : "New Hero Section"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedHero ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="hero-title">Title</Label>
                            <Input
                              id="hero-title"
                              value={selectedHero.title || ""}
                              onChange={(e) =>
                                setSelectedHero({
                                  ...selectedHero,
                                  title: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="hero-description">
                              Description
                            </Label>
                            <Textarea
                              id="hero-description"
                              value={selectedHero.description || ""}
                              onChange={(e) =>
                                setSelectedHero({
                                  ...selectedHero,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="hero-image">Image URL</Label>
                            <div className="flex space-x-2">
                              <Input
                                id="hero-image"
                                value={
                                  selectedHero.image_url ||
                                  selectedHero.image ||
                                  ""
                                }
                                onChange={(e) =>
                                  setSelectedHero({
                                    ...selectedHero,
                                    image_url: e.target.value,
                                  })
                                }
                              />
                              <Button variant="outline" size="icon">
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="hero-region">Region</Label>
                            <Select
                              value={
                                Array.isArray(selectedHero.regions) &&
                                selectedHero.regions.length > 0
                                  ? selectedHero.regions[0]
                                  : selectedHero.region || "all"
                              }
                              onValueChange={(value) =>
                                setSelectedHero({
                                  ...selectedHero,
                                  regions: [value],
                                })
                              }
                            >
                              <SelectTrigger id="hero-region">
                                <SelectValue placeholder="Select region" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Regions</SelectItem>
                                <SelectItem value="Egypt">Egypt</SelectItem>
                                <SelectItem value="Saudi Arabia">
                                  Saudi Arabia
                                </SelectItem>
                                <SelectItem value="Kuwait">Kuwait</SelectItem>
                                <SelectItem value="UAE">UAE</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="pt-4 flex space-x-2">
                            <Button
                              onClick={handleHeroSave}
                              disabled={
                                loading ||
                                !selectedHero.title ||
                                !selectedHero.image_url
                              }
                            >
                              {loading ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setSelectedHero(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                          {error && (
                            <div className="mt-2 text-sm text-red-500">
                              {error}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Image className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            Select a hero section to edit or create a new one
                          </p>
                          <Button
                            className="mt-4"
                            onClick={handleHeroSave}
                            disabled={loading}
                          >
                            {loading
                              ? "Creating..."
                              : "Create New Hero Section"}
                          </Button>
                          {error && (
                            <div className="mt-2 text-sm text-red-500">
                              {error}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="banners" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Banners</h3>
                    <Button size="sm" onClick={() => setSelectedBanner(null)}>
                      Add New
                    </Button>
                  </div>
                  <div className="border rounded-md divide-y">
                    {banners.map((banner) => (
                      <div
                        key={banner.id}
                        className={`p-3 flex justify-between items-center cursor-pointer hover:bg-muted ${selectedBanner?.id === banner.id ? "bg-muted" : ""}`}
                        onClick={() => handleBannerSelect(banner)}
                      >
                        <div>
                          <p className="font-medium">{banner.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Placement: {banner.placement || "banner"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBannerDelete(banner.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {selectedBanner ? "Edit Banner" : "New Banner"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedBanner ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="banner-title">Title</Label>
                            <Input
                              id="banner-title"
                              value={selectedBanner.title || ""}
                              onChange={(e) =>
                                setSelectedBanner({
                                  ...selectedBanner,
                                  title: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="banner-description">
                              Description
                            </Label>
                            <Textarea
                              id="banner-description"
                              value={selectedBanner.description || ""}
                              onChange={(e) =>
                                setSelectedBanner({
                                  ...selectedBanner,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="banner-image">Image URL</Label>
                            <div className="flex space-x-2">
                              <Input
                                id="banner-image"
                                value={
                                  selectedBanner.image_url ||
                                  selectedBanner.image ||
                                  ""
                                }
                                onChange={(e) =>
                                  setSelectedBanner({
                                    ...selectedBanner,
                                    image_url: e.target.value,
                                  })
                                }
                              />
                              <Button variant="outline" size="icon">
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="banner-link">Link URL</Label>
                            <Input
                              id="banner-link"
                              value={
                                selectedBanner.link_url ||
                                selectedBanner.link ||
                                ""
                              }
                              onChange={(e) =>
                                setSelectedBanner({
                                  ...selectedBanner,
                                  link_url: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="banner-region">Region</Label>
                              <Select
                                value={
                                  Array.isArray(selectedBanner.regions) &&
                                  selectedBanner.regions.length > 0
                                    ? selectedBanner.regions[0]
                                    : selectedBanner.region || "all"
                                }
                                onValueChange={(value) =>
                                  setSelectedBanner({
                                    ...selectedBanner,
                                    regions: [value],
                                  })
                                }
                              >
                                <SelectTrigger id="banner-region">
                                  <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">
                                    All Regions
                                  </SelectItem>
                                  <SelectItem value="Egypt">Egypt</SelectItem>
                                  <SelectItem value="Saudi Arabia">
                                    Saudi Arabia
                                  </SelectItem>
                                  <SelectItem value="Kuwait">Kuwait</SelectItem>
                                  <SelectItem value="UAE">UAE</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="banner-placement">
                                Placement
                              </Label>
                              <Select
                                value={selectedBanner.placement}
                                onValueChange={(value) =>
                                  setSelectedBanner({
                                    ...selectedBanner,
                                    placement: value,
                                  })
                                }
                              >
                                <SelectTrigger id="banner-placement">
                                  <SelectValue placeholder="Select placement" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="home">
                                    Home Page
                                  </SelectItem>
                                  <SelectItem value="category">
                                    Category Page
                                  </SelectItem>
                                  <SelectItem value="product">
                                    Product Page
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="pt-4 flex space-x-2">
                            <Button
                              onClick={handleBannerSave}
                              disabled={
                                loading ||
                                !selectedBanner.title ||
                                !selectedBanner.image_url
                              }
                            >
                              {loading ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setSelectedBanner(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                          {error && (
                            <div className="mt-2 text-sm text-red-500">
                              {error}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Image className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            Select a banner to edit or create a new one
                          </p>
                          <Button
                            className="mt-4"
                            onClick={handleBannerSave}
                            disabled={loading}
                          >
                            {loading ? "Creating..." : "Create New Banner"}
                          </Button>
                          {error && (
                            <div className="mt-2 text-sm text-red-500">
                              {error}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="suppliers" className="space-y-6">
              <SupplierManagement />
            </TabsContent>

            <TabsContent value="promotions">
              <div className="flex flex-col items-center justify-center py-12">
                <Image className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Promotions management will be implemented in the next phase
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagement;
