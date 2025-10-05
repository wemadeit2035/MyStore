import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    token,
    backendUrl,
    fetchUserProfile: fetchContextUserProfile,
  } = useContext(ShopContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setUserData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Status configuration with consistent color scheme (matching your Orders page)
  const statusConfig = {
    "Order Placed": {
      label: "Order Placed",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      progressColor: "bg-blue-500",
      description: "Your order has been received and is being processed",
    },
    Packing: {
      label: "Packing",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      progressColor: "bg-purple-500",
      description: "Your items are being prepared for shipment",
    },
    Shipped: {
      label: "Shipped",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      progressColor: "bg-yellow-500",
      description: "Your order is on the way",
    },
    "Out for Delivery": {
      label: "Out for Delivery",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      progressColor: "bg-orange-500",
      description: "Your order will be delivered today",
    },
    Delivered: {
      label: "Delivered",
      color: "text-green-600",
      bgColor: "bg-green-100",
      progressColor: "bg-green-500",
      description: "Your order has been delivered",
    },
    Cancelled: {
      label: "Cancelled",
      color: "text-red-600",
      bgColor: "bg-red-100",
      progressColor: "bg-red-500",
      description: "Your order has been cancelled",
    },
  };

  // Order tracking steps
  const orderSteps = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  useEffect(() => {
    if (activeTab === "orders") {
      fetchUserOrders();
    }
  }, [activeTab]);

  const fetchUserProfile = async () => {
    try {
      if (!token) {
        setMessage("No authentication token found. Please log in again.");
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          token: token,
        },
      });

      if (response.data.success) {
        setUserData(response.data.user);
      } else {
        setMessage("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response?.status === 401) {
        setMessage("Session expired. Please log in again.");
      } else {
        setMessage("Error loading profile data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // In UserProfile.js - update the handleProfileSubmit function
const handleProfileSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await axios.put(
      `${backendUrl}/api/user/profile`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          token: token,
        },
      }
    );

    if (response.data.success) {
      setUserData(response.data.user);
      setIsEditing(false);
      setMessage("Profile updated successfully!");
      
      // Important: Update the context with the new user data including profileCompleted
      if (fetchContextUserProfile) {
        await fetchContextUserProfile(); // This should update the global userProfile state
      }
    } else {
      setMessage(response.data.message || "Failed to update profile");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    setMessage(error.response?.data?.message || "Error updating profile");
  } finally {
    setIsLoading(false);
    setTimeout(() => setMessage(""), 4000);
  }
};

  // Add this function to fetch user orders
  const fetchUserOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            token: token,
          },
        }
      );

      if (response.data.success) {
        setUserOrders(response.data.orders);
      } else {
        setMessage("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
      setMessage("Error loading orders data");
    } finally {
      setOrdersLoading(false);
    }
  };

  // Helper functions for orders
  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (timestamp) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(timestamp).toLocaleDateString(undefined, options);
  };

  const getOrderTotal = (order) => {
    return order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Get the current step index for progress tracking
  const getCurrentStepIndex = (status) => {
    return orderSteps.findIndex((step) => step === status);
  };

  // Simple SVG icons as React components
  const ChevronDown = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  const ChevronUp = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  );

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords do not match");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put(
        `${backendUrl}/api/user/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            token: token,
          },
        }
      );

      if (response.data.success) {
        setMessage("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage(response.data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage(error.response?.data?.message || "Error changing password");
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (deleteConfirmation.toLowerCase() !== "delete my account") {
      setMessage("Please type 'delete my account' to confirm deletion");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (
      !window.confirm(
        "Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted."
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await axios.delete(`${backendUrl}/api/user/account`, {
        headers: {
          Authorization: `Bearer ${token}`,
          token: token,
        },
      });

      if (response.data.success) {
        setMessage(
          "Account deleted successfully. You will be logged out shortly."
        );
        setTimeout(() => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userProfile");
          window.location.href = "/";
        }, 2000);
      } else {
        setMessage(response.data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setMessage(error.response?.data?.message || "Error deleting account");
    } finally {
      setIsDeleting(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  if (isLoading && !userData.name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-blue-100 text-gray-900 mb-2">
            {userData.name || "User"}
          </h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              message.includes("success") || message.includes("Success")
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-6 text-center cursor-pointer font-semibold transition-all duration-200 ${
                activeTab === "profile"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile
              </div>
            </button>

            <button
              className={`flex-1 py-4 px-6 text-center cursor-pointer font-semibold transition-all duration-200 ${
                activeTab === "orders"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Orders
              </div>
            </button>

            <button
              className={`flex-1 py-4 px-6 text-center cursor-pointer font-semibold transition-all duration-200 ${
                activeTab === "password"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("password")}
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                Security
              </div>
            </button>

            <button
              className={`flex-1 py-4 px-6 text-center cursor-pointer font-semibold transition-all duration-200 ${
                activeTab === "delete"
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("delete")}
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Account
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                {!isEditing ? (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Personal Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-6 rounded-xl">
                          <h3 className="font-semibold text-gray-800 mb-4">
                            Basic Details
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm text-gray-600">
                                Full Name
                              </span>
                              <p className="text-gray-900 font-medium">
                                {userData.name}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">
                                Email Address
                              </span>
                              <p className="text-gray-900 font-medium">
                                {userData.email}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">
                                Phone Number
                              </span>
                              <p className="text-gray-900 font-medium">
                                {userData.phone || "Not provided"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl">
                          <h3 className="font-semibold text-gray-800 mb-4">
                            Delivery Address
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm text-gray-600">
                                Street
                              </span>
                              <p className="text-gray-900 font-medium">
                                {userData.address.street || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">
                                City
                              </span>
                              <p className="text-gray-900 font-medium">
                                {userData.address.city || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">
                                Province
                              </span>
                              <p className="text-gray-900 font-medium">
                                {userData.address.province || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">
                                Postal Code
                              </span>
                              <p className="text-gray-900 font-medium">
                                {userData.address.postalCode || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">
                                Country
                              </span>
                              <p className="text-gray-900 font-medium">
                                {userData.address.country || "Not provided"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Edit Profile
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleProfileSubmit} className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Edit Profile
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-800">
                          Personal Information
                        </h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={userData.email}
                            disabled
                            className="w-full px-4 py-3 bg-gray-100 text-gray-600 rounded-xl cursor-not-allowed"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Email cannot be changed
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-800">
                          Delivery Address
                        </h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address
                          </label>
                          <input
                            type="text"
                            name="address.street"
                            value={userData.address.street}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              name="address.city"
                              value={userData.address.city}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Province
                            </label>
                            <input
                              type="text"
                              name="address.province"
                              value={userData.address.province}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              name="address.postalCode"
                              value={userData.address.postalCode}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country
                            </label>
                            <input
                              type="text"
                              name="address.country"
                              value={userData.address.country}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50"
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* NEW ORDERS TAB CONTENT */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  My Orders
                </h2>

                {ordersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <p className="text-gray-600">
                      You haven't placed any orders yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userOrders.map((order) => {
                      const currentStepIndex = getCurrentStepIndex(
                        order.status
                      );
                      const currentStatusConfig =
                        statusConfig[order.status] ||
                        statusConfig["Order Placed"];

                      return (
                        <div
                          key={order._id}
                          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                        >
                          {/* Order Header */}
                          <div
                            className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleOrderExpand(order._id)}
                          >
                            <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
                              {/* Left side - Order info */}
                              <div className="text-center md:text-left">
                                <div className="flex items-center justify-center gap-2 mb-1 md:justify-start">
                                  <span className="text-xs text-gray-500">
                                    Order #
                                  </span>
                                  <span className="font-medium text-sm">
                                    {order._id.slice(-8).toUpperCase()}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  Placed on {formatDate(order.date)}
                                </div>
                              </div>

                              {/* Centered status badge */}
                              <div
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${currentStatusConfig.bgColor}`}
                              >
                                <span
                                  className={`text-xs font-medium ${currentStatusConfig.color}`}
                                >
                                  {currentStatusConfig.label}
                                </span>
                              </div>

                              {/* Right side - Total and expand button */}
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className="text-xs text-gray-500">
                                    Total
                                  </div>
                                  <div className="font-medium">
                                    R{order.amount.toFixed(2)}
                                  </div>
                                </div>

                                <button className="text-gray-500 hover:text-gray-700">
                                  {expandedOrder === order._id ? (
                                    <ChevronUp />
                                  ) : (
                                    <ChevronDown />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Order Details (Collapsible) */}
                          {expandedOrder === order._id && (
                            <div className="p-4 bg-gray-50">
                              {/* Order Tracking Progress */}
                              <div className="mb-6">
                                <h4 className="font-medium text-gray-700 text-sm mb-3">
                                  Order Tracking
                                </h4>
                                <div className="bg-white p-3 rounded border border-gray-200">
                                  <div className="flex justify-between mb-3">
                                    {orderSteps.map((step, index) => {
                                      const stepConfig =
                                        statusConfig[step] ||
                                        statusConfig["Order Placed"];
                                      const isCompleted =
                                        index <= currentStepIndex;
                                      const isCurrent =
                                        index === currentStepIndex;

                                      return (
                                        <div
                                          key={step}
                                          className="flex flex-col items-center w-1/5"
                                        >
                                          <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                              isCompleted
                                                ? `${stepConfig.progressColor} text-white`
                                                : "bg-gray-200 text-gray-500"
                                            } ${
                                              isCurrent
                                                ? "ring-2 ring-offset-1 ring-blue-300"
                                                : ""
                                            }`}
                                          >
                                            {index + 1}
                                          </div>
                                          <div
                                            className={`text-xs mt-1 text-center ${
                                              isCompleted
                                                ? "font-medium text-gray-800"
                                                : "text-gray-600"
                                            }`}
                                          >
                                            {step}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  <div className="relative h-1 bg-gray-200 rounded-full mb-3">
                                    <div
                                      className={`absolute top-0 left-0 h-full rounded-full ${currentStatusConfig.progressColor}`}
                                      style={{
                                        width: `${
                                          (currentStepIndex /
                                            (orderSteps.length - 1)) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>

                                  <div className="mt-3 text-xs text-gray-600">
                                    <p className="font-medium">
                                      Current Status:{" "}
                                      {currentStatusConfig.label}
                                    </p>
                                    <p className="mt-1">
                                      {currentStatusConfig.description}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h4 className="font-medium text-gray-700 text-sm mb-2">
                                    Delivery Address
                                  </h4>
                                  <div className="bg-white p-3 rounded border border-gray-200 text-xs">
                                    <p className="font-medium">
                                      {order.address?.name}
                                    </p>
                                    <p className="text-gray-600 mt-1">
                                      {order.address?.street}
                                    </p>
                                    <p className="text-gray-600">
                                      {order.address?.city},{" "}
                                      {order.address?.postalCode}
                                    </p>
                                    <p className="text-gray-600">
                                      {order.address?.country}
                                    </p>
                                    <p className="text-gray-600 mt-1">
                                      Phone: {order.address?.phone}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium text-gray-700 text-sm mb-2">
                                    Payment Information
                                  </h4>
                                  <div className="bg-white p-3 rounded border border-gray-200 text-xs">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-gray-600">
                                        Method:
                                      </span>
                                      <span className="font-medium capitalize">
                                        {order.paymentMethod}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">
                                        Status:
                                      </span>
                                      <span
                                        className={`font-medium ${
                                          order.payment
                                            ? "text-green-600"
                                            : "text-yellow-600"
                                        }`}
                                      >
                                        {order.payment ? "Paid" : "Pending"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                      <span className="text-gray-600">
                                        Amount:
                                      </span>
                                      <span className="font-medium">
                                        R{order.amount?.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <h4 className="font-medium text-gray-700 text-sm mb-3">
                                Order Items
                              </h4>
                              <div className="space-y-3">
                                {order.items.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-white rounded border border-gray-200"
                                  >
                                    {item.image && item.image[0] && (
                                      <img
                                        src={item.image[0]}
                                        alt={item.name}
                                        className="w-12 h-12 object-cover rounded"
                                      />
                                    )}

                                    <div className="flex-grow">
                                      <h5 className="font-medium text-gray-900 text-sm">
                                        {item.name}
                                      </h5>
                                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-600">
                                        {item.size && (
                                          <span>Size: {item.size}</span>
                                        )}
                                        <span>Qty: {item.quantity}</span>
                                        <span>Price: R{item.price}</span>
                                      </div>
                                    </div>

                                    <div className="text-right">
                                      <div className="font-medium text-gray-900 text-sm">
                                        R
                                        {(item.price * item.quantity).toFixed(
                                          2
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                                <div className="text-right space-y-1 text-sm">
                                  <div className="flex items-center gap-3">
                                    <span className="text-gray-600">
                                      Subtotal:
                                    </span>
                                    <span className="font-medium">
                                      R{getOrderTotal(order).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-gray-600">
                                      Shipping:
                                    </span>
                                    <span className="font-medium">R50.00</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-gray-800 font-medium">
                                      Total:
                                    </span>
                                    <span className="font-bold text-green-600">
                                      R{(getOrderTotal(order) + 50).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="w-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Change Password
                </h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password *
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="8"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? "Changing..." : "Change Password"}
                  </button>
                </form>
              </div>
            )}

            {/* Delete Account Tab */}
            {activeTab === "delete" && (
              <div className="w-full">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-10 h-10 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-red-800 mb-2">
                      Delete Your Account
                    </h2>
                    <p className="text-red-600">
                      This action is permanent and cannot be undone.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-red-200 mb-6">
                    <h3 className="font-semibold text-red-800 mb-4">
                      What happens when you delete your account:
                    </h3>
                    <ul className="list-disc list-inside text-red-700 space-y-2 text-sm">
                      <li>
                        Your profile information will be permanently deleted
                      </li>
                      <li>Your order history will be removed</li>
                      <li>Your cart data will be erased</li>
                      <li>You will be logged out immediately</li>
                      <li>This action cannot be reversed</li>
                    </ul>
                  </div>

                  <form onSubmit={handleDeleteAccount} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-2">
                        To confirm, type "delete my account" below:
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="delete my account"
                        className="w-full px-4 py-3 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={
                        isDeleting ||
                        deleteConfirmation.toLowerCase() !== "delete my account"
                      }
                      className="w-full bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-all duration-200 disabled:bg-red-400 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Deleting Account...
                        </span>
                      ) : (
                        "Permanently Delete My Account"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
