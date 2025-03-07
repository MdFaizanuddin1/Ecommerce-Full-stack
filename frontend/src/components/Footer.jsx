import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1E4636] text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section: Company Info */}
        <div>
          <h2 className="text-2xl font-bold text-[#13AA52]">MyCompany</h2>
          <p className="mt-3 text-gray-300">
            Elevating your shopping experience with quality and trust.
          </p>
          <p className="mt-2 text-gray-400">
            © {new Date().getFullYear()} MyCompany. All rights reserved.
          </p>
        </div>

        {/* Center Section: Quick Links */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-semibold text-[#13AA52]">Quick Links</h3>
          <NavLink to="/" className="hover:text-[#13AA52] transition-all">
            Home
          </NavLink>
          <NavLink to="/" className="hover:text-[#13AA52] transition-all">
            About Us
          </NavLink>
          <NavLink to="/" className="hover:text-[#13AA52] transition-all">
            Contact
          </NavLink>
          <NavLink to="/" className="hover:text-[#13AA52] transition-all">
            Privacy Policy
          </NavLink>
          <NavLink to="/" className="hover:text-[#13AA52] transition-all">
            Terms & Conditions
          </NavLink>
        </div>

        {/* Right Section: Social Media & Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-[#13AA52]">Follow Us</h3>
          <div className="flex space-x-4 mt-3">
            <a
              href="https://facebook.com"
              target="_blank"
              className="hover:text-[#13AA52] transition-all"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              className="hover:text-[#13AA52] transition-all"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://github.com/mdfaizanuddin1"
              target="_blank"
              className="hover:text-[#13AA52] transition-all"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://linkedin.com/in/mdfaizanuddin"
              target="_blank"
              className="hover:text-[#13AA52] transition-all"
            >
              <FaLinkedin size={24} />
            </a>
          </div>

          {/* Newsletter Subscription */}
          <h3 className="text-lg font-semibold text-[#13AA52] mt-6">
            Stay Updated
          </h3>
          <div className="flex mt-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 w-full rounded-l-md border-none focus:ring-2 focus:ring-[#13AA52] text-gray-400 outline"
            />
            <button className="px-4 py-2 bg-[#13AA52] text-white rounded-r-md hover:bg-[#0e7a3b] transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
