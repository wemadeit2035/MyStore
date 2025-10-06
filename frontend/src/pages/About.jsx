import React from "react";
import NewsletterBox from "../components/NewsLetterBox.jsx";
import assets from "../assets/assets";
import Title from "../components/Title";

const About = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Structured data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Our Fashion Journey",
          description:
            "Crafting style narratives since 2012. Learn about our fashion brand story, mission, and core values.",
          publisher: {
            "@type": "Organization",
            name: "Fashion Store",
            description: "Premium fashion retailer",
          },
        })}
      </script>

      {/* Hero Section - Fixed for mobile */}
      <section
        className="relative py-12 md:py-20 bg-gradient-to-br from-gray-900 to-black overflow-hidden"
        aria-labelledby="about-heading"
      >
        <div className="absolute inset-0 z-0 opacity-20" aria-hidden="true">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1
            id="about-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-white mb-4"
          >
            About Our Fashion Journey
          </h1>
          <div
            className="w-16 md:w-20 h-1 bg-green-500 mx-auto mb-4"
            aria-hidden="true"
          ></div>
          <p className="text-base md:text-lg text-gray-300 opacity-90 mb-6 max-w-2xl mx-auto font-light px-4">
            Crafting style narratives since 2012
          </p>
        </div>
      </section>

      {/* Story Section - Fixed layout for mobile */}
      <section
        className="py-12 md:py-16 px-4 relative"
        aria-labelledby="story-heading"
      >
        {/* Premium decorative elements - hidden on mobile */}
        <div
          className="hidden md:block absolute top-16 -left-8 w-60 h-60 bg-green-100 mix-blend-multiply filter blur-xl opacity-10 animate-pulse"
          aria-hidden="true"
        ></div>
        <div
          className="hidden md:block absolute top-80 -right-8 w-60 h-60 bg-amber-100 mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"
          aria-hidden="true"
        ></div>

        <div className="container mx-auto max-w-6xl relative">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 relative mb-8 md:mb-0">
              <div className="relative overflow-hidden shadow-xl group">
                <img
                  src={assets.about_image}
                  alt="Our fashion team working on designs"
                  className="w-full h-auto rounded-lg"
                  width="600"
                  height="400"
                />
                <div
                  className="absolute inset-0 border border-white border-opacity-20 pointer-events-none rounded-lg"
                  aria-hidden="true"
                ></div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="text-3xl md:text-4xl mb-6">
                <Title text1={"OUR"} text2={"STORY"} />
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed font-light text-sm md:text-base">
                What began as a small boutique in downtown Seattle has blossomed
                into a nationwide phenomenon. Founded by fashion enthusiast
                Maria Sanchez, we've stayed true to our core belief:
                <span className="font-normal text-green-600 italic block mt-2 pl-3 border-l-2 border-green-200 text-sm md:text-base">
                  Fashion should empower, not intimidate.
                </span>
              </p>

              <div
                className="grid grid-cols-3 gap-3 md:gap-4 mb-6"
                role="list"
                aria-label="Company achievements"
              >
                <div
                  className="text-center p-3 md:p-4 bg-gray-100 shadow-sm border border-gray-100 rounded-lg"
                  role="listitem"
                >
                  <div className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-1">
                    12+
                  </div>
                  <div className="text-gray-600 text-xs uppercase tracking-widest font-medium">
                    Years
                  </div>
                </div>
                <div
                  className="text-center p-3 md:p-4 bg-gray-100 shadow-sm border border-gray-100 rounded-lg"
                  role="listitem"
                >
                  <div className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-1">
                    500k+
                  </div>
                  <div className="text-gray-600 text-xs uppercase tracking-widest font-medium">
                    Customers
                  </div>
                </div>
                <div
                  className="text-center p-3 md:p-4 bg-gray-100 shadow-sm border border-gray-100 rounded-lg"
                  role="listitem"
                >
                  <div className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-1">
                    75+
                  </div>
                  <div className="text-gray-600 text-xs uppercase tracking-widest font-medium">
                    Awards
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section
        className="py-12 md:py-16 relative overflow-hidden"
        aria-labelledby="mission-heading"
      >
        <div
          className="hidden md:block absolute -bottom-32 -right-32 w-64 h-64 bg-green-100 mix-blend-multiply filter blur-xl opacity-10"
          aria-hidden="true"
        ></div>
        <div className="container mx-auto px-4 max-w-5xl text-center relative">
          <div
            className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white mb-4 rounded-full shadow-sm border border-gray-100"
            aria-hidden="true"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <h2
            id="mission-heading"
            className="text-xl md:text-2xl font-serif font-light text-gray-800 mb-4 tracking-wide"
          >
            Our Mission
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed font-light text-sm md:text-base px-4">
            To redefine fashion retail by creating an inclusive environment
            where everyone can discover their unique style, with
            sustainably-made garments that don't compromise on quality or
            design.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section
        className="py-12 md:py-16 relative"
        aria-labelledby="values-heading"
      >
        <div
          className="hidden md:block absolute top-1/3 -left-16 w-80 h-80 bg-amber-50 mix-blend-multiply filter blur-xl opacity-20"
          aria-hidden="true"
        ></div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-2xl md:text-3xl mb-3">
              <Title text1={"CORE"} text2={"VALUES"} />
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto font-light text-xs md:text-sm px-4">
              These principles guide everything we do, from design to customer
              experience
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            role="list"
            aria-label="Core values"
          >
            {[
              {
                icon: assets.exchange_icon,
                title: "Easy Exchange Policy",
                desc: "We offer hassle-free exchange policy because we want you to love what you wear",
              },
              {
                icon: assets.quality_icon,
                title: "7 Days Return Policy",
                desc: "We provide 7 days free return policy on all items, no questions asked",
              },
              {
                icon: assets.support_icon,
                title: "Premium Customer Support",
                desc: "Our dedicated team provides 24/7 customer support to ensure your satisfaction",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 md:p-8 shadow-sm border border-gray-100 text-center transition-all duration-300 rounded-lg"
                role="listitem"
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-green-50 rounded-full mb-3 md:mb-4 transition-colors duration-300"
                  aria-hidden="true"
                >
                  <img
                    src={value.icon}
                    className="w-6 md:w-8"
                    alt={value.title}
                    width="32"
                    height="32"
                  />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-3 tracking-wide">
                  {value.title}
                </h3>
                <p className="text-gray-600 font-light text-xs md:text-sm leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterBox />
    </div>
  );
};

export default About;
