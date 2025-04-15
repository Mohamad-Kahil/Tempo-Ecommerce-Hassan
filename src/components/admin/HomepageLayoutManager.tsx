import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  LayoutGrid,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import CMSBlockEditor from "./CMSBlockEditor";

interface HomepageLayout {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  status: string;
  is_default: boolean;
  layout_data: any;
  created_at: string;
  updated_at: string | null;
  language: string;
  region: string;
}

const HomepageLayoutManager = () => {
  const { user, isAdmin } = useAuth();
  const [layouts, setLayouts] = useState<HomepageLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [displayLanguage, setDisplayLanguage] = useState<"en" | "ar">("en");
  const [currentLayout, setCurrentLayout] = useState<Partial<HomepageLayout>>({
    name: "",
    name_ar: "",
    description: "",
    description_ar: "",
    status: "draft",
    is_default: false,
    layout_data: { sections: [], blocks: [] },
    language: "en",
    region: "global",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchLayouts();
  }, []);

  const fetchLayouts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("homepage_layouts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLayouts(data || []);
    } catch (error) {
      console.error("Error fetching layouts:", error);
      toast({
        title: "Error",
        description: "Failed to load homepage layouts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (!currentLayout.name) {
        toast({
          title: "Validation Error",
          description: "Layout name is required",
          variant: "destructive",
        });
        return;
      }

      if (isEditing && currentLayout.id) {
        const { error } = await supabase
          .from("homepage_layouts")
          .update({
            name: currentLayout.name,
            name_ar: currentLayout.name_ar,
            description: currentLayout.description,
            description_ar: currentLayout.description_ar,
            status: currentLayout.status,
            is_default: currentLayout.is_default,
            layout_data: currentLayout.layout_data,
            language: currentLayout.language,
            region: currentLayout.region,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentLayout.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Layout updated successfully",
        });
      } else {
        const { error } = await supabase.from("homepage_layouts").insert([
          {
            name: currentLayout.name,
            name_ar: currentLayout.name_ar,
            description: currentLayout.description,
            description_ar: currentLayout.description_ar,
            status: currentLayout.status,
            is_default: currentLayout.is_default,
            layout_data: currentLayout.layout_data,
            language: currentLayout.language,
            region: currentLayout.region,
          },
        ]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Layout created successfully",
        });
      }

      setOpenDialog(false);
      resetForm();
      fetchLayouts();
    } catch (error) {
      console.error("Error saving layout:", error);
      toast({
        title: "Error",
        description: "Failed to save layout",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (layout: HomepageLayout) => {
    setCurrentLayout(layout);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this layout?")) return;

    try {
      const { error } = await supabase
        .from("homepage_layouts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Layout deleted successfully",
      });
      fetchLayouts();
    } catch (error) {
      console.error("Error deleting layout:", error);
      toast({
        title: "Error",
        description: "Failed to delete layout",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (layout: HomepageLayout) => {
    try {
      const { error } = await supabase.from("homepage_layouts").insert([
        {
          name: `${layout.name} (Copy)`,
          name_ar: layout.name_ar,
          description: layout.description,
          description_ar: layout.description_ar,
          status: "draft",
          is_default: false,
          layout_data: layout.layout_data,
          language: layout.language,
          region: layout.region,
        },
      ]);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Layout duplicated successfully",
      });
      fetchLayouts();
    } catch (error) {
      console.error("Error duplicating layout:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate layout",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setCurrentLayout({
      name: "",
      name_ar: "",
      description: "",
      description_ar: "",
      status: "draft",
      is_default: false,
      layout_data: { sections: [], blocks: [] },
      language: "en",
      region: "global",
    });
    setIsEditing(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCurrentLayout((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentLayout((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setCurrentLayout((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Homepage Layout Manager</CardTitle>
            <CardDescription>
              Create and manage homepage layouts with different sections and
              content blocks.
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
                <Plus className="mr-2 h-4 w-4" /> New Layout
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Edit Layout" : "Create New Layout"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Update the details of your homepage layout."
                    : "Create a new homepage layout with custom sections and content blocks."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Layout Name (English) *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={currentLayout.name}
                          onChange={handleInputChange}
                          placeholder="Homepage Layout"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name_ar">Layout Name (Arabic)</Label>
                        <Input
                          id="name_ar"
                          name="name_ar"
                          value={currentLayout.name_ar || ""}
                          onChange={handleInputChange}
                          placeholder="اسم التخطيط"
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
                          value={currentLayout.description || ""}
                          onChange={handleInputChange}
                          placeholder="Describe the purpose of this layout"
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
                          value={currentLayout.description_ar || ""}
                          onChange={handleInputChange}
                          placeholder="وصف الغرض من هذا التخطيط"
                          rows={3}
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="content" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">
                          Layout Content Blocks
                        </h3>
                      </div>
                      <CMSBlockEditor
                        blocks={currentLayout.layout_data?.blocks || []}
                        onChange={(blocks) => {
                          setCurrentLayout((prev) => ({
                            ...prev,
                            layout_data: {
                              ...prev.layout_data,
                              blocks,
                            },
                          }));
                        }}
                        language={currentLayout.language}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="settings" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={currentLayout.status}
                          onValueChange={(value) =>
                            handleSelectChange("status", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={currentLayout.language}
                          onValueChange={(value) =>
                            handleSelectChange("language", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ar">Arabic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="region">Region</Label>
                        <Select
                          value={currentLayout.region}
                          onValueChange={(value) =>
                            handleSelectChange("region", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="global">Global</SelectItem>
                            <SelectItem value="eg">Egypt</SelectItem>
                            <SelectItem value="sa">Saudi Arabia</SelectItem>
                            <SelectItem value="kw">Kuwait</SelectItem>
                            <SelectItem value="ae">UAE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_default"
                          checked={currentLayout.is_default}
                          onCheckedChange={(checked) =>
                            handleSwitchChange("is_default", checked)
                          }
                        />
                        <Label htmlFor="is_default">
                          Set as default layout
                        </Label>
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
                  {isEditing ? "Update Layout" : "Create Layout"}
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
        ) : layouts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No layouts found. Create your first layout to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {layouts.map((layout) => (
              <Card key={layout.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="text-lg font-medium"
                        dir={displayLanguage === "ar" ? "rtl" : "ltr"}
                      >
                        {displayLanguage === "en"
                          ? layout.name
                          : layout.name_ar || layout.name}
                      </h3>
                      <p
                        className="text-sm text-muted-foreground mt-1"
                        dir={displayLanguage === "ar" ? "rtl" : "ltr"}
                      >
                        {displayLanguage === "en"
                          ? layout.description || "No description"
                          : layout.description_ar ||
                            layout.description ||
                            "لا يوجد وصف"}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            layout.status === "published"
                              ? "bg-green-100 text-green-800"
                              : layout.status === "draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {layout.status.charAt(0).toUpperCase() +
                            layout.status.slice(1)}
                        </span>
                        {layout.is_default && (
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            Default
                          </span>
                        )}
                        <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                          {layout.language.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                          {layout.region === "global"
                            ? "Global"
                            : layout.region.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(layout)}
                        title="Edit layout"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDuplicate(layout)}
                        title="Duplicate layout"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(layout.id)}
                        title="Delete layout"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        title="Preview layout"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      Created:{" "}
                      {new Date(layout.created_at).toLocaleDateString()}
                    </p>
                    {layout.updated_at && (
                      <p>
                        Last updated:{" "}
                        {new Date(layout.updated_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HomepageLayoutManager;
