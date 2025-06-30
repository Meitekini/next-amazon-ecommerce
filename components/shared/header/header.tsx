"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ShoppingCart, User, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";

export default function TinyHeader() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = ["All", "Books", "Electronics", "Clothing", "Toys"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching for "${query}" in "${category}"`);
  };

  return (
    <header className="w-full bg-black shadow-sm border-b">
        <div className="px-2">
      <div className="max-w-7xl mx-auto py-3 flex items-center justify-between gap-4">
        {/* Logo */}
     
        <Link href='/' className="flex items-center text-2xl font-extrabold text-yellow-500 tracking-wide">
          <Image
            src='/icons/logo.svg'
            width={40}
            height={40}
            alt={`${APP_NAME} logo`}
          />
          {APP_NAME}
        </Link>
      

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden lg:flex flex-1 items-stretch gap-0 max-w-3xl bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm"
        >
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="rounded-none border-r w-28 text-sm bg-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-none border-x-0 bg-white"
          />

          <Button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-none px-4"
          >
            <Search className="w-4 h-4" />
          </Button>
        </form>

        {/* User & Cart */}
        <div className="flex items-center gap-4">
          {/* Account */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <User className="w-5 h-5" />
                <span className="text-sm">Account</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 text-sm">
              <div className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start">
                  Sign In
                </Button>
                <Button variant="ghost" className="justify-start">
                  Orders
                </Button>
                <Button variant="ghost" className="justify-start">
                  Settings
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Cart */}
          <div className="relative">
            <Button variant="outline" className="flex items-center gap-1">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm">Cart</span>
            </Button>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              3
            </span>
          </div>
        </div>
      </div>
        </div>
    </header>
  );
}
