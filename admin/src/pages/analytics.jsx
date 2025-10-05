// admin/src/pages/analytics.jsx
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { AdminContext } from "../context/AdminContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import axios from "axios";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Error Boundary Component
class AnalyticsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Error reporting service would go here in production
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              We're having trouble loading the analytics dashboard.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Skeleton Loader Component
const ChartSkeleton = ({ height = "h-80" }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${height}`}></div>
);

const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className="rounded-full p-3 bg-gray-200 animate-pulse w-12 h-12"></div>
      <div className="ml-4 space-y-2 flex-1">
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ onRetry }) => (
  <div className="text-center py-12">
    <svg
      className="w-24 h-24 text-gray-300 mx-auto mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No analytics data yet
    </h3>
    <p className="text-gray-500 mb-6">
      Start selling to see your analytics dashboard in action.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Refresh Data
      </button>
    )}
  </div>
);

// Main Analytics Component
const Analytics = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const { token, logout, backendUrl } = useContext(AdminContext);

  const fetchAnalytics = useCallback(async () => {
    if (!token) {
      setError("Authentication required. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${backendUrl}/api/analytics?timeRange=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAnalyticsData(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Your session has expired. Please login again.");
        logout();
      } else {
        setError("Failed to load analytics data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [token, timeRange, backendUrl, logout]);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const timeoutId = setTimeout(() => {
      if (isMounted) {
        fetchAnalytics();
      }
    }, 300);

    return () => {
      isMounted = false;
      abortController.abort();
      clearTimeout(timeoutId);
    };
  }, [fetchAnalytics]);

  // Memoized chart options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    }),
    []
  );

  // Memoized chart data calculations
  const salesChartData = useMemo(() => {
    if (!analyticsData?.salesData?.length) {
      return {
        labels: ["No data"],
        datasets: [
          {
            label: "Sales (R)",
            data: [0],
            backgroundColor: "rgba(239, 239, 239, 0.6)",
            borderColor: "rgba(239, 239, 239, 1)",
            borderWidth: 1,
          },
        ],
      };
    }

    return {
      labels: analyticsData.salesData.map((item) => item.name),
      datasets: [
        {
          label: "Sales (R)",
          data: analyticsData.salesData.map((item) => item.sales),
          backgroundColor: "rgba(136, 132, 216, 0.6)",
          borderColor: "rgba(136, 132, 216, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [analyticsData?.salesData]);

  const ordersChartData = useMemo(() => {
    if (!analyticsData?.salesData?.length) {
      return {
        labels: ["No data"],
        datasets: [
          {
            label: "Orders",
            data: [0],
            backgroundColor: "rgba(239, 239, 239, 0.6)",
            borderColor: "rgba(239, 239, 239, 1)",
            borderWidth: 1,
          },
        ],
      };
    }

    return {
      labels: analyticsData.salesData.map((item) => item.name),
      datasets: [
        {
          label: "Orders",
          data: analyticsData.salesData.map((item) => item.orders),
          backgroundColor: "rgba(130, 202, 157, 0.6)",
          borderColor: "rgba(130, 202, 157, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [analyticsData?.salesData]);

  const categoryChartData = useMemo(() => {
    if (!analyticsData?.categoryData?.length) {
      return {
        labels: ["No category data available"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#e5e7eb"],
            borderWidth: 1,
          },
        ],
      };
    }

    return {
      labels: analyticsData.categoryData.map(
        (item) => item.name || item._id || "Unknown Category"
      ),
      datasets: [
        {
          data: analyticsData.categoryData.map(
            (item) => item.value || item.totalSales || item.totalRevenue || 0
          ),
          backgroundColor: [
            "#8884d8",
            "#82ca9d",
            "#ffc658",
            "#ff8042",
            "#0088FE",
            "#00C49F",
            "#FFBB28",
            "#FF8042",
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [analyticsData?.categoryData]);

  // Retry handler
  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  // Time range handler
  const handleTimeRangeChange = useCallback((newRange) => {
    setTimeRange(newRange);
  }, []);

  // Loading state
  if (loading && !analyticsData) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <CardSkeleton />
          <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse mb-4"></div>
            <ChartSkeleton />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse mb-4"></div>
            <ChartSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !analyticsData) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Unable to load analytics
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!analyticsData && !loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="bg-white rounded-lg shadow p-8">
          <EmptyState onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Track your store's performance and metrics
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-between items-center mb-6">
        {/* Online Users Count */}
        <div className="bg-white rounded-lg shadow px-4 py-3 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full p-2 bg-green-100 text-green-600 mr-3">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Online Users</p>
              <p className="text-lg font-semibold text-gray-800">
                {analyticsData.summary?.onlineUsers || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Time Range Buttons */}
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {["weekly", "monthly", "yearly"].map((range) => (
            <button
              key={range}
              type="button"
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                range === "weekly" ? "rounded-l-lg" : ""
              } ${range === "yearly" ? "rounded-r-lg" : ""} ${
                timeRange === range
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
              onClick={() => handleTimeRangeChange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Total Revenue",
            value: `R${
              analyticsData.summary?.totalRevenue?.toLocaleString() || 0
            }`,
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ),
            bgColor: "bg-purple-100",
            textColor: "text-purple-600",
          },
          {
            label: "Total Orders",
            value: analyticsData.summary?.totalOrders?.toLocaleString() || 0,
            icon: (
              <svg
                className="w-6 h-6"
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
            ),
            bgColor: "bg-blue-100",
            textColor: "text-blue-600",
          },
          {
            label: "Customers",
            value: analyticsData.summary?.totalUsers?.toLocaleString() || 0,
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            ),
            bgColor: "bg-green-100",
            textColor: "text-green-600",
          },
          {
            label: "Delivered",
            value:
              analyticsData.summary?.deliveredOrders?.toLocaleString() || 0,
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ),
            bgColor: "bg-teal-100",
            textColor: "text-teal-600",
          },
        ].map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div
                className={`rounded-full p-3 ${card.bgColor} ${card.textColor}`}
              >
                {card.icon}
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">{card.label}</p>
                <h3 className="font-bold text-2xl">{card.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Sales Overview
          </h2>
          <div className="h-80">
            {loading ? (
              <ChartSkeleton />
            ) : (
              <Bar data={salesChartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Sales by Category
          </h2>
          <div className="h-80">
            {loading ? (
              <ChartSkeleton />
            ) : (
              <Pie data={categoryChartData} options={chartOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Additional Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Orders Trend
          </h2>
          <div className="h-80">
            {loading ? (
              <ChartSkeleton />
            ) : (
              <Line data={ordersChartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Best Sellers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Best Selling Products
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-10 bg-gray-200 rounded animate-pulse w-10"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : analyticsData.bestSellers &&
            analyticsData.bestSellers.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Units Sold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.bestSellers.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            product.isBestseller
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {product.isBestseller ? "Bestseller" : "Top Seller"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.sales || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        R{product.revenue?.toLocaleString() || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No bestseller data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Metrics */}
      {analyticsData.customerMetrics && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Customer Insights
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Returning Customers */}
            <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
              <div className="text-3xl font-bold text-purple-700">
                {analyticsData.customerMetrics.returningCustomers || 0}%
              </div>
              <div className="text-sm font-medium text-purple-600">
                Returning Customers
              </div>
            </div>

            {/* New Customers */}
            <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
              <div className="text-3xl font-bold text-blue-700">
                {analyticsData.customerMetrics.newCustomers || 0}%
              </div>
              <div className="text-sm font-medium text-blue-600">
                New Customers
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
              <div className="text-3xl font-bold text-green-700">
                {analyticsData.customerMetrics.conversionRate || 0}%
              </div>
              <div className="text-sm font-medium text-green-600">
                Conversion Rate
              </div>
            </div>

            {/* Average Order Value */}
            <div className="bg-yellow-50 rounded-lg p-4 text-center border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-700">
                R
                {analyticsData.customerMetrics.avgOrderValue?.toFixed(2) ||
                  "0.00"}
              </div>
              <div className="text-sm font-medium text-yellow-600">
                Average Order Value
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export with Error Boundary
const AnalyticsWithErrorBoundary = (props) => (
  <AnalyticsErrorBoundary>
    <Analytics {...props} />
  </AnalyticsErrorBoundary>
);

export default AnalyticsWithErrorBoundary;
