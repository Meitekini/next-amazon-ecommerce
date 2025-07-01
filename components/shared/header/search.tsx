import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APP_NAME } from "@/lib/constants";
import { SearchIcon } from "lucide-react";

const categories = ["men", "women", "kids", "accessories"];

export default function Search() {
  return (
    <form action="/search" method="GET" className="flex items-stretch h-10 ">
      <Select name="category">
        <SelectTrigger className="w-auto h-full dark:border-gray-200 bg-gray-100 text-black border-r  rounded-r-none rounded-l-md">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        className="flex-1 rounded-none dark:border-gray-200 bg-gray-100 text-black"
        placeholder={`Search Site ${APP_NAME}`}
        name="q"
        type="search"
      />
      <Button
        type="submit"
        className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-none rounded-e-md  px-3 py-2"
      >
        <SearchIcon className="w-4 h-4" />
      </Button>
    </form>
  );
}
