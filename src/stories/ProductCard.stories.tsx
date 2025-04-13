import type { Meta, StoryObj } from "@storybook/react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/hooks/useProducts";

const meta: Meta<typeof ProductCard> = {
  title: "E-commerce/ProductCard",
  component: ProductCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

// Mock product data that matches the Product type from Supabase
const mockProduct: Product = {
  id: "1",
  name: "Premium Ceramic Tiles",
  price: 299.99,
  currency: "USD",
  thumbnail_url:
    "https://images.unsplash.com/photo-1581430872221-d1cfed785922?w=500&q=80",
  rating: 4.5,
  review_count: 128,
  supplier_name: "Luxury Interiors",
  description: "High-quality ceramic tiles for modern interiors",
  stock_quantity: 50,
  category_id: "1",
  supplier_id: "1",
  is_featured: true,
  is_new: false,
  discount_percentage: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const Default: Story = {
  args: {
    product: mockProduct,
  },
};

export const WithDirectProps: Story = {
  args: {
    id: "1",
    name: "Premium Ceramic Tiles",
    price: 299.99,
    currency: "USD",
    image:
      "https://images.unsplash.com/photo-1581430872221-d1cfed785922?w=500&q=80",
    rating: 4.5,
    reviewCount: 128,
    supplier: "Luxury Interiors",
  },
};

export const WithDiscount: Story = {
  args: {
    product: {
      ...mockProduct,
      discount_percentage: 15,
    },
  },
};

export const NewProduct: Story = {
  args: {
    product: {
      ...mockProduct,
      is_new: true,
    },
  },
};

export const OutOfStock: Story = {
  args: {
    product: {
      ...mockProduct,
      stock_quantity: 0,
    },
  },
};

export const WithDiscountAndNew: Story = {
  args: {
    product: {
      ...mockProduct,
      discount_percentage: 20,
      is_new: true,
    },
  },
};

export const ArabicRTL: Story = {
  args: {
    product: {
      ...mockProduct,
      name: "بلاط سيراميك ممتاز",
      supplier_name: "ديكورات فاخرة",
      currency: "SAR",
    },
  },
  parameters: {
    direction: "rtl",
  },
};

export const LiveDataExample: Story = {
  render: () => (
    <div className="w-[280px] h-[380px] bg-white">
      <ProductCard productId="1" />
    </div>
  ),
};
