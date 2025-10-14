import React, { createContext, useEffect, useState } from "react";
import EmailVerificationPopup from "../components/EmailVerificationPopup";
import ProfileReminderPopup from "../components/ProfileReminderPopup";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || "";
    } catch (error) {
      return "";
    }
  });
  const [userProfile, setUserProfile] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  // Popup states
  const [showProfileReminder, setShowProfileReminder] = useState(false);
  const [profileReminderDismissed, setProfileReminderDismissed] =
    useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  // ========== CART FUNCTIONS ==========

  // Get cart count - THE MISSING FUNCTION
  const getCartCount = () => {
    if (!cartItems || Object.keys(cartItems).length === 0) return 0;

    return Object.values(cartItems).reduce((total, itemSizes) => {
      return (
        total +
        Object.values(itemSizes).reduce((sum, quantity) => sum + quantity, 0)
      );
    }, 0);
  };

  // Get total cart amount
  const getTotalCartAmount = () => {
    if (!cartItems || Object.keys(cartItems).length === 0) return 0;

    return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
      const product = products.find((p) => p._id === itemId);
      if (!product) return total;

      const itemTotal = Object.entries(sizes).reduce(
        (itemSum, [size, quantity]) => {
          return itemSum + product.price * quantity;
        },
        0
      );

      return total + itemTotal;
    }, 0);
  };

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${backendUrl}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCartItems(data.cartData || {});
        }
      }
    } catch (error) {
      // Silent fail
    }
  };

  // SECURE: Add to cart
  const addToCart = async (itemId, size) => {
    if (!size) return;

    const newCartItems = { ...cartItems };

    if (newCartItems[itemId]) {
      newCartItems[itemId][size] = (newCartItems[itemId][size] || 0) + 1;
    } else {
      newCartItems[itemId] = { [size]: 1 };
    }

    setCartItems(newCartItems);

    // Sync with backend if authenticated
    if (token) {
      try {
        await fetch(`${backendUrl}/api/cart/add`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId, size }),
        });
      } catch (error) {
        // Silent fail
      }
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId, size) => {
    const newCartItems = { ...cartItems };

    if (newCartItems[itemId] && newCartItems[itemId][size]) {
      newCartItems[itemId][size] -= 1;

      if (newCartItems[itemId][size] <= 0) {
        delete newCartItems[itemId][size];
      }

      if (Object.keys(newCartItems[itemId]).length === 0) {
        delete newCartItems[itemId];
      }
    }

    setCartItems(newCartItems);

    // Sync with backend if authenticated
    if (token) {
      try {
        await fetch(`${backendUrl}/api/cart/remove`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId, size }),
        });
      } catch (error) {
        // Silent fail
      }
    }
  };

  // Update cart quantity
  const updateCartQuantity = async (itemId, size, quantity) => {
    const newCartItems = { ...cartItems };

    if (newCartItems[itemId]) {
      if (quantity <= 0) {
        delete newCartItems[itemId][size];
        if (Object.keys(newCartItems[itemId]).length === 0) {
          delete newCartItems[itemId];
        }
      } else {
        newCartItems[itemId][size] = quantity;
      }
    }

    setCartItems(newCartItems);

    // Sync with backend if authenticated
    if (token) {
      try {
        await fetch(`${backendUrl}/api/cart/update`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId, size, quantity }),
        });
      } catch (error) {
        // Silent fail
      }
    }
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems({});
  };

  // ========== PRODUCTS & AUTH FUNCTIONS ==========

  // SECURE: Products fetch
  const getProductsData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/product/list`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProducts(data.products || []);
        }
      }
    } catch (error) {
      setProducts([]);
    }
  };

  // SECURE: Login with popup triggers
  const login = async (email, password) => {
    try {
      if (!email || !password) {
        return { success: false, message: "Email and password required" };
      }

      const response = await fetch(`${backendUrl}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Login failed: ${response.status}`,
        };
      }

      const data = await response.json();

      if (data.success && data.accessToken) {
        try {
          localStorage.setItem("token", data.accessToken);
          setToken(data.accessToken);
          setUserProfile(data.user);

          // Fetch user's cart after login
          await fetchCart();

          // Check if profile needs completion
          checkProfileCompletion(data.user);

          return { success: true };
        } catch (storageError) {
          return { success: false, message: "Storage error" };
        }
      }

      return {
        success: false,
        message: data.message || "Login failed",
      };
    } catch (error) {
      return {
        success: false,
        message: "Network error",
      };
    }
  };

  // SECURE: Register with verification popup
  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${backendUrl}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || "Registration failed",
        };
      }

      const data = await response.json();

      if (data.success) {
        setToken(data.accessToken);
        setUserProfile(data.user);
        localStorage.setItem("token", data.accessToken);

        // Fetch user's cart after registration
        await fetchCart();

        // Show verification popup if email not verified
        if (!data.user.isVerified) {
          showVerificationPopup(email);
        }

        // Check profile completion
        checkProfileCompletion(data.user);

        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: "Registration failed",
      };
    }
  };

  // Profile completion check
  const checkProfileCompletion = (profile) => {
    if (!profile) return;

    const isProfileIncomplete =
      !profile.profileCompleted ||
      !profile.phone ||
      !profile.address ||
      !profile.address.street ||
      !profile.address.city;

    const hasBeenDismissed = localStorage.getItem("profileReminderDismissed");

    if (isProfileIncomplete && !hasBeenDismissed) {
      setShowProfileReminder(true);
    }
  };

  // Verification popup
  const showVerificationPopup = (email) => {
    setVerificationEmail(email);
    setShowEmailVerification(true);
  };

  // Resend verification email
  const resendVerificationEmail = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/user/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: verificationEmail }),
        }
      );

      if (response.ok) {
        // Success - you can show a toast or message here
        console.log("Verification email sent");
      }
    } catch (error) {
      // Silent error handling
    }
  };

  // Handle popup closures
  const handleCloseVerificationPopup = () => {
    setShowEmailVerification(false);
    setVerificationEmail("");
  };

  const handleCloseProfileReminder = () => {
    setShowProfileReminder(false);
    setProfileReminderDismissed(true);
    try {
      localStorage.setItem("profileReminderDismissed", "true");
    } catch (error) {
      // Silent fail
    }
  };

  const handleUpdateProfile = () => {
    setShowProfileReminder(false);
    setProfileReminderDismissed(true);
    try {
      localStorage.setItem("profileReminderDismissed", "true");
    } catch (error) {
      // Silent fail
    }
    // Redirect to profile page
    window.location.href = "/profile";
  };

  // SECURE: Logout with popup cleanup
  const logout = async () => {
    try {
      if (token) {
        await fetch(`${backendUrl}/api/user/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).catch(() => {});
      }
    } finally {
      setToken("");
      setUserProfile(null);
      setCartItems({});
      // Close all popups on logout
      setShowEmailVerification(false);
      setShowProfileReminder(false);

      try {
        localStorage.removeItem("token");
        localStorage.removeItem("profileReminderDismissed");
      } catch (storageError) {
        // Silent fail
      }
    }
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    if (!token) return null;

    try {
      const response = await fetch(`${backendUrl}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserProfile(data.user);
          checkProfileCompletion(data.user);
          return data.user;
        }
      }
    } catch (error) {
      // Token might be invalid
      if (error.message === "Authentication failed") {
        logout();
      }
    }
    return null;
  };

  useEffect(() => {
    getProductsData();

    // Fetch user profile and cart if token exists
    if (token) {
      fetchUserProfile();
      fetchCart();
    } else {
      // Clear cart when not authenticated
      setCartItems({});
    }
  }, [token]);

  const value = {
    // Authentication
    token,
    setToken,
    login,
    logout,
    register,
    userProfile,
    setUserProfile,
    fetchUserProfile,

    // Products & Cart
    products,
    getProductsData,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartCount,
    getTotalCartAmount,
    clearCart,
    fetchCart,

    // Search
    showSearch,
    setShowSearch,

    // Popup functions
    showVerificationPopup,
    handleCloseProfileReminder,
    handleUpdateProfile,

    // Popup states
    showProfileReminder,
    showEmailVerification,

    // Utilities
    currency: "R",
    delivery_fee: 50,
    backendUrl,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}

      {/* Popup Components */}
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
