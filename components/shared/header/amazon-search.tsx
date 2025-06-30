import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function SearchBar() {
  //   const [query, setQuery] = useState("");
  //   const [category, setCategory] = useState("all");

  const categories = ["All", "Books", "Electronics", "Clothing", "Toys"];

  //   const handleSearch = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     alert(`Searching for "${query}" in "${category}"`);
  //   };

  return (
    <form
      action="/search"
      className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 w-full max-w-3xl mx-auto mt-10 bg-white shadow rounded overflow-hidden"
    >
      {/* Category Dropdown */}
      <Select name="category">
        <SelectTrigger className="rounded-none bg-white border-r-0 w-32">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          
          {categories.map((category) => (
            <SelectItem key={category} value={category.toLowerCase()}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Input */}
      <Input
        type="text"
        placeholder="Search Amazon"
        className="rounded-none flex-1 border-x-0"
      />

      {/* Search Button */}
      <Button
        type="submit"
        className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-none px-4"
      >
        <Search className="w-4 h-4" />
      </Button>
    </form>
  );
}
