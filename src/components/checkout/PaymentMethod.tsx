import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { PaymentMethod as PaymentMethodType } from "@/services/checkoutService";
import { CreditCard, Banknote, Wallet } from "lucide-react";

const formSchema = z.object({
  paymentMethod: z.enum(["credit_card", "paypal", "cash_on_delivery"], {
    required_error: "Please select a payment method.",
  }),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PaymentMethodProps {
  onSubmit: (paymentMethod: PaymentMethodType) => void;
  onBack: () => void;
}

const PaymentMethod = ({ onSubmit, onBack }: PaymentMethodProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "credit_card",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  const watchPaymentMethod = form.watch("paymentMethod");

  const handleSubmit = (data: FormData) => {
    onSubmit(data.paymentMethod as PaymentMethodType);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Select Payment Method</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-3"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md">
                      <FormControl>
                        <RadioGroupItem value="credit_card" />
                      </FormControl>
                      <CreditCard className="h-5 w-5 mr-2" />
                      <FormLabel className="font-normal cursor-pointer flex-1">
                        Credit Card
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md">
                      <FormControl>
                        <RadioGroupItem value="paypal" />
                      </FormControl>
                      <Wallet className="h-5 w-5 mr-2" />
                      <FormLabel className="font-normal cursor-pointer flex-1">
                        PayPal
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md">
                      <FormControl>
                        <RadioGroupItem value="cash_on_delivery" />
                      </FormControl>
                      <Banknote className="h-5 w-5 mr-2" />
                      <FormLabel className="font-normal cursor-pointer flex-1">
                        Cash on Delivery
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchPaymentMethod === "credit_card" && (
            <div className="space-y-4 border p-4 rounded-md">
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input placeholder="4242 4242 4242 4242" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cardExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/YY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardCvc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVC</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back to Shipping
            </Button>
            <Button type="submit">Complete Order</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PaymentMethod;
