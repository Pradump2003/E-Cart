import React, { useEffect, useState } from "react";
import { AxiosInstance } from "../api/axiosInstance";
import Divider from "@mui/material/Divider";
import ProductCard from "./ProductCard";
import { useSearchParams } from "react-router-dom";
import { Listbox } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";

const ProductList = () => {
  const [searchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category");
  const brandFromUrl = searchParams.get("brand");
  const searchFromUrl = searchParams.get("search"); // ✅ from query string

  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("price-lowToHigh"); // ✅ default
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const sidebarFilter = {
    category: [
      { id: "men", title: "Men" },
      { id: "women", title: "Women" },
      { id: "kids", title: "Kids" },
      { id: "accessories", title: "Accessories" },
      { id: "footwear", title: "Footwear" },
    ],
    brand: [
      { id: "nike", title: "Nike" },
      { id: "adidas", title: "Adidas" },
      { id: "puma", title: "Puma" },
      { id: "chanel", title: "Chanel" },
      { id: "zara", title: "Zara" },
      { id: "h&m", title: "H&M" },
    ],
  };

  const sortOptions = [
    { value: "price-lowToHigh", label: "Price: Low to High" },
    { value: "price-highToLow", label: "Price: High to Low" },
    { value: "title-aToZ", label: "Title: A → Z" },
    { value: "title-zToA", label: "Title: Z → A" },
  ];

  // ✅ Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get("/shop/product/get", {
        params: {
          ...(sortBy && { sortBy }),
          ...(selectedBrand.length > 0 && { brand: selectedBrand.join(",") }),
          ...(selectedCategory.length > 0 && {
            category: selectedCategory.join(","),
          }),
          ...(searchFromUrl && { search: searchFromUrl }),
        },
      });

      setProducts(res.data?.data || []); // ✅ safe access
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sync filters with URL
  useEffect(() => {
    if (categoryFromUrl) setSelectedCategory([categoryFromUrl]);
    if (brandFromUrl) setSelectedBrand([brandFromUrl]);
  }, [categoryFromUrl, brandFromUrl]);

  useEffect(() => {
    fetchProducts();
  }, [sortBy, selectedBrand, selectedCategory, searchFromUrl]);

  return (
    <div className="pt-[70px]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="bg-white min-h-screen w-[20%] p-3 border border-gray-100 rounded-md ml-2 mt-3 mb-3">
          <header className="p-5">
            <h1 className="text-2xl font-bold">Filters</h1>
          </header>
          <Divider />

          {/* Categories */}
          <section className="p-5">
            <h1 className="text-xl font-semibold">Category</h1>
            <ul className="py-4 select-none">
              {sidebarFilter.category.map((ele) => (
                <li
                  key={ele.id}
                  className="flex items-center font-medium text-md gap-2"
                >
                  <input
                    type="checkbox"
                    id={ele.id}
                    checked={selectedCategory.includes(ele.id)}
                    onChange={() =>
                      setSelectedCategory((prev) =>
                        prev.includes(ele.id)
                          ? prev.filter((cat) => cat !== ele.id)
                          : [...prev, ele.id]
                      )
                    }
                  />
                  <label htmlFor={ele.id}>{ele.title}</label>
                </li>
              ))}
            </ul>
          </section>

          <Divider />

          {/* Brands */}
          <section className="p-5">
            <h1 className="text-xl font-semibold">Brands</h1>
            <ul className="py-4 select-none">
              {sidebarFilter.brand.map((ele) => (
                <li
                  key={ele.id}
                  className="flex items-center font-medium text-md gap-2"
                >
                  <input
                    type="checkbox"
                    id={ele.id}
                    checked={selectedBrand.includes(ele.id)}
                    onChange={() =>
                      setSelectedBrand((prev) =>
                        prev.includes(ele.id)
                          ? prev.filter((brand) => brand !== ele.id)
                          : [...prev, ele.id]
                      )
                    }
                  />
                  <label htmlFor={ele.id}>{ele.title}</label>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        {/* Product List */}
        <main className="min-h-screen w-[80%] border border-gray-100 rounded-md ml-2 mt-3 mb-3">
          <header className="p-5 flex justify-between bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold">All Products</h1>

            <div className="flex gap-4 items-center">
              <span>{`${products.length} Products`}</span>

              {/* Sort dropdown */}
              <div className="relative w-56">
                <Listbox value={sortBy} onChange={setSortBy}>
                  <Listbox.Button className="w-full flex justify-between items-center p-2 shadow-md rounded-lg bg-white text-black border cursor-pointer">
                    {sortOptions.find((opt) => opt.value === sortBy)?.label}
                    <FiChevronDown className="ml-2 text-gray-500" />
                  </Listbox.Button>

                  <Listbox.Options className="absolute mt-1 w-full bg-white shadow-md rounded-lg border z-10">
                    {sortOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option.value}
                        className={({ active }) =>
                          `cursor-pointer p-2 rounded ${
                            active ? "bg-gray-100" : ""
                          }`
                        }
                      >
                        {option.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-600 animate-pulse">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">No products available</p>
            </div>
          ) : (
            <article className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </article>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;
