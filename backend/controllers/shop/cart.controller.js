const expressAsyncHandler = require("express-async-handler");
const cartCollection = require("../../models/cart.model");
const productCollection = require("../../models/product.model");
const ApiResponse = require("../../utils/ApiResponse.utils");
const ErrorHandler = require("../../utils/ErrorHandler.utils");

// ─── Add To Cart ───────────────────────────────────────────────────────────────
const addToCart = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.body;

  const product = await productCollection.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  let cart = await cartCollection.findOne({ userId });
  if (!cart) {
    cart = await cartCollection.create({ userId, items: [] });
  }

  const index = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (index === -1) {
    cart.items.push({ productId, quantity: 1 });
  } else {
    cart.items[index].quantity += 1;
  }

  await cart.save();
  new ApiResponse(true, "Product added to cart successfully", cart, 200).send(
    res
  );
});

// ─── Fetch Cart Items ──────────────────────────────────────────────────────────
const fetchCartItems = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const cart = await cartCollection.findOne({ userId }).populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  if (!cart) return next(new ErrorHandler("Cart not found", 404));

  const validItems = cart.items.filter((item) => item.productId);
  if (validItems.length < cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  const populateCartItems = validItems.map((item) => ({
    productId: item.productId._id,
    quantity: item.quantity,
    title: item.productId.title,
    image: item.productId.image,
    price: item.productId.price,
    salePrice: item.productId.salePrice,
  }));

  const cartItems = {
    ...cart.toObject(),
    items: populateCartItems,
    isEmpty: populateCartItems.length === 0,
  };

  new ApiResponse(
    true,
    populateCartItems.length === 0
      ? "Cart is empty"
      : "Cart items fetched successfully",
    cartItems,
    200
  ).send(res);
});

// ─── Update Cart Items ─────────────────────────────────────────────────────────
const updateCartItems = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.body;

  const cart = await cartCollection.findOne({ userId });
  if (!cart) return next(new ErrorHandler("Cart not found", 404));

  const index = cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );
  if (index === -1) {
    return next(new ErrorHandler("Product not found in cart", 404));
  }

  // Decrease quantity by 1
  cart.items[index].quantity -= 1;

  // Optional: remove item if quantity is now 0 or less
  if (cart.items[index].quantity <= 0) {
    cart.items.splice(index, 1);
  }

  await cart.save();

  await cart.populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  const validItems = cart.items.filter((item) => item.productId);
  if (validItems.length < cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  const populateCartItems = validItems.map((item) => ({
    productId: item.productId?._id || null,
    quantity: item.quantity || 0,
    title: item.productId?.title || "Product not found",
    image: item.productId?.image || null,
    price: item.productId?.price || 0,
    salePrice: item.productId?.salePrice || 0,
  }));

  const cartItems = {
    ...cart.toObject(),
    items: populateCartItems,
    isEmpty: populateCartItems.length === 0,
  };

  new ApiResponse(true, "Cart updated successfully", cartItems, 200).send(res);
});


// ─── Delete Cart Item ──────────────────────────────────────────────────────────
const deleteCartItem = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const cart = await cartCollection.findOne({ userId }).populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  if (!cart) return next(new ErrorHandler("Cart not found", 404));

  const index = cart.items.findIndex(
    (item) => item.productId && item.productId._id.toString() === productId
  );
  if (index === -1) {
    return next(new ErrorHandler("Product not found in cart", 404));
  }

  cart.items.splice(index, 1);
  await cart.save();

  await cart.populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  const validItems = cart.items.filter((item) => item.productId);
  const populateCartItems = validItems.map((item) => ({
    productId: item.productId._id,
    quantity: item.quantity,
    title: item.productId.title,
    image: item.productId.image,
    price: item.productId.price,
    salePrice: item.productId.salePrice,
  }));

  const cartItems = {
    ...cart.toObject(),
    items: populateCartItems,
    isEmpty: populateCartItems.length === 0,
  };

  const message =
    populateCartItems.length === 0
      ? "Cart is now empty"
      : "Product removed from cart successfully";

  new ApiResponse(true, message, cartItems, 200).send(res);
});

// ─── Clear Cart ────────────────────────────────────────────────────────────────
const clearCart = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const cart = await cartCollection.findOne({ userId });
  if (!cart) return next(new ErrorHandler("Cart not found", 404));

  // Clear all items
  cart.items = [];
  await cart.save();

  const emptyCart = {
    ...cart.toObject(),
    items: [],
    isEmpty: true,
  };

  new ApiResponse(true, "Cart cleared successfully", emptyCart, 200).send(res);
});

// ─── Exports ───────────────────────────────────────────────────────────────────
module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItems,
  deleteCartItem,
  clearCart,
};