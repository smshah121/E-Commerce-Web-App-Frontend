import { useParams } from "react-router-dom";
import { useGetAllProductsQuery } from "../../feature/product/productApi";
const StorePage = () => {
  const { sellerId } = useParams();

  const { data: products = [], isLoading } = useGetAllProductsQuery();

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