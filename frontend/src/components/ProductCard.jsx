import React from "react";
import { AxiosInstance } from "../api/axiosInstance";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  async function addToCart(item) {
    // console.log(items.id);
    let res = await AxiosInstance.post("/shop/cart/add", {
      productId: item.id,
    });
    console.log(res);
    if (res.data.success) {
      toast.success("Added to cart");
    }
  }
  return (
    <section className=" p-4">
      <div className="shadow-lg rounded-lg overflow-hidden w-64">
        <img
          src={
            product?.image && product.image.trim() !== ""
              ? product.image
              : "https://www.shutterstock.com/image-vector/no-image-available-picture-coming-600nw-2057829641.jpg"
          }
          alt={product?.title || "Product Image"}
          className="h-64 w-full object-fit object-center block mx-auto rounded-xl"
        />
        <div className="p-4">
          <h1 className="capitalize font-extrabold text-xl">{product.title}</h1>
          <p className="flex justify-between text-sm capitalize text-gray-600 font-semibold">
            <span className="">{product.category}</span>
            <span>{product.brand}</span>
          </p>
          <h3 className="flex justify-between font-semibold">
            <del>Rs.{product.price}</del>
            <span className="text-red-500">Rs.{product.salePrice}</span>
          </h3>
          <button
            onClick={() => addToCart(product)}
            className="bg-black text-white w-full rounded py-1 mt-3 cursor-pointer"
          >
            Add to cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCard;
