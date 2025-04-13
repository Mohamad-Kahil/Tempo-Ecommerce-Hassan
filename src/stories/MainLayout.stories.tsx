import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

const meta: Meta<typeof MainLayout> = {
  title: "E-commerce/MainLayout",
  component: MainLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MainLayout>;

export const Default: Story = {
  args: {
    children: <div className="p-8">Main Content Area</div>,
    direction: "ltr",
  },
};

export const RTL: Story = {
  args: {
    children: <div className="p-8">منطقة المحتوى الرئيسية</div>,
    direction: "rtl",
  },
};

export const WithNestedContent: Story = {
  args: {
    children: (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Featured Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Product 1</h2>
            <p>Product description goes here</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Product 2</h2>
            <p>Product description goes here</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Product 3</h2>
            <p>Product description goes here</p>
          </div>
        </div>
      </div>
    ),
    direction: "ltr",
  },
};
