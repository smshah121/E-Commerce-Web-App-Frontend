import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Store } from "lucide-react";
import { useGetAllProductsQuery } from "../../feature/product/productApi";
import { useSelector } from 'react-redux';


const StorePage = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { token, userId } = useSelector((state) => state.auth);
  
  const isLoggedIn = Boolean(token);

  const handleStoreClick = (productId)=> {
    if(isLoggedIn){
      navigate(`/product/${productId}`)
    }
    else{
      navigate("/login")
    }
  }

  const {
    data: products = [],
    isLoading,
  } = useGetAllProductsQuery();

  const formatPrice = (price) => {
    return typeof price === "number"
      ? price.toFixed(2)
      : parseFloat(price || 0).toFixed(2);
  };

  // Get only products belonging to this seller
  const storeProducts = products.filter(
    (product) =>
      String(product.seller?.id) === String(sellerId)
  );

  // Get store information from the first product
  const storeName =
    storeProducts[0]?.seller?.sellerApplication?.storeName ||
    "PriceTag Store";

  const storeDescription =
    storeProducts[0]?.seller?.sellerApplication?.storeDescription ||
    "Explore quality tech accessories from this trusted seller.";

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* =========================
          STORE HERO
      ========================== */}
      <section className="relative overflow-hidden bg-black text-white">

        {/* Background Glow */}
        <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-[140px]" />

        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-[140px]" />

        {/* Subtle Grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/")}
            className="mb-12 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </motion.button>

          <div className="max-w-3xl">

            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-5 flex items-center gap-2"
            >
              <Store className="h-4 w-4 text-blue-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Marketplace Store
              </span>
            </motion.div>

            {/* Store Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl"
            >
              {storeName}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
            >
              {storeDescription}
            </motion.p>

            {/* Store Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex items-center gap-4"
            >
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                <ShoppingBag className="h-5 w-5 text-blue-400" />

                <div>
                  <p className="text-lg font-bold text-white">
                    {storeProducts.length}
                  </p>

                  <p className="text-xs text-slate-500">
                    Products
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* =========================
          STORE PRODUCTS
      ========================== */}
      <section className="bg-white py-20 md:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Store Collection
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Products from {storeName}
              </h2>

              <p className="mt-3 text-sm text-slate-500">
                Explore all products available from this seller.
              </p>
            </div>

            <div className="text-sm font-medium text-slate-400">
              {storeProducts.length}{" "}
              {storeProducts.length === 1
                ? "product"
                : "products"}{" "}
              available
            </div>

          </div>


          {/* Loading */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">

              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading store products...
              </p>

            </div>
          ) : storeProducts.length === 0 ? (

            /* Empty State */
            <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-slate-50 px-6 py-16 text-center">

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <ShoppingBag className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-bold text-slate-950">
                No Products Available
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                This store currently doesn't have any products available.
                Please check back later.
              </p>

              <button
                onClick={() => navigate("/")}
                className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-800"
              >
                Continue Shopping
              </button>

            </div>
          ) : (

            /* Product Grid */
            <motion.div
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >

              {storeProducts.map((product) => {

                const image =
                  product.images?.[0]?.image || null;

                return (
                  <motion.div
                    key={product.id}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                  >

                    {/* Product Image */}
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-50">

                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            No Image Available
                          </span>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">

                        <div className="w-full p-4">

                          <div className="rounded-xl bg-white/95 px-4 py-3 text-center text-xs font-bold text-slate-900 shadow-lg backdrop-blur-sm">
                            View Product
                          </div>

                        </div>

                      </div>

                    </div>


                    {/* Product Content */}
                    <div className="flex flex-1 flex-col p-5">

                      {/* Store */}
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {product.seller?.sellerApplication?.storeName ||
                          "PriceTag"}
                      </p>

                      {/* Product Name */}
                      <h3 className="line-clamp-1 text-lg font-bold leading-snug text-slate-950 transition-colors duration-200 group-hover:text-slate-600">
                        {product.name}
                      </h3>

                      {/* Description */}
                      {product.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                          {product.description}
                        </p>
                      )}

                      {/* Bottom */}
                      <div className="mt-auto flex items-end justify-between gap-4 pt-6">

                        <div>
                          <p className="mb-1 text-xs font-medium text-slate-400">
                            Price
                          </p>

                          <span className="text-xl font-black text-slate-950">
                            ${formatPrice(product.price)}
                          </span>
                        </div>

                        <button
                         onClick={()=>handleStoreClick(product.id)}
                          className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-black"
                        >
                          Buy Now
                        </button>

                      </div>

                    </div>

                  </motion.div>
                );
              })}

            </motion.div>
          )}

        </div>
      </section>

    </div>
  );
};

export default StorePage;