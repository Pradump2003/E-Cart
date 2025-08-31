const orderCollection = require("../../models/order.model");
const cartCollection = require("../../models/cart.model");
const addressCollection = require("../../models/address.model");
const productCollection = require("../../models/product.model");
const paypal = require("../../config/paypal.config");
const expressAsyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler.utils");
const ApiResponse = require("../../utils/ApiResponse.utils");

const createOrder = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { cartId, addressId, paymentMethod } = req.body;

  if (!cartId || !addressId || !paymentMethod) {
    return next(new ErrorHandler("Missing required fields", 400));
  }

  const cart = await cartCollection.findById(cartId);
  if (!cart || cart.userId.toString() !== userId.toString()) {
    return next(new ErrorHandler("Invalid or unauthorized cart", 404));
  }

  const address = await addressCollection.findById(addressId);
  if (!address || address.userId.toString() !== userId.toString()) {
    return next(new ErrorHandler("Invalid or unauthorized address", 404));
  }

  let totalAmount = 0;
  const cartItems = [];

  for (const item of cart.items) {
    const product = await productCollection.findById(item.productId);
    if (!product) {
      return next(new ErrorHandler(`Product ${item.productId} not found`, 400));
    }

    totalAmount += product.price * item.quantity;
    cartItems.push({
      productId: product._id,
      title: product.title,
      image: product.image,
      price: product.price,
      quantity: item.quantity,
    });
  }

  const addressInfo = {
    addressId: address._id,
    address: address.address,
    city: address.city,
    pincode: address.pincode,
    phone: address.phone,
    notes: address.notes || "",
  };

  // ✅ ONLINE PAYMENT FLOW (SAFE)
  if (paymentMethod === "Online") {
    const create_payment_json = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: `http://localhost:5173/shop/paypal-return`,
        cancel_url: `http://localhost:5173/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId.toString(),
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "Order payment",
        },
      ],
    };

    // 🛑 Do NOT create the order until payment creation succeeds
    paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        console.error("PayPal error:", error);
        return next(new ErrorHandler("Payment creation failed", 500));
      }

      try {
        const approvalLink = payment.links.find((link) => link.rel === "approval_url")?.href;
        if (!approvalLink) {
          return next(new ErrorHandler("Approval link not received", 500));
        }

        // ✅ Create order only if PayPal creation succeeded
        const order = await orderCollection.create({
          userId,
          cartId,
          cartItems,
          addressInfo,
          paymentMethod,
          totalAmount,
          paymentId: payment.id,
          paymentStatus: "Pending",
          orderStatus: "Pending",
        });

        return new ApiResponse(true, "Order created successfully", {
          orderId: order._id,
          paymentLink: approvalLink,
        }).send(res);
      } catch (dbError) {
        console.error("Order creation failed:", dbError);
        return next(new ErrorHandler("Order save failed after payment creation", 500));
      }
    });
  }

  // ✅ COD FLOW
  else {
    try {
      const order = await orderCollection.create({
        userId,
        cartId,
        cartItems,
        addressInfo,
        paymentMethod,
        totalAmount,
        orderStatus: "Pending",
        paymentStatus: "Pending",
      });

      return new ApiResponse(true, "Order placed successfully (COD)", {
        orderId: order._id,
      }).send(res);
    } catch (err) {
      return next(new ErrorHandler("COD order creation failed", 500));
    }
  }
});

const capturePayment = expressAsyncHandler(async (req, res, next) => {});

const getOrders = expressAsyncHandler(async (req, res, next) => {});

const getOrder = expressAsyncHandler(async (req, res, next) => {});

const cancelOrder = expressAsyncHandler(async (req, res, next) => {});

module.exports = { createOrder, capturePayment, getOrders, getOrder, cancelOrder };
