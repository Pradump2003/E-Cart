import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Avatar from "@mui/material/Avatar";
import { useContext, useEffect, useState } from "react";
import CartDrawer from "../../CartDrawer";
import { GlobalAuthContext } from "../../../store/AuthContext";
import { AxiosInstance } from "../../../api/axiosInstance";

const Navbar = () => {
  let navigate = useNavigate();

  const [menuToggle, setMenuToggled] = useState(false);
  const { loggedInUser, getUserInfo, userInfo, loading, setLoggedInUser } =
    useContext(GlobalAuthContext);

  useEffect(() => {
    getUserInfo();
  }, []);

  const toggleMenu = () => {
    setMenuToggled(!menuToggle);
  };

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
    { id: "search", title: "Search", path: "/search" },
  ];

  const handleLogout = async () => {
    try {
      let res = await AxiosInstance.post("/user/logout");
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);
        setLoggedInUser(false);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Logout Failed");
    }
  };

  function stringAvatar(name) {
    let word = name.split(" ");
    if (word.length >= 2) {
      return {
        children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
      };
    }
    return {
      children: `${name.split(" ")[0][0]}`,
    };
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <nav className="fixed top-0 h-[70px] w-full bg-white flex items-center justify-between px-6 shadow z-50">
      <div className="font-bold text-3xl text-black select-none">
        <span className="text-amber-400">Q</span>-Shop
      </div>

      {loggedInUser ? (
        <>
          <section className="flex gap-2">
            {categories.map((ele) => {
              return (
                <Link to={ele.path ? ele.path : "/home"}>
                  <div key={ele.id} className="p-4 font-semibold">
                    {ele.title}
                  </div>
                </Link>
              );
            })}
          </section>
        </>
      ) : null}

      <aside className="flex gap-4 font-semibold">
        {loggedInUser ? (
          <>
            <button>
              <CartDrawer />
            </button>

            <div className="relative" onClick={toggleMenu}>
              <Avatar
                sx={{ bgcolor: "black" }}
                className="uppercase"
                {...stringAvatar(userInfo.userName)}
              />

              {menuToggle ? (
                <>
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
                </>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <Link to={"/login"}>
              <button className="bg-white text-black px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition font-bold border focus:outline-none focus:ring-2 focus:ring-blue-400">
                Login
              </button>
            </Link>

            <Link to={"/"}>
              <button className="bg-black text-white px-6 py-2 rounded-lg shadow transition font-bold border  focus:outline-none focus:ring-2 focus:ring-blue-200">
                Signup
              </button>
            </Link>
          </>
        )}
      </aside>
    </nav>
  );
};

export default Navbar;
