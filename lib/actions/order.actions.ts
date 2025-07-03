"use server";
import { Cart, OrderItem, ShippingAddress } from "@/types";
import { calcDeliveryDateAndPrice, formatError, round2 } from "../utils";
import {
  AVAILABLE_DELIVERY_DATES,
  FREE_SHIPPING_MIN_PRICE,
} from "../constants";
import { connectToDatabase } from "../db";
import { OrderInputSchema } from "../validators";
import { auth } from "@/auth";
import Order, { IOrder } from "../db/models/order.model";
import { revalidatePath } from "next/cache";
import { sendPurchaseReceipt } from "@/emails";
import { paypal } from "../paypal";
export async function getOrderById(orderId: string): Promise<IOrder> {
  await connectToDatabase();
  const order = await Order.findById(orderId);
  return JSON.parse(JSON.stringify(order));
}

export async function createPayPalOrder(orderId: string) {
  await connectToDatabase();
  try {
    const order = await Order.findById(orderId);
    if (order) {
      const paypalOrder = await paypal.createOrder(order.totalPrice);
      order.paymentResult = {
        id: paypalOrder.id,
        email_address: "",
        status: "",
        pricePaid: "0",
      };
      await order.save();
      return {
        success: true,
        message: "PayPal order created successfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}

export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  await connectToDatabase();
  try {
    const order = await Order.findById(orderId).populate("user", "email");
    if (!order) throw new Error("Order not found");

    const captureData = await paypal.capturePayment(data.orderID);
    if (
      !captureData ||
      captureData.id !== order.paymentResult?.id ||
      captureData.status !== "COMPLETED"
    )
      throw new Error("Error in paypal payment");
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: captureData.id,
      status: captureData.status,
      email_address: captureData.payer.email_address,
      pricePaid:
        captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
    };
    await order.save();
    await sendPurchaseReceipt({ order });
    revalidatePath(`/account/orders/${orderId}`);
    return {
      success: true,
      message: "Your order has been successfully paid by PayPal",
    };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}

// CREATE
export const createOrder = async (clientSideCart: Cart) => {
  try {
    await connectToDatabase();
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    // recalculate price and delivery date on the server
    const createdOrder = await createOrderFromCart(
      clientSideCart,
      session.user.id!
    );
    return {
      success: true,
      message: "Order placed successfully",
      data: { orderId: createdOrder._id.toString() },
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const createOrderFromCart = async (
  clientSideCart: Cart,
  userId: string
) => {
  const cart = {
    ...clientSideCart,
    ...calcDeliveryDateAndPrice({
      items: clientSideCart.items,
      shippingAddress: clientSideCart.shippingAddress,
      deliveryDateIndex: clientSideCart.deliveryDateIndex,
    }),
  };

  const order = OrderInputSchema.parse({
    user: userId,
    items: cart.items,
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
    expectedDeliveryDate: cart.expectedDeliveryDate,
  });
  return await Order.create(order);
};
