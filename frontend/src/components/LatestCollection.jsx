import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  // Structured data for product collection
  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Latest Fashion Collection",
    description:
      "Discover our newest fashion arrivals and stay ahead of the trends with our latest clothing collection",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: latestProducts.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          image: product.image,
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "ZAR",
          },
          url: `${window.location.origin}/product/${product._id}`,
        },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(collectionStructuredData)}
      </script>

      <section
        className="my-10"
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <div className="text-center py-8 text-3x1">
          <Title text1={"LATEST"} text2={"COLLECTION"} />
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
            Discover our newest fashion arrivals and stay ahead of the trends
            with our latest collection featuring premium quality clothing and
            accessories.
          </p>
        </div>

        <meta itemProp="numberOfItems" content={latestProducts.length} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {latestProducts.map((item, index) => (
            <div
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              key={item._id}
            >
              <meta itemProp="position" content={index + 1} />
              <ProductItem
                key={item._id}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default LatestCollection;
