import React, { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Copy,
  Edit,
  Image,
  Type,
  LayoutGrid,
  List,
  FileText,
  Video,
  Link,
  Columns,
} from "lucide-react";

export interface BlockData {
  id: string;
  type: string;
  content: any;
  settings?: any;
}

export interface CMSBlockEditorProps {
  blocks: BlockData[];
  onChange: (blocks: BlockData[]) => void;
  language?: string;
  readOnly?: boolean;
}

const BLOCK_TYPES = [
  { id: "heading", name: "Heading", icon: <Type className="h-4 w-4" /> },
  { id: "text", name: "Text", icon: <FileText className="h-4 w-4" /> },
  { id: "image", name: "Image", icon: <Image className="h-4 w-4" /> },
  { id: "gallery", name: "Gallery", icon: <LayoutGrid className="h-4 w-4" /> },
  { id: "video", name: "Video", icon: <Video className="h-4 w-4" /> },
  { id: "button", name: "Button", icon: <Link className="h-4 w-4" /> },
  { id: "list", name: "List", icon: <List className="h-4 w-4" /> },
  { id: "columns", name: "Columns", icon: <Columns className="h-4 w-4" /> },
];

const CMSBlockEditor: React.FC<CMSBlockEditorProps> = ({
  blocks = [],
  onChange,
  language = "en",
  readOnly = false,
}) => {
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(
    null,
  );
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [insertAtIndex, setInsertAtIndex] = useState<number | null>(null);

  const handleAddBlock = (type: string) => {
    const newBlock: BlockData = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContentForType(type),
    };

    const newBlocks = [...blocks];
    if (insertAtIndex !== null) {
      newBlocks.splice(insertAtIndex, 0, newBlock);
    } else {
      newBlocks.push(newBlock);
    }

    onChange(newBlocks);
    setShowBlockSelector(false);
    setInsertAtIndex(null);
    setSelectedBlockIndex(
      insertAtIndex !== null ? insertAtIndex : newBlocks.length - 1,
    );
  };

  const handleRemoveBlock = (index: number) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    onChange(newBlocks);
    setSelectedBlockIndex(null);
  };

  const handleDuplicateBlock = (index: number) => {
    const blockToDuplicate = blocks[index];
    const duplicatedBlock = {
      ...blockToDuplicate,
      id: `block-${Date.now()}`,
    };

    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, duplicatedBlock);
    onChange(newBlocks);
    setSelectedBlockIndex(index + 1);
  };

  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === blocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...blocks];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const [movedBlock] = newBlocks.splice(index, 1);
    newBlocks.splice(newIndex, 0, movedBlock);

    onChange(newBlocks);
    setSelectedBlockIndex(newIndex);
  };

  const handleBlockContentChange = (index: number, content: any) => {
    const newBlocks = [...blocks];
    newBlocks[index] = {
      ...newBlocks[index],
      content,
    };
    onChange(newBlocks);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(result.source.index, 1);
    newBlocks.splice(result.destination.index, 0, movedBlock);

    onChange(newBlocks);
    setSelectedBlockIndex(result.destination.index);
  };

  const getDefaultContentForType = (type: string) => {
    switch (type) {
      case "heading":
        return { text: "New Heading", level: "h2" };
      case "text":
        return { text: "Enter your text here" };
      case "image":
        return { url: "", alt: "", caption: "" };
      case "gallery":
        return { images: [] };
      case "video":
        return { url: "", type: "youtube" };
      case "button":
        return { text: "Click Here", url: "#", style: "primary" };
      case "list":
        return { items: ["Item 1", "Item 2", "Item 3"] };
      case "columns":
        return { columns: [{ content: [] }, { content: [] }] };
      default:
        return {};
    }
  };

  const renderBlockEditor = (block: BlockData, index: number) => {
    switch (block.type) {
      case "heading":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Heading Text</Label>
              <Input
                value={block.content.text}
                onChange={(e) =>
                  handleBlockContentChange(index, {
                    ...block.content,
                    text: e.target.value,
                  })
                }
                placeholder="Enter heading text"
              />
            </div>
            <div className="space-y-2">
              <Label>Heading Level</Label>
              <Select
                value={block.content.level}
                onValueChange={(value) =>
                  handleBlockContentChange(index, {
                    ...block.content,
                    level: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select heading level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1</SelectItem>
                  <SelectItem value="h2">H2</SelectItem>
                  <SelectItem value="h3">H3</SelectItem>
                  <SelectItem value="h4">H4</SelectItem>
                  <SelectItem value="h5">H5</SelectItem>
                  <SelectItem value="h6">H6</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "text":
        return (
          <div className="space-y-2">
            <Label>Text Content</Label>
            <Textarea
              value={block.content.text}
              onChange={(e) =>
                handleBlockContentChange(index, {
                  ...block.content,
                  text: e.target.value,
                })
              }
              placeholder="Enter text content"
              rows={5}
            />
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={block.content.url}
                onChange={(e) =>
                  handleBlockContentChange(index, {
                    ...block.content,
                    url: e.target.value,
                  })
                }
                placeholder="Enter image URL"
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={block.content.alt}
                onChange={(e) =>
                  handleBlockContentChange(index, {
                    ...block.content,
                    alt: e.target.value,
                  })
                }
                placeholder="Enter alt text"
              />
            </div>
            <div className="space-y-2">
              <Label>Caption (optional)</Label>
              <Input
                value={block.content.caption}
                onChange={(e) =>
                  handleBlockContentChange(index, {
                    ...block.content,
                    caption: e.target.value,
                  })
                }
                placeholder="Enter caption"
              />
            </div>
          </div>
        );

      // Add more block type editors as needed
      default:
        return (
          <div className="p-4 border border-dashed rounded-md">
            <p className="text-muted-foreground text-center">
              Editor for {block.type} block type is not implemented yet.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="cms-block-editor">
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle>Content Blocks</CardTitle>
          <CardDescription>
            Add, remove, and rearrange content blocks to build your page layout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {blocks.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-md">
              <p className="text-muted-foreground mb-4">
                No content blocks added yet. Click the button below to add your
                first block.
              </p>
              <Button
                onClick={() => {
                  setInsertAtIndex(0);
                  setShowBlockSelector(true);
                }}
                disabled={readOnly}
              >
                <Plus className="mr-2 h-4 w-4" /> Add First Block
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="blocks">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {blocks.map((block, index) => (
                        <Draggable
                          key={block.id}
                          draggableId={block.id}
                          index={index}
                          isDragDisabled={readOnly}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`border rounded-md ${selectedBlockIndex === index ? "border-primary" : "border-border"}`}
                            >
                              <div className="p-3 flex justify-between items-center bg-muted">
                                <div
                                  {...provided.dragHandleProps}
                                  className="flex items-center gap-2"
                                >
                                  {
                                    BLOCK_TYPES.find((t) => t.id === block.type)
                                      ?.icon
                                  }
                                  <span className="font-medium">
                                    {BLOCK_TYPES.find(
                                      (t) => t.id === block.type,
                                    )?.name || block.type}
                                  </span>
                                </div>
                                {!readOnly && (
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleMoveBlock(index, "up")
                                      }
                                      disabled={index === 0}
                                    >
                                      <MoveUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleMoveBlock(index, "down")
                                      }
                                      disabled={index === blocks.length - 1}
                                    >
                                      <MoveDown className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleDuplicateBlock(index)
                                      }
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveBlock(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                              <div
                                className="p-4 cursor-pointer"
                                onClick={() => setSelectedBlockIndex(index)}
                              >
                                {selectedBlockIndex === index ? (
                                  renderBlockEditor(block, index)
                                ) : (
                                  <div className="min-h-[40px]">
                                    {/* Preview of block content */}
                                    {block.type === "heading" && (
                                      <div className="font-bold">
                                        {block.content.text}
                                      </div>
                                    )}
                                    {block.type === "text" && (
                                      <div className="line-clamp-2">
                                        {block.content.text}
                                      </div>
                                    )}
                                    {block.type === "image" && (
                                      <div className="flex items-center gap-2">
                                        <Image className="h-4 w-4" />
                                        <span className="truncate">
                                          {block.content.url || "No image URL"}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {index < blocks.length - 1 && !readOnly && (
                                <div className="flex justify-center -mb-3 relative z-10">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 text-xs bg-background"
                                    onClick={() => {
                                      setInsertAtIndex(index + 1);
                                      setShowBlockSelector(true);
                                    }}
                                  >
                                    <Plus className="h-3 w-3 mr-1" /> Insert
                                    Block
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {!readOnly && (
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={() => {
                      setInsertAtIndex(blocks.length);
                      setShowBlockSelector(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Block
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showBlockSelector} onOpenChange={setShowBlockSelector}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Content Block</DialogTitle>
            <DialogDescription>
              Select the type of content block you want to add.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {BLOCK_TYPES.map((blockType) => (
              <Button
                key={blockType.id}
                variant="outline"
                className="h-24 flex flex-col justify-center items-center gap-2"
                onClick={() => handleAddBlock(blockType.id)}
              >
                <div className="h-8 w-8 flex items-center justify-center">
                  {blockType.icon}
                </div>
                <span>{blockType.name}</span>
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBlockSelector(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CMSBlockEditor;
