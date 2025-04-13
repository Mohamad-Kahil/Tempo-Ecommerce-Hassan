import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag, Loader2, LogIn } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import ShippingForm, {
  ShippingFormData,
} from "@/components/checkout/ShippingForm";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import { PaymentMethod as PaymentMethodType } from "@/services/checkoutService";

type CheckoutStep = "cart" | "shipping" | "payment" | "confirmation";

const CartPage = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotal,
    clearCart,
    submitOrder,
    isProcessingOrder,
    orderError,
    lastOrder,
  } = useCart();
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [shippingInfo, setShippingInfo] = useState<ShippingFormData | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 max-w-4xl">
        <div className="text-center py-16">
          <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin mb-4" />
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  // Show empty cart message if cart is empty and not in confirmation step
  if (items.length === 0 && checkoutStep !== "confirmation") {
    return (
      <div className="container mx-auto py-16 px-4 max-w-4xl">
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button onClick={() => navigate("/")} className="px-8">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  // Show order confirmation
  if (checkoutStep === "confirmation" && lastOrder) {
    return (
      <div className="container mx-auto py-8 px-4">
        <OrderConfirmation orderDetails={lastOrder} />
      </div>
    );
  }

  // Show shipping form
  if (checkoutStep === "shipping") {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="outline" onClick={handleBackToCart} className="mb-6">
          Back to Cart
        </Button>
        <ShippingForm onSubmit={handleShippingSubmit} />
      </div>
    );
  }

  // Show payment method selection
  if (checkoutStep === "payment") {
    return (
      <div className="container mx-auto py-8 px-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        {isProcessingOrder ? (
          <div className="text-center py-16">
            <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Processing your order...
            </h2>
            <p className="text-muted-foreground mb-6">
              Please wait while we process your payment.
            </p>
          </div>
        ) : (
          <PaymentMethod
            onSubmit={handlePaymentSubmit}
            onBack={handleBackToShipping}
          />
        )}
      </div>
    );
  }

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    setCheckoutStep("shipping");
  };

  const handleShippingSubmit = (data: ShippingFormData) => {
    setShippingInfo(data);
    setCheckoutStep("payment");
  };

  const handlePaymentSubmit = async (paymentMethod: PaymentMethodType) => {
    if (!shippingInfo) return;

    setError(null);
    try {
      await submitOrder(shippingInfo, paymentMethod);
      setCheckoutStep("confirmation");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    }
  };

  const handleBackToCart = () => {
    setCheckoutStep("cart");
  };

  const handleBackToShipping = () => {
    setCheckoutStep("shipping");
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => {
            const { product, quantity } = item;
            const price = product.price || 0;
            const discount = product.discount_percentage || 0;
            const discountedPrice = price * (1 - discount / 100);
            const totalPrice = discountedPrice * quantity;

            return (
              <Card key={item.id} className="mb-4 overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={
                          product.thumbnail_url ||
                          "https://images.unsplash.com/photo-1581430872221-d1cfed785922?w=200&q=80"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.supplier_name}
                      </p>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, quantity - 1)
                            }
                            disabled={quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="w-8 text-center">{quantity}</span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          {discount > 0 && (
                            <span className="text-sm line-through text-muted-foreground mr-2">
                              ${price.toFixed(2)}
                            </span>
                          )}
                          <span className="font-bold">
                            ${discountedPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-500"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="flex justify-between w-full text-lg font-bold mb-4">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <Button className="w-full" onClick={handleProceedToCheckout}>
                {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
                {!isAuthenticated && <LogIn className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
