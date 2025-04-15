import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  useProductImages,
  useProductImageUrls,
  transformImagesToGalleryFormat,
} from "@/hooks/useProductImages";

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  type: "image" | "video";
}

interface ProductGalleryProps {
  images?: string[] | ProductImage[];
  productName?: string;
  productId?: string;
}

const ProductGallery = ({
  images: propImages,
  productName = "Premium Building Material",
  productId,
}: ProductGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomDialogOpen, setIsZoomDialogOpen] = useState(false);

  // Fetch images from Supabase if productId is provided
  const { images: dbImages, loading: dbImagesLoading } =
    useProductImages(productId);
  const { images: imageUrls, loading: imageUrlsLoading } =
    useProductImageUrls(productId);

  // Process provided images if they're simple strings
  const processStringImages = (imgs: string[]): ProductImage[] => {
    return imgs.map((url, index) => ({
      id: `img-${index}`,
      url,
      alt: `${productName} image ${index + 1}`,
      type: "image",
    }));
  };

  // Use provided images or transform DB images
  const images = (() => {
    if (propImages && propImages.length > 0) {
      // Check if propImages are strings or already ProductImage objects
      if (typeof propImages[0] === "string") {
        return processStringImages(propImages as string[]);
      }
      return propImages as ProductImage[];
    }

    if (dbImages.length > 0) {
      return transformImagesToGalleryFormat(dbImages);
    }

    if (imageUrls.length > 0) {
      return processStringImages(imageUrls);
    }

    // Fallback images
    return [];
  })();

  const handlePrevious = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Show loading state if fetching images
  if ((dbImagesLoading || imageUrlsLoading) && productId) {
    return (
      <div className="w-full max-w-[700px] bg-background p-4 flex justify-center items-center h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-48 w-full bg-gray-200 rounded mb-4"></div>
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 w-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If no images available
  if (images.length === 0) {
    return (
      <div className="w-full max-w-[700px] bg-background p-4 flex justify-center items-center h-[400px] border border-dashed border-gray-300 rounded-lg">
        <div className="text-center text-gray-500">
          <p>No images available</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];

  return (
    <div className="w-full max-w-[700px] bg-background">
      <div className="relative">
        {/* Main Image Display */}
        <div className="relative rounded-lg overflow-hidden border border-border">
          <AspectRatio ratio={4 / 3}>
            <img
              src={currentImage.url}
              alt={currentImage.alt}
              className="w-full h-full object-cover"
            />
            {currentImage.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full h-12 w-12"
                >
                  <Play className="h-6 w-6" />
                </Button>
              </div>
            )}
          </AspectRatio>

          {/* Zoom Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 rounded-full opacity-80 hover:opacity-100"
            onClick={() => setIsZoomDialogOpen(true)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          {/* Navigation Buttons */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 text-foreground"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous image</span>
            </Button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 text-foreground"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next image</span>
            </Button>
          </div>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-background/80 px-2 py-1 rounded-full text-xs">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            className={cn(
              "relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2",
              currentImageIndex === index
                ? "border-primary"
                : "border-transparent hover:border-primary/50",
            )}
            onClick={() => setCurrentImageIndex(index)}
          >
            <img
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {image.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Play className="h-4 w-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Zoom Dialog */}
      <Dialog open={isZoomDialogOpen} onOpenChange={setIsZoomDialogOpen}>
        <DialogContent className="max-w-4xl p-0 bg-background">
          <div className="p-6">
            <img
              src={currentImage.url}
              alt={currentImage.alt}
              className="w-full h-auto"
            />
            <div className="mt-2 text-sm text-muted-foreground">
              {productName} - {currentImage.alt}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductGallery;
