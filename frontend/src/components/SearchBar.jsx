import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setVisible(true);
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    } else {
      setVisible(false);
    }
  }, [location]);

  return visible ? (
    <div
      className="bg-gray-50 text-center"
      role="search"
      aria-label="Product search"
    >
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          ref={searchInputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm"
          type="search"
          placeholder="Search products..."
          aria-label="Search products"
          enterKeyHint="search"
        />
        <img className="w-4" src={assets.search} alt="Search icon" />
      </div>
    </div>
  ) : null;
};

export default SearchBar;
