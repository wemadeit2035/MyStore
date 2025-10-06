import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Title from "../components/Title";
import assets from "../assets/assets";
import NewsletterBox from "../components/NewsLetterBox.jsx";
import L from "leaflet";
import axios from "axios";

// Fix for default markers in react-leaflet
import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Your coordinates
  const position = [-26.1088, 28.0527];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/contact`,
        formData
      );

      if (response.data.success) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Structured data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Us - Finezto Fashion",
          description:
            "Get in touch with Finezto Fashion. Visit our store, contact us by phone or email, or send us a message.",
          mainEntity: {
            "@type": "Store",
            name: "Finezto Flagship Store",
            address: {
              "@type": "PostalAddress",
              streetAddress: "123 Fashion District",
              addressLocality: "Johannesburg",
              addressCountry: "South Africa",
            },
            telephone: "+27 11 555 0123",
            email: "admin@finezto.com",
            openingHours: ["Mo-Fr 09:00-20:00", "Sa-Su 10:00-18:00"],
          },
        })}
      </script>

      {/* Hero Section with Background Image */}
      <section
        className="relative py-16 md:py-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${assets.contact_image})` }}
        aria-labelledby="contact-heading"
      >
        <div
          className="absolute inset-0 bg-black opacity-60"
          aria-hidden="true"
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block text-3xl md:text-4xl">
            <Title
              text1={"GET IN TOUCH"}
              text2={"WITH US"}
              className="text-white"
            />
          </div>
          <h1 id="contact-heading" className="sr-only">
            Contact Finezto Fashion
          </h1>
          <p className="mt-3 text-base md:text-lg text-gray-100 max-w-3xl mx-auto px-4">
            We'd love to hear from you. Our team is always ready to connect and
            assist you.
          </p>
          <div className="mt-6 flex justify-center" aria-hidden="true">
            <div className="w-16 h-1 bg-green-500"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Information */}
          <div className="space-y-6 md:space-y-8">
            <section aria-labelledby="information-heading">
              <h2
                id="information-heading"
                className="text-xl md:text-2xl font-serif font-light text-gray-800 mb-4"
              >
                Our Information
              </h2>

              <div className="space-y-4 md:space-y-6" role="list">
                <div className="flex items-start" role="listitem">
                  <div
                    className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 bg-green-50 rounded-full flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-4 w-4 md:h-5 md:w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 11111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h3 className="text-sm md:text-base font-medium text-gray-900">
                      Our Store
                    </h3>
                    <address className="mt-1 text-gray-600 text-xs md:text-sm not-italic">
                      123 Fashion District,
                      <br />
                      Johannesburg, South Africa
                    </address>
                  </div>
                </div>

                <div className="flex items-start" role="listitem">
                  <div
                    className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 bg-green-50 rounded-full flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-4 w-4 md:h-5 md:w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h3 className="text-sm md:text-base font-medium text-gray-900">
                      Contact Details
                    </h3>
                    <div className="mt-1 text-gray-600 text-xs md:text-sm">
                      <p>
                        Tel:{" "}
                        <a
                          href="tel:+27115550123"
                          className="hover:text-green-600 transition-colors"
                        >
                          +27 11 555 0123
                        </a>
                      </p>
                      <p>
                        Email:{" "}
                        <a
                          href="mailto:admin@finezto.com"
                          className="hover:text-green-600 transition-colors"
                        >
                          admin@finezto.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start" role="listitem">
                  <div
                    className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 bg-green-50 rounded-full flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-4 w-4 md:h-5 md:w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h3 className="text-sm md:text-base font-medium text-gray-900">
                      Store Hours
                    </h3>
                    <p className="mt-1 text-gray-600 text-xs md:text-sm">
                      Monday-Friday: 9am - 8pm
                      <br />
                      Saturday-Sunday: 10am - 6pm
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="pt-6 border-t border-gray-200"
              aria-labelledby="careers-heading"
            >
              <h2
                id="careers-heading"
                className="text-xl md:text-2xl font-serif font-light text-gray-800 mb-4"
              >
                Careers At Finezto
              </h2>
              <p className="text-gray-600 text-xs md:text-sm mb-4">
                Join our passionate team of professionals dedicated to
                delivering exceptional products and service. We're always
                looking for talented individuals to grow with us.
              </p>
              <button
                className="group relative inline-flex items-center justify-center px-4 py-2 md:px-5 md:py-2 text-xs md:text-sm font-medium text-white bg-black overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Explore job opportunities at Finezto"
              >
                <span
                  className="absolute inset-0 w-full h-full transition-all duration-300 ease-out bg-gradient-to-r from-green-600 to-green-800 group-hover:from-green-700 group-hover:to-green-900"
                  aria-hidden="true"
                ></span>
                <span
                  className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"
                  aria-hidden="true"
                ></span>
                <span className="relative">Explore Job Opportunities</span>
              </button>
            </section>
          </div>

          {/* Contact Form */}
          <section
            className="bg-gray-300 rounded-xl p-4 md:p-6"
            aria-labelledby="contact-form-heading"
          >
            <h2
              id="contact-form-heading"
              className="text-xl md:text-2xl font-serif font-light text-gray-800 mb-4"
            >
              Send Us a Message
            </h2>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <div
                className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-xs md:text-sm"
                role="alert"
              >
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            {submitStatus === "error" && (
              <div
                className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-xs md:text-sm"
                role="alert"
              >
                Sorry, there was an error sending your message. Please try again
                or contact us directly at admin@finezto.com.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs md:text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-xs md:text-sm focus:outline-none"
                  placeholder="Your full name"
                  required
                  disabled={isSubmitting}
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs md:text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-xs md:text-sm focus:outline-none"
                  placeholder="your.email@example.com"
                  required
                  disabled={isSubmitting}
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs md:text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-xs md:text-sm focus:outline-none"
                  placeholder="How can we help you?"
                  required
                  disabled={isSubmitting}
                  aria-required="true"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white py-2 px-4 rounded-lg transition-colors duration-300 font-medium text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
                aria-label={isSubmitting ? "Sending message" : "Send message"}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </section>
        </div>

        {/* Map Section */}
        <section className="mt-12 md:mt-16" aria-labelledby="map-heading">
          <h2 id="map-heading" className="sr-only">
            Our Location
          </h2>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Map Container */}
              <div className="h-64 sm:h-80 md:h-96">
                <MapContainer
                  center={position}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                  zoomControl={true}
                  className="z-0"
                  aria-label="Interactive map showing Finezto store location"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={position}>
                    <Popup>
                      Finezto Flagship Store <br /> 123 Fashion District,
                      Johannesburg, SA
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              {/* Store Info Overlay */}
              <div className="p-4 md:p-6 bg-black text-white flex flex-col justify-center">
                <h3 className="text-lg md:text-xl font-serif mb-3">
                  Visit Our Flagship Store
                </h3>
                <p className="mb-4 text-xs md:text-sm text-gray-300">
                  Experience the complete Finezto collection in our beautifully
                  designed retail space where our experts will help you find
                  exactly what you're looking for.
                </p>
                <div className="space-y-2 text-xs md:text-sm">
                  <div className="flex items-start">
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4 mr-2 mt-0.5 text-green-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 11111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    <span className="break-words">
                      123 Fashion District, Johannesburg, South Africa
                    </span>
                  </div>
                  <div className="flex items-start">
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4 mr-2 mt-0.5 text-green-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>Mon-Fri: 9am-8pm | Sat-Sun: 10am-6pm</span>
                  </div>
                  <div className="flex items-start">
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4 mr-2 mt-0.5 text-green-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                    <span>
                      <a
                        href="tel:+27115550123"
                        className="hover:text-green-400 transition-colors break-words"
                      >
                        +27 11 555 0123
                      </a>
                    </span>
                  </div>
                </div>
                <button
                  className="mt-4 md:mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs md:text-sm transition-colors w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        "Sandton City, Johannesburg, South Africa"
                      )}`
                    )
                  }
                  aria-label="Get directions to our store"
                >
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
