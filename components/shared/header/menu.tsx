import { ShoppingCartIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import CartButton from "./cart-button";
import UserButton from "./user-button";

function Menu() {
  return (
    <div className="flex justify-end">
      <nav className="flex gap-3 w-full">
        <UserButton />
        <CartButton />
      </nav>
    </div>
  );
}

export default Menu;
