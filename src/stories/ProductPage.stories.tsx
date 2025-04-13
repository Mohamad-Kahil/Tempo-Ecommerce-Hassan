import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import ProductPage from "@/pages/product/[id]";

const meta: Meta<typeof ProductPage> = {
  title: "E-commerce/ProductPage",
  component: ProductPage,
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
type Story = StoryObj<typeof ProductPage>;

export const Default: Story = {};

// Note: The ProductPage component already has mock data built in,
// so we don't need to pass any props for the default story.
// For real implementation, we would create variations with different
// product data, loading states, error states, etc.
