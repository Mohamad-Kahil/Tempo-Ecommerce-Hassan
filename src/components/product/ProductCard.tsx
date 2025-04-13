import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  id?: string;
  name?: string;
  price?: number;
  currency?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  supplier?: string;
  discount?: number;
  isNew?: boolean;
  inStock?: boolean;
  onAddToCart?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  product?: Product; // Add product prop to allow passing a product from Supabase
}

const ProductCard = ({
  id = "1",
  name = "Premium Ceramic Tiles",
  price = 299.99,
  currency = "USD",
  image = "https://images.unsplash.com/photo-1581430872221-d1cfed785922?w=500&q=80",
  rating = 4.5,
  reviewCount = 128,
  supplier = "Luxury Interiors",
  discount = 0,
  isNew = false,
  inStock = true,
  onAddToCart = () => {},
  onViewDetails = () => {},
  product,
}: ProductCardProps) => {
  // If a product is provided, use its data instead of the props
  const productId = product?.id || id;
  const productName = product?.name || name;
  const productPrice = product?.price || price;
  const productCurrency = product?.currency || currency;
  const productImage = product?.thumbnail_url || image;
  const productRating = product?.rating || rating;
  const productReviewCount = product?.review_count || reviewCount;
  const productSupplier = product?.supplier_name || supplier;
  const productDiscount = product?.discount_percentage || discount;
  const productIsNew = product?.is_new || isNew;
  const productInStock = (product?.stock_quantity ?? 0) > 0 || inStock;
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: productCurrency,
    minimumFractionDigits: 2,
  }).format(productPrice);

  const discountedPrice =
    productDiscount > 0
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: productCurrency,
          minimumFractionDigits: 2,
        }).format(productPrice * (1 - productDiscount / 100))
      : null;

  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use both the context method and the prop callback
    if (product) {
      addToCart(product);
    }
    onAddToCart(productId);
  };

  return (
    <Card
      className="w-full max-w-[280px] h-[380px] overflow-hidden transition-all duration-200 hover:shadow-lg bg-white"
      onClick={() => onViewDetails(productId)}
    >
      <div className="relative h-[200px] overflow-hidden bg-gray-100">
        <img
          src={productImage}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {productDiscount > 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            {productDiscount}% OFF
          </Badge>
        )}
        {productIsNew && (
          <Badge variant="secondary" className="absolute top-2 left-2">
            NEW
          </Badge>
        )}
      </div>

      <CardContent className="p-4 flex flex-col h-[180px]">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-base line-clamp-2">{productName}</h3>
        </div>

        <div className="text-sm text-muted-foreground mb-1">
          {productSupplier}
        </div>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{productRating}</span>
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            ({productReviewCount})
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            {productDiscount > 0 ? (
              <div className="flex flex-col">
                <span className="text-sm line-through text-muted-foreground">
                  {formattedPrice}
                </span>
                <span className="font-bold text-primary">
                  {discountedPrice}
                </span>
              </div>
            ) : (
              <span className="font-bold text-primary">{formattedPrice}</span>
            )}
          </div>

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!productInStock}
            className="ml-2"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {productInStock ? "Add" : "Out of Stock"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
