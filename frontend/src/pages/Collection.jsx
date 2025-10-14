import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, unitsSoldData = {} } = useContext(ShopContext); // Add default value
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState(products || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  useEffect(() => {
    applyFilter();
    setCurrentPage(1);
  }, [category, subCategory, search, products]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  const applyFilter = () => {
    let productsCopy = (products || []).slice(); // Add safety check

    if (search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProducts = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filterProducts.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Show limited page numbers with ellipsis for many pages
  const getDisplayedPageNumbers = () => {
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      return pageNumbers;
    }

    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    let pages = [];
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60 mt-7">
        <button
          className="my-2 text-xl text-gray-700 flex items-center cursor-pointer gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => setShowFilter(!showFilter)}
          aria-expanded={showFilter}
          aria-controls="filter-section"
        >
          <u>
            <b>FILTERS</b>
          </u>
          <img
            className={`h-5 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
            aria-hidden="true"
          />
        </button>

        {/* Category Filter */}
        <div
          id="filter-section"
          className={`border bg-gray-100 border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div
            className="flex flex-col gap-2 text-sm font-light text-gray-700"
            role="group"
            aria-label="Category filters"
          >
            <label className="flex gap-2 cursor-pointer">
              <input
                className="w-3"
                type="checkbox"
                value="men"
                onChange={toggleCategory}
                aria-label="Men's clothing"
              />
              Men
            </label>
            <label className="flex gap-2 cursor-pointer">
              <input
                className="w-3"
                type="checkbox"
                value="women"
                onChange={toggleCategory}
                aria-label="Women's clothing"
              />
              Women
            </label>
            <label className="flex gap-2 cursor-pointer">
              <input
                className="w-3"
                type="checkbox"
                value="kids"
                onChange={toggleCategory}
                aria-label="Kids clothing"
              />
              Kids
            </label>
            <label className="flex gap-2 cursor-pointer">
              <input
                className="w-3"
                type="checkbox"
                value="boys"
                onChange={toggleCategory}
                aria-label="Boys clothing"
              />
              Boys
            </label>
            <label className="flex gap-2 cursor-pointer">
              <input
                className="w-3"
                type="checkbox"
                value="girls"
                onChange={toggleCategory}
                aria-label="Girls clothing"
              />
              Girls
            </label>
          </div>
        </div>

        {/* SubCategory Filter */}
        <div
          className={`bg-gray-100 border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div
            className="flex flex-col gap-2 text-sm font-light text-gray-700"
            role="group"
            aria-label="Type filters"
          >
            <label className="flex gap-2 cursor-pointer">
              <input
                className="w-3"
                type="checkbox"
                value="topwear"
                onChange={toggleSubCategory}
                aria-label="Topwear"
              />
              Topwear
            </label>
            <label className="flex gap-2 cursor-pointer">
              <input
                className="w-3"
                type="checkbox"
                value="bottomwear"
                onChange={toggleSubCategory}
                aria-label="Bottomwear"
              />
              Bottomwear
            </label>
            <label className="flex gap-2 cursor-pointer">
              <input
                className="w-3"
                type="checkbox"
                value="footwear"
                onChange={toggleSubCategory}
                aria-label="Footwear"
              />
              Footwear
            </label>
            <label className="flex gap-2 cursor-pointer">
              <input
                className="w-3"
                type="checkbox"
                value="dresses"
                onChange={toggleSubCategory}
                aria-label="Dresses"
              />
              Dresses
            </label>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2x1 mb-4">
          <Title text1={"ALL"} text2={"COLLECTION"} />

          {/* Product Sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 bg-gray-100 border-gray-300 text-sm px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Sort products by"
          >
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-600" aria-live="polite">
          Showing {indexOfFirstItem + 1}-
          {Math.min(indexOfLastItem, filterProducts.length)} of{" "}
          {filterProducts.length} products
        </div>

        {/* Map Products */}
        <div
          className="mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6"
          role="list"
          aria-label="Product collection"
        >
          {currentItems.map((item, index) => (
            <ProductItem
              key={item._id || index} // Add fallback key
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
              bestseller={item.bestseller}
              unitsSold={unitsSoldData[item._id]} // Now safe since unitsSoldData has default value
            />
          ))}
        </div>

        {/* No results message */}
        {currentItems.length === 0 && (
          <div className="text-center py-12 text-gray-500" role="status">
            <p className="text-lg mb-2">No products found</p>
            <p className="text-sm">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 mb-12">
            <nav
              className="flex items-center space-x-2"
              aria-label="Pagination"
            >
              {/* Previous button */}
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Previous page"
              >
                &laquo; Prev
              </button>

              {/* Page numbers */}
              {getDisplayedPageNumbers().map((pageNumber, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof pageNumber === "number" ? paginate(pageNumber) : null
                  }
                  className={`px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    pageNumber === currentPage
                      ? "bg-blue-600 text-white"
                      : pageNumber === "..."
                      ? "text-gray-500 cursor-default"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  disabled={pageNumber === "..."}
                  aria-label={
                    pageNumber === "..." ? "More pages" : `Page ${pageNumber}`
                  }
                  aria-current={pageNumber === currentPage ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              ))}

              {/* Next button */}
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Next page"
              >
                Next &raquo;
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Collection);
