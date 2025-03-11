import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, logout } from "../../redux/userSlice";
import axios from "axios";
import { BASE_URL } from "../../routes/routes";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, LogOut, LayoutDashboard, Package } from "lucide-react";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.auth);
  const [referredUsers, setReferredUsers] = useState([]);
  const [loadingReferred, setLoadingReferred] = useState(true);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    const fetchReferredUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${BASE_URL}/users/getReferred`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        setReferredUsers(response.data.referredUsers || []);
      } catch (error) {
        console.error("Error fetching referred users:", error);
      } finally {
        setLoadingReferred(false);
      }
    };

    fetchReferredUsers();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  if (!currentUser?.data) {
    return <div className="text-center mt-4">No user data found</div>;
  }

  const { userName, email, phone, referralCode, createdAt } = currentUser.data;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6">
        {/* Profile Header */}
        <h2 className="text-3xl font-bold text-center text-gray-800">
          User Profile
        </h2>
        <div className="mt-6 space-y-4 text-lg text-gray-700">
          <p>
            <strong>Username:</strong> {userName}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Phone:</strong> {phone}
          </p>
          <p>
            <strong>Referral Code:</strong> {referralCode}
          </p>
          <p>
            <strong>Joined On:</strong>{" "}
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Referred Users Section */}
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Referred Users
        </h2>
        {loadingReferred ? (
          <p className="text-center text-gray-600 mt-4">
            Loading referred users...
          </p>
        ) : referredUsers.length === 0 ? (
          <p className="text-center text-gray-600 mt-4">
            No referred users yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {referredUsers.map((refUser, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                <p className="text-lg font-semibold text-gray-800">
                  Name:{" "}
                  <span className="font-normal">
                    {refUser.refrredUserDetails.userName}
                  </span>
                </p>
                <p className="text-gray-600">
                  Email:{" "}
                  <span className="text-black">
                    {refUser.refrredUserDetails.email}
                  </span>
                </p>
                <p className="text-sm text-gray-500 italic">
                  Date:{" "}
                  {new Date(
                    refUser.refrredUserDetails.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons Section */}
      <div className="flex gap-6 mt-6">
        {currentUser?.data?.role === "admin" && (
          <button
            className="p-4 bg-white rounded-full shadow-lg hover:scale-110 transition-transform relative group"
            onClick={() => navigate("/admin-dashboard")}
          >
            <LayoutDashboard size={28} className="text-blue-500" />
            <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Dashboard
            </span>
          </button>
        )}
        <button
          className="p-4 bg-white rounded-full shadow-lg hover:scale-110 transition-transform relative group"
          onClick={() => navigate("/wish")}
        >
          <Heart size={28} className="text-blue-500" />
          <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Wishlist
          </span>
        </button>
        <button
          className="p-4 bg-white rounded-full shadow-lg hover:scale-110 transition-transform relative group"
          onClick={() => navigate("/cart")}
        >
          <ShoppingCart size={28} className="text-green-500" />
          <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Cart
          </span>
        </button>

        <button
          className="p-4 bg-white rounded-full shadow-lg hover:scale-110 transition-transform relative group"
          onClick={()=> navigate ('/order-details')} // Replace with your function
        >
          <Package size={28} className="text-blue-500" />
          <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Orders
          </span>
        </button>

        <button
          className="p-4 bg-white rounded-full shadow-lg hover:scale-110 transition-transform relative group"
          onClick={handleLogout}
        >
          <LogOut size={28} className="text-red-500" />
          <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
