import { useNavigate, useParams } from "react-router-dom";
import { useGetAllProductsQuery } from "../../feature/product/productApi";

const StorePage = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useGetAllProductsQuery();
  const formatPrice = (price) => {
    return typeof price === "number"
      ? price.toFixed(2)
      : parseFloat(price || 0).toFixed(2);
  };

  const storeProducts = products.filter(
    (product) =>
      String(product.seller?.id) === String(sellerId)
  );

  return (
    <div className="min-h-screen bg-white">

      <section className="bg-black py-20 text-white">
        <span 
          className="px-4 mb-10 py-2 text-gray-400 hover:text-white cursor-pointer"
          onClick={() => navigate("/")}
        >
          Back
        </span>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Store
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            {storeProducts[0]?.seller?.sellerApplication?.storeName ||
              "Store"}
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            {storeProducts[0]?.seller?.sellerApplication?.storeDescription ||
              "Explore products from this store."}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-950">
              Products from this Store
            </h2>

            <p className="mt-2 text-gray-500">
              {storeProducts.length} products available
            </p>
          </div>
          

         {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 font-medium">
                Loading products...
              </p>
            </div>
          ) : storeProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto">
              <span className="text-4xl block mb-3">
                🔍
              </span>

              <h3 className="text-xl font-bold text-gray-900">
                No Products Found
              </h3>

              <p className="text-gray-500 mt-1 px-4">
                This store currently has no products available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">

              {storeProducts.map((product) => {
                const image = product.images?.[0]?.image || null;

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer"
                  >

                    <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">

                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGx9bm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0YzRjRGNiIvPjwvc3ZnPg==";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                            No Image Available
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-full py-3 bg-white/95 backdrop-blur-sm text-slate-900 rounded-xl text-sm font-bold text-center shadow-lg">
                          View Product
                        </div>
                      </div>

                    </div>

                    <div className="p-5 flex flex-col flex-1">

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        {product.seller?.sellerApplication?.storeName ||
                          "PriceTag"}
                      </p>

                      <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-slate-600 transition-colors duration-200">
                        {product.name}
                      </h3>

                      {product.description && (
                        <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <div className="mt-auto pt-5 flex items-center justify-between gap-3">

                        <div>
                          <p className="text-xs text-slate-400 font-medium mb-1">
                            Price
                          </p>

                          <span className="text-xl font-black text-slate-900">
                            ${formatPrice(product.price)}
                          </span>
                        </div>

                        <span 
                        onClick={()=> navigate("/login")}
                        className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold group-hover:bg-black transition-colors duration-300">
                          Buy Now
                        </span>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}
          

        </div>
      </section>

    </div>
  );
};

export default StorePage;