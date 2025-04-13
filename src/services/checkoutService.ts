import { CartItem } from "@/context/CartContext";
import { ShippingFormData } from "@/components/checkout/ShippingForm";

export type PaymentMethod = "credit_card" | "paypal" | "cash_on_delivery";

export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingInfo: ShippingFormData;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

// Mock function to simulate payment processing
export const processPayment = async (
  items: CartItem[],
  subtotal: number,
  shippingInfo: ShippingFormData,
  paymentMethod: PaymentMethod,
): Promise<OrderDetails> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Calculate shipping cost based on country
  const shippingCost = calculateShippingCost(shippingInfo.country);

  // Calculate tax (10% for this example)
  const taxAmount = subtotal * 0.1;

  // Generate a random order ID
  const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;

  // Create order details
  const orderDetails: OrderDetails = {
    orderId,
    items,
    subtotal,
    shipping: shippingCost,
    tax: taxAmount,
    total: subtotal + shippingCost + taxAmount,
    shippingInfo,
    paymentMethod,
    createdAt: new Date().toISOString(),
  };

  // Simulate success or failure (95% success rate)
  const isSuccessful = Math.random() < 0.95;

  if (!isSuccessful) {
    throw new Error("Payment processing failed. Please try again.");
  }

  return orderDetails;
};

// Helper function to calculate shipping cost based on country
const calculateShippingCost = (country: string): number => {
  switch (country) {
    case "Egypt":
      return 5;
    case "Saudi Arabia":
      return 15;
    case "Kuwait":
      return 20;
    case "UAE":
      return 12;
    default:
      return 25;
  }
};
