import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Avatar from "@mui/material/Avatar";
import { useContext, useEffect, useState } from "react";
import CartDrawer from "../../CartDrawer";
import { GlobalAuthContext } from "../../../store/AuthContext";
import { AxiosInstance } from "../../../api/axiosInstance";
import { FiMenu, FiX } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuToggle, setMenuToggled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { loggedInUser, getUserInfo, userInfo, loading, setLoggedInUser } =
    useContext(GlobalAuthContext);

  useEffect(() => {
    getUserInfo();
  }, []);

  const categories = [
    { id: "home", title: "Home", path: "/home" },
    { id: "products", title: "Products", path: "/products" },
    { id: "men", title: "Men", path: "/products?category=men" },
    { id: "women", title: "Women", path: "/products?category=women" },
    { id: "kids", title: "Kids", path: "/products?category=kids" },
    { id: "footwear", title: "Footwear", path: "/products?category=footwear" },
    {
      id: "accessories",
      title: "Accessories",
      path: "/products?category=accessories",
    },
  ];

  const handleLogout = async () => {
    try {
      const res = await AxiosInstance.post("/user/logout");
      if (res.data.success) {
        toast.success(res.data.message);
        setLoggedInUser(false);
        navigate("/login");
      }
    } catch (error) {
      toast.error("Logout Failed");
    }
  };

  function stringAvatar(name) {
    const word = name.split(" ");
    return {
      children:
        word.length >= 2 ? `${word[0][0]}${word[1][0]}` : `${word[0][0]}`,
    };
  }

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery("");
      setSearchVisible(false);
      setMobileMenu(false);
    }
  };

  if (loading) return <h1>Loading...</h1>;

  // Helper function to determine if a category link is active
  const isCategoryActive = (linkPath) => {
    const currentCategory =
      new URLSearchParams(location.search).get("category") || "";
    const linkCategory =
      new URLSearchParams(linkPath.split("?")[1]).get("category") || "";

    if (
      linkPath === "/products" &&
      location.pathname === "/products" &&
      !currentCategory
    ) {
      return true; // "Products" main link active when no category selected
    }
    if (
      linkCategory &&
      linkCategory === currentCategory &&
      location.pathname === "/products"
    ) {
      return true; // Category link matches
    }
    if (linkPath === location.pathname && !linkPath.includes("/products")) {
      return true; // Other main pages like /home
    }
    return false;
  };

  return (
    <nav className="fixed top-0 h-[70px] w-full bg-white flex items-center justify-between px-6 shadow z-50">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center space-x-1 whitespace-nowrap cursor-pointer"
      >
        <span className="text-yellow-500 font-bold text-2xl">Q-</span>
        <span className="text-black font-bold text-2xl">Shop</span>
      </div>

      {/* Desktop Menu */}
      {loggedInUser && (
        <section className="hidden md:flex gap-2 items-center">
          {categories.map((ele) => (
            <NavLink
              key={ele.id}
              to={ele.path}
              className={() =>
                `p-4 font-semibold cursor-pointer hover:text-blue-500 ${
                  isCategoryActive(ele.path) ? "text-blue-500" : "text-black"
                }`
              }
            >
              {ele.title}
            </NavLink>
          ))}

          {/* Inline Search Bar */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-3 py-2 rounded-lg"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer font-extrabold text-2xl"
            >
              <FiSearch />
            </button>
          </div>
        </section>
      )}

      {/* Right Side (Login / Profile / Cart) */}
      <aside className="flex items-center gap-4 font-semibold">
        {loggedInUser ? (
          <>
            <CartDrawer />

            {/* Avatar & Menu */}
            <div
              className="relative"
              onClick={() => setMenuToggled(!menuToggle)}
            >
              <Avatar
                sx={{ bgcolor: "black" }}
                className="uppercase cursor-pointer"
                {...stringAvatar(userInfo.userName)}
              />
              {menuToggle && (
                <div className="absolute min-w-40 p-2 right-0 bg-white rounded shadow-lg top-12 z-50 border border-gray-200">
                  <ul className="flex flex-col gap-2">
                    <li
                      onClick={handleLogout}
                      className="hover:bg-gray-100 px-2 py-1 cursor-pointer"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <FiX /> : <FiMenu />}
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">
              <button className="bg-white text-black px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition font-bold border focus:outline-none focus:ring-2 focus:ring-blue-400">
                Login
              </button>
            </NavLink>
            <NavLink to="/">
              <button className="bg-black text-white px-6 py-2 rounded-lg shadow transition font-bold border focus:outline-none focus:ring-2 focus:ring-blue-200">
                Signup
              </button>
            </NavLink>
          </>
        )}
      </aside>

      {/* Mobile Menu */}
      {mobileMenu && loggedInUser && (
        <div className="absolute top-[70px] left-0 w-full bg-white shadow-lg flex flex-col p-4 gap-3 md:hidden">
          {categories.map((ele) => (
            <NavLink
              key={ele.id}
              to={ele.path}
              onClick={() => setMobileMenu(false)}
              className={() =>
                `p-2 font-semibold cursor-pointer hover:text-amber-500 ${
                  isCategoryActive(ele.path) ? "text-amber-500" : "text-black"
                }`
              }
            >
              {ele.title}
            </NavLink>
          ))}

          {/* Search inside mobile menu */}
          {searchVisible && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border px-3 py-2 rounded-lg flex-1"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
              >
                Go
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
