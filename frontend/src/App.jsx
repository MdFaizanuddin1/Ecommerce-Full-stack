import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./redux/userSlice";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
