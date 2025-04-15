import { useState } from "react";
import { Tables } from "@/types/supabase";

type Product = Tables<"products">;
type ValidationErrors = Record<string, string>;

export function useProductValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (product: Partial<Product>): boolean => {
    const newErrors: ValidationErrors = {};

    // Name validation
    if (!product.name || product.name.trim() === "") {
      newErrors.name = "Name is required";
    } else if (product.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    } else if (product.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters long";
    }

    // Price validation
    if (product.price === undefined || product.price === null) {
      newErrors.price = "Price is required";
    } else if (product.price < 0) {
      newErrors.price = "Price cannot be negative";
    }

    // Stock validation
    if (product.stock === undefined || product.stock === null) {
      newErrors.stock = "Stock quantity is required";
    } else if (product.stock < 0) {
      newErrors.stock = "Stock quantity cannot be negative";
    }

    // SKU validation
    if (!product.sku || product.sku.trim() === "") {
      newErrors.sku = "SKU is required";
    } else if (!/^[A-Za-z0-9-_]+$/.test(product.sku)) {
      newErrors.sku =
        "SKU can only contain letters, numbers, hyphens, and underscores";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateForm,
    clearErrors,
  };
}
