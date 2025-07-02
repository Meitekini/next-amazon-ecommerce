// // lib/getProducts.ts

// import { Types } from "mongoose";
// import { connectToDatabase } from "../db";
// import Product from "../db/models/product.model";

// export async function getProducts({
//   type = "history",
//   ids = "",
//   categories = "",
// }: {
//   type?: string;
//   ids: string;
//   categories: string;
// }) {
//   if (!ids.trim() || !categories.trim()) return [];

//   const productIds = ids.split(",").map((id) => new Types.ObjectId(id));
//   const categoryList = categories.split(",");

//   const filter =
//     type === "history"
//       ? { _id: { $in: productIds } }
//       : { category: { $in: categoryList }, _id: { $nin: productIds } };

//   await connectToDatabase();
//   const products = await Product.find(filter).lean();

//   if (type === "history") {
//     const idMap = new Map(productIds.map((id, index) => [id.toString(), index]));
//     return products.sort(
//       (a, b) => idMap.get(a._id?.toString()) - idMap.get(b._id?.toString())
//     );
//   }

//   return products;
// }
