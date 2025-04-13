import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/hooks/useProducts";
import {
  OrderDetails,
  PaymentMethod,
  processPayment,
} from "@/services/checkoutService";
import { ShippingFormData } from "@/components/checkout/ShippingForm";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isProcessingOrder: boolean;
  orderError: string | null;
  lastOrder: OrderDetails | null;
  submitOrder: (
    shippingInfo: ShippingFormData,
    paymentMethod: PaymentMethod,
  ) => Promise<OrderDetails>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<OrderDetails | null>(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id,
      );

      if (existingItemIndex >= 0) {
        // Item exists, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Item doesn't exist, add new item
        return [...prevItems, { id: product.id, product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems((prevItems) => {
      return prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      );
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculate total number of items in cart
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate subtotal price
  const subtotal = items.reduce((total, item) => {
    const price = item.product.price || 0;
    const discount = item.product.discount_percentage || 0;
    const discountedPrice = price * (1 - discount / 100);
    return total + discountedPrice * item.quantity;
  }, 0);

  // Submit order function
  const submitOrder = async (
    shippingInfo: ShippingFormData,
    paymentMethod: PaymentMethod,
  ): Promise<OrderDetails> => {
    setIsProcessingOrder(true);
    setOrderError(null);

    try {
      // Process the payment and create order
      const orderDetails = await processPayment(
        items,
        subtotal,
        shippingInfo,
        paymentMethod,
      );

      // Save the order details
      setLastOrder(orderDetails);

      // Clear the cart after successful order
      clearCart();

      return orderDetails;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setOrderError(errorMessage);
      throw error;
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isProcessingOrder,
        orderError,
        lastOrder,
        submitOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
