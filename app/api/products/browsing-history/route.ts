// import { NextRequest, NextResponse } from "next/server";

// import Product, { IProduct } from "@/lib/db/models/product.model";
// import { connectToDatabase } from "@/lib/db";
// import { Types } from "mongoose";

// export const GET = async (request: NextRequest) => {
//   const listType = request.nextUrl.searchParams.get("type") || "history";
//   const productIdsParam = request.nextUrl.searchParams.get("ids");
//   const categoriesParam = request.nextUrl.searchParams.get("categories");

//   if (!productIdsParam?.trim() || !categoriesParam?.trim()) {
//     return NextResponse.json([]);
//   }

//   const productIds = productIdsParam.split(",");
//   //  const idOrderMap = new Map<string, string>(
//   //   productIds.map((id, index) => [id, index])
//   // );
//   const categories = categoriesParam.split(",");
//   const filter =
//     listType === "history"
//       ? {
//           _id: { $in: productIds },
//         }
//       : { category: { $in: categories }, _id: { $nin: productIds } };

//   await connectToDatabase();
//   const products = await Product.find(filter);

//   if (listType === "history")
//     return NextResponse.json(
//       products.sort(
//         (a, b) =>
//           productIds.indexOf(a._id.toString()) -
//           productIds.indexOf(b._id.toString())
//       )
//     );
//   return NextResponse.json<IProduct[]>(products);
// };

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

import { Types } from "mongoose";
import Product from "@/lib/db/models/product.model";

export const GET = async (request: NextRequest) => {
  const listType = request.nextUrl.searchParams.get("type") || "history";
  const productIdsParam = request.nextUrl.searchParams.get("ids");
  const categoriesParam = request.nextUrl.searchParams.get("categories");

  if (!productIdsParam || !categoriesParam) {
    return NextResponse.json([]);
  }

  const productIds = productIdsParam.split(",");
  const categories = categoriesParam.split(",");

  // Validate and convert only valid ObjectIds
  const validObjectIds = productIds
    .filter((id) => Types.ObjectId.isValid(id))
    .map((id) => new Types.ObjectId(id));

  await connectToDatabase();

  const filter = {
    _id: { $in: validObjectIds },
    category: { $in: categories },
  };

  const products = await Product.find(filter);

  // Optional: sort results to match original order of productIds
  const idOrderMap = new Map<string, number>(
    productIds.map((id, index) => [id, index])
  );

  const sortedProducts = products.sort((a, b) => {
    const aIndex = idOrderMap.get(a._id.toString()) ?? Infinity;
    const bIndex = idOrderMap.get(b._id.toString()) ?? Infinity;
    return aIndex - bIndex;
  });

  return NextResponse.json(sortedProducts);
};
