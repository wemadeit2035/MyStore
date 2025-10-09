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

  // Popup states
  const [showProfileReminder, setShowProfileReminder] = useState(false);
  const [profileReminderDismissed, setProfileReminderDismissed] =
    useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const navigate = useNavigate();

  // ========================
  // BROWSER DETECTION (Debugging Only)
  // ========================
  const detectBrowserIssue = () => {
    const ua = navigator.userAgent;
    const isChrome = ua.includes("Chrome") && !ua.includes("Firefox");
    const isSamsung = ua.includes("SamsungBrowser");

    if (isChrome || isSamsung) {
      console.log(
        "⚠️  Problematic browser detected:",
        isChrome ? "Chrome" : "Samsung Internet"
      );
      console.log("User Agent:", ua);
    }
  };

  // ========================
  // PRODUCTS FETCH (Single Endpoint)
  // ========================
  const getProductsData = async () => {
    try {
      console.log("🔄 Fetching products from single endpoint...");

      const url = `${backendUrl}/api/product/list`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "omit",
        mode: "cors",
      });

      console.log("📡 Response status:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Products data received");

      if (data.success && data.products) {
        setProducts(data.products);
        console.log(`🎉 Loaded ${data.products.length} products`);
      } else {
        console.log("❌ No products in response");
        setProducts([]);
      }
    } catch (error) {
      console.error("💥 Fetch failed:", error.message);

      // Fallback attempt
      try {
        console.log("🔄 Trying minimal fallback...");
        const fallbackResponse = await fetch(url);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (fallbackData.success) {
            setProducts(fallbackData.products || []);
            console.log("✅ Fallback successful");
            return;
          }
        }
      } catch (fallbackError) {
        console.log("❌ Fallback also failed");
      }

      setProducts([]);
    }
  };

  // ========================
  // INITIALIZATION
  // ========================
  useEffect(() => {
    detectBrowserIssue(); // 👈 This calls the browser detection
    getProductsData();
  }, []);

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

    // Fetch user profile if token exists
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const value = {
    // Authentication
    token,
    login,
    logout,
    register,
    userProfile,
    fetchUserProfile,

    // Products & Cart
    products,
    getProductsData,
    cartItems,
    addToCart,

    // Popup functions
    showVerificationPopup,
    handleCloseProfileReminder,
    handleUpdateProfile,

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
