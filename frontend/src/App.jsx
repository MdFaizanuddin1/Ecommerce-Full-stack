import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./redux/userSlice";
import { getCartData } from "./redux/cartSlice";
import { getAllWishLists } from "./redux/wishListSlice";
import Footer from "./components/Footer";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(getCartData());
    dispatch(getAllWishLists());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
