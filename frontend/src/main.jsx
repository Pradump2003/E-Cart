import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthContext from "./store/AuthContext.jsx";
import ProductContext from "./store/ProductContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthContext>
    <ProductContext>
      <App />
    </ProductContext>
  </AuthContext>
);
