"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCartStore from "@/hooks/use-cart-store";
import { OrderItem } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AddToCart({
  item,
  minimal = false,
}: {
  item: OrderItem;
  minimal?: boolean;
}) {
  const router = useRouter();

  const { addItem } = useCartStore();

  const [quantity, setQuantity] = useState(1);

  return minimal ? (
    <Button
      className="rounded-full w-auto"
      onClick={() => {
        try {
          addItem(item, 1);
          toast("Item Added to Cart");
        } catch (error: unknown) {
          if (error instanceof Error) toast(error.message);
          else toast("Something went wrong");
        }
      }}
    >
      Add to Cart
    </Button>
  ) : (
    <div className="w-full space-y-2">
      <Select
        value={quantity.toString()}
        onValueChange={(i) => setQuantity(Number(i))}
      >
        <SelectTrigger className="">
          <SelectValue>Quantity: {quantity}</SelectValue>
        </SelectTrigger>
        <SelectContent position="popper">
          {Array.from({ length: item.countInStock }).map((_, i) => (
            <SelectItem key={i + 1} value={`${i + 1}`}>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        className="rounded-full w-full"
        type="button"
        onClick={async () => {
          try {
            const itemId = await addItem(item, quantity);
            router.push(`/cart/${itemId}`);
          } catch (error: unknown) {
            if (error instanceof Error) toast(error.message);
            else toast("Something went wrong");
          }
        }}
      >
        Add to Cart
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          try {
            addItem(item, quantity);
            router.push(`/checkout`);
          } catch (error: unknown) {
            if (error instanceof Error) toast(error.message);
            else toast("Something went wrong");
          }
        }}
        className="w-full rounded-full "
      >
        Buy Now
      </Button>
    </div>
  );
}
