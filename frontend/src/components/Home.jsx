import React, { useContext } from "react";
import { IoWoman, IoMan } from "react-icons/io5";
import { SiNike, SiAdidas, SiZara, SiPuma } from "react-icons/si";
import { FaChild } from "react-icons/fa6";
import { CgChanel } from "react-icons/cg";
import { GiSlippers, GiWatch } from "react-icons/gi";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import ProductCard from "./ProductCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { AllProductsContext } from "../store/ProductContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  let { allProducts } = useContext(AllProductsContext);
  const navigate = useNavigate();

 const handleCategoryClick = (categoryId) => {
  navigate(`/products?category=${categoryId}`);
};

  const handleBrandClick = (brandId) => {
    navigate(`/products?brand=${brandId}`);
  };

  const categories = [
    { id: "men", title: "Men", icon: <IoMan /> },
    { id: "women", title: "Women", icon: <IoWoman /> },
    { id: "kids", title: "Kids", icon: <FaChild /> },
    { id: "footware", title: "Footware", icon: <GiSlippers /> },
    { id: "accessories", title: "Accessories", icon: <GiWatch /> },
  ];

  const brands = [
    { id: "nike", brandName: "Nike", icon: <SiNike /> },
    { id: "chanel", brandName: "Chanel", icon: <CgChanel /> },
    { id: "adidas", brandName: "Adidas", icon: <SiAdidas /> },
    { id: "zara", brandName: "Zara", icon: <SiZara /> },
    { id: "puma", brandName: "Puma", icon: <SiPuma /> },
  ];

  const items = [
    <div className="item h-[80vh]" data-value="1">
      <img
        src="/images/image11.jpg"
        alt="Fashion stock"
        className="h-full w-full object-center object-cover"
      />
    </div>,
    <div className="item h-[80vh]" data-value="2">
      <img
        src="/images/freeStock.jpg"
        alt="Model posing"
        className="h-full w-full object-center object-cover"
      />
    </div>,
    <div className="item h-[80vh]" data-value="3">
      <img
        src="/images/shocked.jpg"
        alt="Marketplace"
        className="h-full w-full object-top object-cover"
      />
    </div>,
    <div className="item h-[80vh]" data-value="4">
      <img
        src="/images/curly.jpg"
        alt="Curly hair model"
        className="h-full w-full object-top object-cover"
      />
    </div>,
    <div className="item h-[80vh]" data-value="5">
      <img
        src="/images/.jpg"
        alt="Fashion bag"
        className="h-full w-full object-top object-cover"
      />
    </div>,
  ];

  return (
    <div className="h-full w-full bg-gray-50 mt-[70px]">
      {/* HERO CAROUSEL */}
      <header className="h-[80vh] w-full relative">
        <AliceCarousel
          autoPlay
          autoPlayStrategy="none"
          autoPlayInterval={2000}
          animationDuration={1000}
          animationType="slide"
          infinite
          touchTracking={false}
          // disableDotsControls
          // disableButtonsControls
          items={items}
          renderPrevButton={() => (
            <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full shadow-md hover:bg-black/70">
              <FaArrowLeft size={20} />
            </button>
          )}
          renderNextButton={() => (
            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full shadow-md hover:bg-black/70">
              <FaArrowRight size={20} />
            </button>
          )}
        />
      </header>

      <section className="py-20 px-4 md:px-12">
        <header>
          <h1 className="font-extrabold text-3xl text-center">
            Shop by Category
          </h1>
        </header>

        <article className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8 cursor-pointer">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="py-6 px-6 rounded bg-white shadow-md border border-gray-200 flex flex-col justify-center items-center hover:scale-105 transition-transform"
            >
              <figure className="text-6xl p-3">{category.icon}</figure>
              <h3 className="font-bold text-center pt-2">{category.title}</h3>
            </div>
          ))}
        </article>

        {/* Brands */}
        <header className="pt-20 pb-10">
          <h1 className="font-extrabold text-3xl text-center">
            Shop by Brands
          </h1>
        </header>

        <article className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8 cursor-pointer">
          {brands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => handleBrandClick(brand.id)}
              className="py-6 px-6 rounded bg-white shadow-md border border-gray-200 flex flex-col justify-center items-center hover:scale-105 transition-transform"
            >
              <figure className="text-6xl p-3">{brand.icon}</figure>
              <h3 className="font-bold text-center pt-2">{brand.brandName}</h3>
            </div>
          ))}
        </article>

        {/* Featured Products */}
        <header className="pt-20 pb-10">
          <h1 className="font-extrabold text-3xl text-center">
            Featured Products
          </h1>
        </header>

        <article className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {allProducts.length > 0 ? (
            allProducts.map((product, idx) => (
              <ProductCard key={idx} product={product} />
            ))
          ) : (
            <p>No Products Found</p>
          )}
        </article>
      </section>
    </div>
  );
};

export default Home;
