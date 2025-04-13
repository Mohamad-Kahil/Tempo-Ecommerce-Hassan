import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderDetails } from "@/services/checkoutService";
import { CheckCircle2, MapPin, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrderConfirmationProps {
  orderDetails: OrderDetails;
}

const OrderConfirmation = ({ orderDetails }: OrderConfirmationProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Credit Card";
      case "paypal":
        return "PayPal";
      case "cash_on_delivery":
        return "Cash on Delivery";
      default:
        return method;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order #{orderDetails.orderId}</CardTitle>
          <CardDescription>
            Placed on {formatDate(orderDetails.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-2" /> Shipping Address
              </h3>
              <div className="text-sm text-muted-foreground">
                <p>{orderDetails.shippingInfo.fullName}</p>
                <p>{orderDetails.shippingInfo.address}</p>
                <p>
                  {orderDetails.shippingInfo.city},{" "}
                  {orderDetails.shippingInfo.postalCode}
                </p>
                <p>{orderDetails.shippingInfo.country}</p>
                <p>{orderDetails.shippingInfo.phone}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium flex items-center mb-2">
                <CreditCard className="h-4 w-4 mr-2" /> Payment Method
              </h3>
              <p className="text-sm text-muted-foreground">
                {getPaymentMethodText(orderDetails.paymentMethod)}
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Order Summary</h3>
              <div className="space-y-2">
                {orderDetails.items.map((item) => {
                  const { product, quantity } = item;
                  const price = product.price || 0;
                  const discount = product.discount_percentage || 0;
                  const discountedPrice = price * (1 - discount / 100);
                  const totalPrice = discountedPrice * quantity;

                  return (
                    <div
                      key={item.id}
                      className="flex justify-between py-2 border-b last:border-0"
                    >
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden mr-3">
                          <img
                            src={
                              product.thumbnail_url ||
                              "https://images.unsplash.com/photo-1581430872221-d1cfed785922?w=200&q=80"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">${totalPrice.toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Order Total</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${orderDetails.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${orderDetails.tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate("/")} className="w-full">
            Continue Shopping
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderConfirmation;
