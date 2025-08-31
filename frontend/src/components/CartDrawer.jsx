import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import { IoCart, IoClose } from "react-icons/io5";
import { AxiosInstance } from "../api/axiosInstance";
import { useState } from "react";
import CartProduct from "./CartProduct";

export default function CartDrawer() {
  const [open, setOpen] = React.useState(false);
  const [cartItems, setCartItems] = useState([]);

  async function getCartItems() {
    let res = await AxiosInstance.get("/shop/cart/get");
    setCartItems(res.data.data.items);
  }

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
    getCartItems();
  };

  const onClearCart = async () => {
    await AxiosInstance.delete("/shop/cart/clear");
    getCartItems();
  };

  const onDecrease = async (product) => {
    await AxiosInstance.patch("/shop/cart/update", {
      productId: product.productId,
    });
    getCartItems();
  };

  const onIncrease = async (product) => {
    await AxiosInstance.post("/shop/cart/add", {
      productId: product.productId,
    });
    getCartItems();
  };

  const onRemove = async (product) => {
    await AxiosInstance.delete(`/shop/cart/delete/${product.productId}`);
    getCartItems();
  };

  let totalPrice = cartItems.reduce((sum, item) => {
    return sum + item.salePrice * item.quantity;
  }, 0);

  const DrawerList = (
    <Box sx={{ width: 400 }} role="presentation" >
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-3xl font-semibold">My Cart</h1>
        <IoClose size={30} onClick={toggleDrawer(false)} />
      </div>

      <Divider />
      <h1 className="text-end p-2 text-2xl font-semibold text-red-400">
        <span
          className=" hover:text-red-700 cursor-pointer"
          onClick={onClearCart}
        >
          Clear Cart
        </span>
      </h1>
      <div>
        {cartItems.length === 0 ? (
          <h1 className="text-center font-semibold ">Cart is empty</h1>
        ) : (
          <>
            {cartItems.map((item, idx) => {
              return (
                <CartProduct
                  product={item}
                  key={idx}
                  onIncrease={onIncrease}
                  onDecrease={onDecrease}
                  onRemove={onRemove}
                />
              );
            })}
          </>
        )}
      </div>

      <Divider />

      <h1 className="text-center absolute bottom-5 right-0 text-2xl pe-3">
        Total Price : Rs. {Math.round(totalPrice)}
      </h1>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <IoCart size={30} />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        {DrawerList}
      </Drawer>
    </div>
  );
}
