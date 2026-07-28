import { useParams } from "react-router-dom";
import { useGetAllProductsQuery } from "../../feature/product/productApi";
const StorePage = () => {
  const { sellerId } = useParams();

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
            <p>Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {storeProducts.map((product) => (
                <div key={product.id}>
                    
                     <div className="p-5 flex flex-col flex-1">

    {/* Store Name */}
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
      {product.seller?.sellerApplication?.storeName || "PriceTag"}
    </p>

    {/* Product Name */}
   <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-slate-600 transition-colors duration-200">
      {product.name}
    </h3>

    {/* Description */}
    {product.description && (
      <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">
        {product.description}
      </p>
    )}

    {/* Bottom Product Details */}
    <div className="mt-auto pt-5 flex items-center justify-between gap-3">

      {/* Price */}
      <div>
        <p className="text-xs text-slate-400 font-medium mb-1">
          Price
        </p>
        <span className="text-xl font-black text-slate-900">
          ${formatPrice(product.price)}
        </span>
      </div>

      {/* Buy Button */}
      <span className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold group-hover:bg-black transition-colors duration-300">
  Buy Now
</span>
    </div>
    </div>
                  {/* Your existing Product Card */}
                </div>
              ))}
            </div>
          )}
          

        </div>
      </section>

    </div>
  );
};

export default StorePage;