import React, { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import EmailVerificationPopup from "../components/EmailVerificationPopup";
import ProfileReminderPopup from "../components/ProfileReminderPopup";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "R";
  const delivery_fee = 50;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const tokenRef = useRef(token);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileReminder, setShowProfileReminder] = useState(false);
  const [profileReminderDismissed, setProfileReminderDismissed] =
    useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [unitsSoldData, setUnitsSoldData] = useState({});

  const navigate = useNavigate();

  // MOBILE: Configure axios defaults for mobile
  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.timeout = 15000; // 15 second timeout for mobile

    // Add mobile headers to all requests
    axios.interceptors.request.use(
      (config) => {
        config.headers = config.headers || {};
        config.headers["X-Client-Type"] = "mobile-web";
        config.headers["Accept"] = "application/json";

        if (tokenRef.current) {
          config.headers["token"] = tokenRef.current;
          config.headers["Authorization"] = `Bearer ${tokenRef.current}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }, []);

  // MOBILE: Enhanced products fetch with error handling
  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: {
          "X-Client-Type": "mobile-web",
        },
        timeout: 10000,
      });

      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Mobile - Fetch products error:", error);

      // Mobile-friendly error handling
      if (
        error.code === "NETWORK_ERROR" ||
        error.message?.includes("Network Error")
      ) {
        console.log("Please check your internet connection");
      }
    }
  };

  // MOBILE: Enhanced login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/login`,
        { email, password },
        {
          headers: {
            "X-Client-Type": "mobile-web",
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      if (response.data.success) {
        setToken(response.data.accessToken);
        setUserProfile(response.data.user);
        localStorage.setItem("token", response.data.accessToken);

        // Fetch user cart after successful login
        await getUserCart(response.data.accessToken);

        return { success: true };
      }
    } catch (error) {
      console.error("Mobile - Login error:", error);

      // Mobile-specific error messages
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      } else if (error.code === "NETWORK_ERROR") {
        return {
          success: false,
          message: "Network error. Please check your connection.",
        };
      } else {
        return {
          success: false,
          message:
            error.response?.data?.message || "Login failed. Please try again.",
        };
      }
    }
  };

  const logout = () => {
    setToken("");
    setUserProfile(null);
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    googleLogout(); // If you use Google OAuth
    setCartItems({});
    navigate("/login");
  };

  // Function to refresh the token
  const refreshAuthToken = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/refresh`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const newToken = response.data.accessToken;
        setToken(newToken);
        return newToken;
      }
    } catch (error) {
      if (
        error.response?.status === 401 &&
        error.response?.data?.message === "Refresh token not provided"
      ) {
        throw error;
      }

      logout();
      throw error;
    }
  };

  // Add axios response interceptor for automatic token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          originalRequest._retry ||
          originalRequest.url.includes("/login") ||
          originalRequest.url.includes("/register") ||
          originalRequest.url.includes("/logout") ||
          originalRequest.url.includes("/refresh")
        ) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshAuthToken();
            if (originalRequest.headers) {
              originalRequest.headers["token"] = newToken;
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            }
            return axios(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  // Add axios request interceptor to include token in all requests
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (tokenRef.current) {
          config.headers = config.headers || {};
          config.headers["token"] = tokenRef.current;
          config.headers["Authorization"] = `Bearer ${tokenRef.current}`;
        }
        config.withCredentials = true;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  // Add to cart function
  const addToCart = async (itemId, size) => {
    if (!size) {
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    if (tokenRef.current) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          {
            headers: {
              token: tokenRef.current,
              Authorization: `Bearer ${tokenRef.current}`,
            },
            withCredentials: true,
          }
        );
      } catch (error) {
        // Silent error handling for production
      }
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    if (quantity <= 0) {
      if (cartData[itemId]?.[size]) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      if (!cartData[itemId]) {
        cartData[itemId] = {};
      }
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);

    if (tokenRef.current) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          {
            headers: {
              token: tokenRef.current,
              Authorization: `Bearer ${tokenRef.current}`,
            },
            withCredentials: true,
          }
        );
      } catch (error) {
        // Silent error handling for production
      }
    }
  };

  // Delete entire size variant from cart
  const deleteFromCart = async (productId, size) => {
    setCartItems((prev) => {
      const newItems = structuredClone(prev);
      if (newItems[productId]?.[size]) {
        delete newItems[productId][size];
        if (Object.keys(newItems[productId]).length === 0) {
          delete newItems[productId];
        }
      }
      return newItems;
    });

    if (tokenRef.current) {
      try {
        await axios.post(
          backendUrl + "/api/cart/remove",
          { itemId: productId, size },
          {
            headers: {
              token: tokenRef.current,
              Authorization: `Bearer ${tokenRef.current}`,
            },
            withCredentials: true,
          }
        );
      } catch (error) {
        // Silent error handling for production
      }
    }
  };

  // Remove from cart (decrement quantity)
  const removeFromCart = async (productId, size, quantity = 1) => {
    setCartItems((prev) => {
      const newItems = structuredClone(prev);
      if (newItems[productId]?.[size]) {
        newItems[productId][size] = Math.max(
          0,
          newItems[productId][size] - quantity
        );

        if (newItems[productId][size] === 0) {
          delete newItems[productId][size];
          if (Object.keys(newItems[productId]).length === 0) {
            delete newItems[productId];
          }
        }
      }
      return newItems;
    });

    if (tokenRef.current) {
      try {
        const newQuantity = cartItems[productId]?.[size] - quantity;
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId: productId, size, quantity: newQuantity },
          {
            headers: {
              token: tokenRef.current,
              Authorization: `Bearer ${tokenRef.current}`,
            },
            withCredentials: true,
          }
        );
      } catch (error) {
        // Silent error handling for production
      }
    }
  };

  // Get total cart count
  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      if (cartItems.hasOwnProperty(itemId)) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId].hasOwnProperty(size)) {
            totalCount += cartItems[itemId][size];
          }
        }
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        }
      }
    }
    return totalAmount;
  };

  const getUserCart = async (currentToken) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        {
          headers: {
            token: currentToken,
            Authorization: `Bearer ${currentToken}`,
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
        await fetchUserProfile();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  // Initialize token and user data on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await getUserCart(savedToken);
      }
    };

    getProductsData();
    initializeAuth();
  }, []);

  // Context value
  const value = {
    // Authentication & User
    isLoggedIn,
    setIsLoggedIn,
    token,
    setToken,
    userProfile,
    setUserProfile,
    fetchUserProfile,
    logout,
    register,
    login,
    handleGoogleLoginSuccess,

    // Products & Cart
    products,
    getProductsData,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    deleteFromCart,
    getCartCount,
    getCartAmount,

    // UI & Navigation
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    navigate,
    backendUrl,
    unitsSoldData,

    // Popup Triggers (only the functions needed by components)
    showVerificationPopup,
    handleCloseProfileReminder,
    handleUpdateProfile,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}

      {/* Render the popup when needed */}
      {showEmailVerification && (
        <EmailVerificationPopup
          email={verificationEmail}
          onClose={handleCloseVerificationPopup}
          onResend={resendVerificationEmail}
        />
      )}

      {showProfileReminder && userProfile && (
        <ProfileReminderPopup
          userProfile={userProfile}
          onClose={handleCloseProfileReminder}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
