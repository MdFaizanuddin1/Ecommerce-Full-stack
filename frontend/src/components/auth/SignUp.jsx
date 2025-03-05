import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/userSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
    referralCode: "", // ✅ Added optional referralCode field
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { referralCode, ...data } = formData;
    
    // ✅ Send referralCode only if provided
    const payload = referralCode ? { ...data, referralCode } : data;
    
    dispatch(register(payload)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        localStorage.setItem("accessToken", result.payload.data.accessToken);
        localStorage.setItem("refreshToken", result.payload.data.refreshToken);
        navigate("/");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-semibold text-center text-green-600">
          Signup
        </h2>
        <input
          type="text"
          name="userName"
          placeholder="Username"
          className="w-full p-2 mt-4 border rounded-md"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 mt-4 border rounded-md"
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="w-full p-2 mt-4 border rounded-md"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mt-4 border rounded-md"
          onChange={handleChange}
        />
        <input
          type="text"
          name="referralCode"
          placeholder="Referral Code (Optional)"
          className="w-full p-2 mt-4 border rounded-md"
          onChange={handleChange}
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          type="submit"
          className="w-full p-2 mt-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
