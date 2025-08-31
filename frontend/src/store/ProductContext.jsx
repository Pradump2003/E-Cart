import { createContext, useEffect, useState } from "react";
import { AxiosInstance } from "../api/axiosInstance";

export const AllProductsContext = createContext();

const ProductContext = (props) => {
  const [allProducts, setAllProducts] = useState([]);

  async function getAllProducts() {
    let res = await AxiosInstance.get("/shop/product/get");
    setAllProducts(res.data.data);
    console.log(res.data.data);
    
  }

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <AllProductsContext.Provider value={{ allProducts }}>
      {props.children}
    </AllProductsContext.Provider>
  );
};

export default ProductContext;
