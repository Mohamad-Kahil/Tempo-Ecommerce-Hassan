import type { Meta, StoryObj } from "@storybook/react";
import ProductGallery from "@/components/product/ProductGallery";
import { ProductImage } from "@/hooks/useProductImages";

const meta: Meta<typeof ProductGallery> = {
  title: "E-commerce/ProductGallery",
  component: ProductGallery,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProductGallery>;

// Sample images that match the expected format
const sampleImages = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    alt: "Modern kitchen interior with white cabinets",
    type: "image" as const,
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80",
    alt: "Stylish bathroom with marble countertop",
    type: "image" as const,
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
    alt: "Contemporary living room furniture",
    type: "image" as const,
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
    alt: "Elegant dining room set",
    type: "image" as const,
  },
];

// Mock database images that match the ProductImage type from Supabase
const mockDbImages: ProductImage[] = [
  {
    id: "1",
    product_id: "1",
    image_url:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    alt_text: "Modern kitchen interior with white cabinets",
    is_video: false,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    product_id: "1",
    image_url:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80",
    alt_text: "Stylish bathroom with marble countertop",
    is_video: false,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    product_id: "1",
    image_url:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
    alt_text: "Contemporary living room furniture",
    is_video: false,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const Default: Story = {
  args: {
    images: sampleImages,
    productName: "Premium Building Material",
  },
};

export const WithVideo: Story = {
  args: {
    images: [
      ...sampleImages.slice(0, 2),
      {
        id: "5",
        url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
        alt: "Product demonstration video",
        type: "video" as const,
      },
    ],
    productName: "Premium Building Material with Video",
  },
};

export const SingleImage: Story = {
  args: {
    images: [sampleImages[0]],
    productName: "Single Image Product",
  },
};

export const WithLiveData: Story = {
  render: () => (
    <div className="w-[700px] bg-white">
      <ProductGallery
        productId="1"
        productName="Premium Building Material (Live Data)"
      />
    </div>
  ),
};

export const LoadingState: Story = {
  render: () => (
    <div className="w-[700px] bg-white">
      {/* Using a non-existent ID to show loading state */}
      <ProductGallery
        productId="loading-example"
        productName="Loading Example"
      />
    </div>
  ),
};
