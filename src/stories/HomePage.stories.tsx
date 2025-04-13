import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "@/components/home";

const meta: Meta<typeof HomePage> = {
  title: "E-commerce/HomePage",
  component: HomePage,
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
type Story = StoryObj<typeof HomePage>;

export const Default: Story = {};

// Note: The HomePage component already has mock data built in,
// so we don't need to pass any props for the default story.
// For real implementation, we would create variations with different
// featured products, categories, loading states, etc.
