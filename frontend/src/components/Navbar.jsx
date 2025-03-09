// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../redux/userSlice";
// import { Heart, ShoppingCart } from "lucide-react";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const user = useSelector((state) => state.auth.currentUser);
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   return (
//     <nav className="bg-[#1E4636] shadow-md fixed w-full z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           {/* Logo */}
//           <NavLink to="/" className="text-2xl font-bold text-[#13AA52]">
//             <img src="/logo/logo.jpeg" alt="Logo" className="h-10 w-auto" />
//           </NavLink>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex space-x-8 items-center">
//             {user && (
//               <NavLink
//                 to={`/cart`}
//                 className="relative text-white hover:text-[#13AA52] transition-all duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#13AA52] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
//               >
//                 <ShoppingCart size={24} />
//               </NavLink>
//             )}
//             {user && (
//               <NavLink
//                 to={`/wish`}
//                 className="relative text-white hover:text-[#13AA52] transition-all duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#13AA52] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
//               >
//                 <Heart size={24} />
//               </NavLink>
//             )}
//             {["Men", "Women", "Bestseller"].map((item) => (
//               <NavLink
//                 key={item}
//                 to={`/products/${item.toLowerCase()}`}
//                 className="relative text-white hover:text-[#13AA52] transition-all duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#13AA52] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
//               >
//                 {item}
//               </NavLink>
//             ))}

//             {/* Login / Logout Button */}
//             {user ? (
//               <button
//                 onClick={handleLogout}
//                 className="px-5 py-2 rounded-md border border-[#13AA52] text-[#13AA52] hover:bg-[#13AA52] hover:text-white transition-all duration-300 hover:rounded-full shadow-md"
//               >
//                 Logout
//               </button>
//             ) : (
//               <NavLink
//                 to="/login"
//                 className="px-5 py-2 rounded-md border border-[#13AA52] text-[#13AA52] hover:bg-[#13AA52] hover:text-white transition-all duration-300 hover:rounded-full shadow-md"
//               >
//                 Login
//               </NavLink>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="text-white text-3xl focus:outline-none transition-transform transform hover:scale-110"
//             >
//               ☰
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div
//         className={`${
//           isOpen ? "block" : "hidden"
//         } md:hidden bg-[#1E4636] p-4 space-y-3 transition-all duration-300`}
//       >
//         {user && (
//           <NavLink
//             to={`/cart`}
//             className="block text-white hover:text-[#13AA52] transition-all duration-300"
//             onClick={() => setIsOpen(false)}
//           >
//             <ShoppingCart size={24} />
//           </NavLink>
//         )}
//         {user && (
//           <NavLink
//             to={`/wish`}
//             className="block text-white hover:text-[#13AA52] transition-all duration-300"
//             onClick={() => setIsOpen(false)}
//           >
//             <Heart size={24} />
//           </NavLink>
//         )}
//         {["Men", "Women", "Bestseller"].map((item) => (
//           <NavLink
//             key={item}
//             to={`/products/${item.toLowerCase()}`}
//             className="block text-white hover:text-[#13AA52] transition-all duration-300"
//             onClick={() => setIsOpen(false)}
//           >
//             {item}
//           </NavLink>
//         ))}

//         {user ? (
//           <button
//             onClick={() => {
//               handleLogout();
//               setIsOpen(false);
//             }}
//             className="block w-full text-center px-5 py-2 rounded-md border border-[#13AA52] text-[#13AA52] hover:bg-[#13AA52] hover:text-white transition-all duration-300 hover:rounded-full shadow-md"
//           >
//             Logout
//           </button>
//         ) : (
//           <NavLink
//             to="/login"
//             className="block text-center px-5 py-2 rounded-md border border-[#13AA52] text-[#13AA52] hover:bg-[#13AA52] hover:text-white transition-all duration-300 hover:rounded-full shadow-md"
//             onClick={() => setIsOpen(false)}
//           >
//             Login
//           </NavLink>
//         )}
//       </div>
//     </nav>
//   );
// }

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { Heart, ShoppingCart, User, Search, Menu } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?name=${searchQuery}`);
  };

  const handleSearchIconClick = () => {
    if (searchVisible && searchQuery.trim()) {
      handleSearch(new Event("submit")); // Simulate form submission
    } else {
      setSearchVisible(!searchVisible);
    }
  };

  return (
    <nav className="bg-[#1E4636] shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold text-[#13AA52]">
            <img src="/logo/logo.jpeg" alt="Logo" className="h-10 w-auto" />
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-4">
              {searchVisible && (
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-gray-300 outline p-2 rounded-lg"
                  />
                </form>
              )}
              <button
                className="p-2 text-white hover:text-[#13AA52]"
                onClick={handleSearchIconClick}
              >
                <Search size={24} />
              </button>
            </div>

            {user && (
              <NavLink
                to={`/cart`}
                className="relative text-white hover:text-[#13AA52] transition-all duration-300"
              >
                <ShoppingCart size={24} />
              </NavLink>
            )}
            {user && (
              <NavLink
                to={`/wish`}
                className="relative text-white hover:text-[#13AA52] transition-all duration-300"
              >
                <Heart size={24} />
              </NavLink>
            )}
            {user && (
              <NavLink
                to={`/profile`}
                className="relative text-white hover:text-[#13AA52] transition-all duration-300"
              >
                <User size={24} />
              </NavLink>
            )}
            {["Men", "Women", "Bestseller"].map((item) => (
              <NavLink
                key={item}
                to={`/products/${item.toLowerCase()}`}
                className="relative text-white hover:text-[#13AA52] transition-all duration-300"
              >
                {item}
              </NavLink>
            ))}

            {/* Login / Logout Button */}
            {user ? (
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-md border border-[#13AA52] text-[#13AA52] hover:bg-[#13AA52] hover:text-white transition-all duration-300 hover:rounded-full shadow-md"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className="px-5 py-2 rounded-md border border-[#13AA52] text-[#13AA52] hover:bg-[#13AA52] hover:text-white transition-all duration-300 hover:rounded-full shadow-md"
              >
                Login
              </NavLink>
            )}
          </div>

          {/* Mobile: Search Input, Search Icon, and Menu Icon in One Row */}
          <div className="md:hidden flex items-center gap-2">
            {/* Search Input (Before Icon) */}
            {searchVisible && (
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-1 rounded-md w-32 outline text-gray-300"
              />
            )}

            {/* Search Icon */}
            <button
              className="p-2 text-white hover:text-[#13AA52]"
              onClick={handleSearchIconClick}
            >
              <Search size={24} />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white text-3xl focus:outline-none transition-transform transform hover:scale-110"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-[#1E4636] p-4 space-y-3 transition-all duration-300`}
      >
        {user && (
          <NavLink
            to={`/cart`}
            className="block text-white hover:text-[#13AA52] transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            <ShoppingCart size={24} />
          </NavLink>
        )}
        {user && (
          <NavLink
            to={`/wish`}
            className="block text-white hover:text-[#13AA52] transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            <Heart size={24} />
          </NavLink>
        )}
        {user && (
          <NavLink
            to={`/profile`}
            className="block text-white hover:text-[#13AA52] transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            <User size={24} />
          </NavLink>
        )}
        {["Men", "Women", "Bestseller"].map((item) => (
          <NavLink
            key={item}
            to={`/products/${item.toLowerCase()}`}
            className="block text-white hover:text-[#13AA52] transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            {item}
          </NavLink>
        ))}

        {user ? (
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="block w-full text-center px-5 py-2 rounded-md border border-[#13AA52] text-[#13AA52] hover:bg-[#13AA52] hover:text-white transition-all duration-300 hover:rounded-full shadow-md"
          >
            Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            className="block text-center px-5 py-2 rounded-md border border-[#13AA52] text-[#13AA52] hover:bg-[#13AA52] hover:text-white transition-all duration-300 hover:rounded-full shadow-md"
            onClick={() => setIsOpen(false)}
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}
