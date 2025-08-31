const expressAsyncHandler = require("express-async-handler");
const { uploadImageOnCloudinary } = require("../../utils/cloudinary.utils");
const ApiResponse = require("../../utils/ApiResponse.utils");
const productCollection = require("../../models/product.model");
const ErrorHandler = require("../../utils/ErrorHandler.utils");

const imageUpload = expressAsyncHandler(async (req, res, next) => {
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const url = "data:" + req.file.mimetype + ";base64," + b64;
  const uploaded = await uploadImageOnCloudinary(url);
  new ApiResponse(true, "Image uploaded successfully", uploaded, 201).send(res);
});

const addProduct = expressAsyncHandler(async (req, res) => {
  const { image, title, description, category, brand, price, totalStock, salePrice } = req.body;
  const product = await productCollection.create({
    title,
    description,
    category,
    brand,
    price,
    totalStock,
    salePrice,
    image,
  });
  new ApiResponse(true, "Product added successfully", product, 201).send(res);
});

const fetchAllProducts = expressAsyncHandler(async (req, res) => {
  const products = await productCollection.find();
  if (products.length === 0) return next(new ErrorHandler("No products found", 404));
  new ApiResponse(true, "Products fetched successfully", products, 200).send(res);
});

const deleteProduct = expressAsyncHandler(async (req, res) => {
  const product = await productCollection.findByIdAndDelete(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));
  new ApiResponse(true, "Product deleted successfully", product, 200).send(res);
});

const updateProduct = expressAsyncHandler(async (req, res) => {
  const product = await productCollection.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) return next(new ErrorHandler("Product not found", 404));
  new ApiResponse(true, "Product updated successfully", product, 200).send(res);
});

module.exports = { imageUpload, addProduct, fetchAllProducts, deleteProduct, updateProduct };
