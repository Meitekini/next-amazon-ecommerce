import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AVAILABLE_DELIVERY_DATES } from "./constants";
import { OrderItem, ShippingAddress } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const round2 = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const generateId = () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)).join("");

export const formatNumberWithDecimal = (num: number): string => {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : int;
};
// PROMPT: [ChatGTP] create toSlug ts arrow function that convert text to lowercase, remove non-word, non-whitespace, non-hyphen characters, replace whitespace, trim leading hyphens and trim trailing hyphens

export const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
});
export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

export const formatError = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name: string }).name === "ZodError"
  ) {
    const err = error as unknown as {
      errors: Record<string, { message: string; path: string }>;
    };
    const fieldErrors = Object.keys(err.errors).map((field) => {
      const errorMessage = err.errors[field].message;
      return `${err.errors[field].path}: ${errorMessage}`; // field: errorMessage
    });
    return fieldErrors.join(". ");
  } else if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name: string }).name === "ValidationError"
  ) {
    const err = error as unknown as {
      errors: Record<string, { message: string }>;
    };
    const fieldErrors = Object.keys(err.errors).map((field) => {
      const errorMessage = err.errors[field].message;
      return errorMessage;
    });
    return fieldErrors.join(". ");
  } else if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 11000
  ) {
    const err = error as unknown as { keyValue: Record<string, string> };
    const duplicateField = Object.keys(err.keyValue)[0];
    return `${duplicateField} already exists`;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    return typeof (error as { message: unknown }).message === "string"
      ? (error as { message: string }).message
      : JSON.stringify((error as { message: unknown }).message);
  } else {
    return "Something went wrong. please try again";
  }
};

export function calculateFutureDate(days: number) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + days);
  return currentDate;
}
export function getMonthName(yearAndMonth: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [year, monthNumber] = yearAndMonth.split("-");
  const date = new Date();
  date.setMonth(parseInt(monthNumber) - 1);
  return new Date().getMonth() === parseInt(monthNumber) - 1
    ? `${date.toLocaleString("default", { month: "long" })} (ongoing)`
    : date.toLocaleString("default", { month: "long" });
}
export function calculatePastDate(days: number) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - days);
  return currentDate;
}
export function timeUntilMidnight(): { hours: number; minutes: number } {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0); // Set to 12:00 AM (next day)

  const diff = midnight.getTime() - now.getTime(); // Difference in milliseconds
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    // weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};
export const calcDeliveryDateAndPrice = async ({
  items,
  shippingAddress,
  deliveryDateIndex,
}: {
  deliveryDateIndex?: number;
  shippingAddress?: ShippingAddress;
  items: OrderItem[];
}) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  const deliveryDate =
    AVAILABLE_DELIVERY_DATES[
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex
    ];
  const shippingPrice =
    !shippingAddress || !deliveryDate
      ? undefined
      : deliveryDate.freeShippingMinPrice > 0 &&
          itemsPrice >= deliveryDate.freeShippingMinPrice
        ? 0
        : deliveryDate.shippingPrice;

  const taxPrice = !shippingAddress ? undefined : round2(itemsPrice * 0.15);
  const totalPrice = round2(
    itemsPrice +
      (shippingPrice ? round2(shippingPrice) : 0) +
      (taxPrice ? round2(taxPrice) : 0)
  );
  return {
    AVAILABLE_DELIVERY_DATES,
    deliveryDateIndex:
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};

export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}
