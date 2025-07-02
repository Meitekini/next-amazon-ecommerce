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
// the above code generates below error. The code below solves the bproblem
//  CastError: Cast to ObjectId failed for value "" (type string) at path "_id" for model "Product"
//     at Array.map (<anonymous>)
//     at async GET (app\api\products\browsing-history\route.ts:29:19)
//   27 |
//   28 |   await connectToDatabase();
// > 29 |   const products = await Product.find(filter);
//      |                   ^
//   30 |
//   31 |   if (listType === "history")
//   32 |     return NextResponse.json( {
//   stringValue: '""',
//   messageFormat: undefined,
//   kind: 'ObjectId',
//   value: '',
//   path: '_id',
//   reason: BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
//       at Array.map (<anonymous>)
//       at async GET (app\api\products\browsing-history\route.ts:29:19)
//     27 |
//     28 |   await connectToDatabase();
//   > 29 |   const products = await Product.find(filter);
//        |                   ^
//     30 |
//     31 |   if (listType === "history")
//     32 |     return NextResponse.json(,
//   valueType: 'string'
// }

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
