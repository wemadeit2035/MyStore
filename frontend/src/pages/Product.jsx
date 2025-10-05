import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, isLoggedIn, getProductsData } =
    useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  // Ensure products are loaded
  useEffect(() => {
    if (!products || products.length === 0) {
      getProductsData();
    }
  }, [products, getProductsData]);

  const fetchProductData = async () => {
    if (products && products.length > 0) {
      const foundProduct = products.find((item) => item._id === productId);
      if (foundProduct) {
        setProductData(foundProduct);
        setImage(
          Array.isArray(foundProduct.image)
            ? foundProduct.image[0]
            : foundProduct.image
        );
      }
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  // Enhanced add to cart handler with authentication check
  const handleAddToCart = () => {
    if (!size) return;

    if (!isLoggedIn) {
      setShowLoginPrompt(true);

      const pendingCartItem = {
        productId: productData._id,
        size: size,
        redirectUrl: window.location.pathname,
      };
      localStorage.setItem("pendingCartItem", JSON.stringify(pendingCartItem));

      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    addToCart(productData._id, size);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  // Structured data for product page SEO
  const productStructuredData = productData
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: productData.name,
        description: productData.description,
        image: Array.isArray(productData.image)
          ? productData.image
          : [productData.image],
        offers: {
          "@type": "Offer",
          price: productData.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        brand: {
          "@type": "Brand",
          name: "Fashion Store",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.0",
          reviewCount: "122",
        },
      }
    : null;

  return productData ? (
    <div className="pt-10 transition-opacity ease-in duration-500 opacity-100 relative">
      {/* Structured data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify(productStructuredData)}
      </script>

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-all animate-fadeInOut">
          Added to cart!
        </div>
      )}

      {/* Login Prompt Notification */}
      {showLoginPrompt && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-all animate-fadeInOut">
          Please login to add items to cart. Redirecting to login...
        </div>
      )}

      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-4 sm:flex-row">
          {/* Thumbnails Column */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-[120px] pb-2 sm:pb-0">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className={`w-1/4 sm:w-full aspect-square object-cover cursor-pointer border-2 transition-all
                  ${
                    image === item
                      ? "border-black"
                      : "border-transparent hover:border-gray-300"
                  }`}
                alt={`${productData.name} - View ${index + 1}`}
                loading="eager"
                width="120"
                height="120"
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full sm:w-[calc(100%-136px)]">
            <img
              className="w-full h-full object-cover aspect-square"
              src={image}
              alt={productData.name}
              width="600"
              height="600"
              loading="eager"
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex item-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.stardull_icon} alt="" className="w-3 5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium text-green-600">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:4/5">{productData.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 transition-all ${
                    item === size
                      ? "border-blue-500 text-blue-500 bg-blue-100"
                      : "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!size}
            className={`bg-black text-white px-8 py-3 text-sm ${
              !size ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product.</p>
            <p>Cash on delivery is available for this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Display related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
        currentProductId={productData._id}
      />
    </div>
  ) : (
    <div className="opacity-0">Loading...</div>
  );
};

export default Product;
