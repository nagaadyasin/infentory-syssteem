import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
  });
  const [darkMode, setDarkMode] = useState(false);

  // Fetch products & sales
  const fetchData = async () => {
    const pRes = await fetch("http://localhost:9000/products");
    setProducts(await pRes.json());

    const sRes = await fetch("http://localhost:9000/sales");
    setSales(await sRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add new product
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
    await fetch("http://localhost:9000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newProduct.name,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      }),
    });
    setNewProduct({ name: "", price: "", stock: "" });
    fetchData();
  };

  // Sell product
  const handleSale = async (productId, quantity) => {
    await fetch("http://localhost:9000/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: Number(quantity) }),
    });
    fetchData();
  };

  return (
    <div
      className={
        darkMode
          ? "min-h-screen bg-gray-900 text-white p-10"
          : "min-h-screen bg-blue-900 text-white p-10"
      }
    >
      {/* Toggle Dark/Light */}
      <div className="flex justify-end mb-5">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={
            darkMode
              ? "bg-gray-700 p-2 rounded-full"
              : "bg-blue-700 p-2 rounded-full"
          }
        >
          {darkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>

      <h1 className="text-center text-3xl font-bold mb-5">INVENTORY SYSTEM</h1>

      {/* Add New Product */}
      <div
        className={
          darkMode
            ? "bg-gray-800 p-5 rounded-lg mb-8"
            : "bg-blue-800 p-5 rounded-lg mb-8"
        }
      >
        <h2 className="text-xl font-semibold mb-3">Add New Product</h2>
        <input
          className={
            darkMode
              ? "p-2 rounded mb-2 w-full bg-gray-700 text-white"
              : "p-2 rounded mb-2 w-full bg-blue-700 text-white"
          }
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <input
          className={
            darkMode
              ? "p-2 rounded mb-2 w-full bg-gray-700 text-white"
              : "p-2 rounded mb-2 w-full bg-blue-700 text-white"
          }
          placeholder="Price"
          type="number"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
        <input
          className={
            darkMode
              ? "p-2 rounded mb-2 w-full bg-gray-700 text-white"
              : "p-2 rounded mb-2 w-full bg-blue-700 text-white"
          }
          placeholder="Stock"
          type="number"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: e.target.value })
          }
        />
        <button
          className="bg-green-600 hover:bg-green-700 p-2 rounded w-full"
          onClick={handleAddProduct}
        >
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Products</h2>
        <table className="w-full border-collapse text-white">
          <thead>
            <tr className={darkMode ? "bg-gray-700" : "bg-blue-700"}>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Sell</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p._id}
                className={
                  darkMode
                    ? "border-b border-gray-700"
                    : "border-b border-blue-600"
                }
              >
                <td className="p-3">{p.name}</td>
                <td className="p-3">${p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <button
                    className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded"
                    onClick={() => {
                      const qty = prompt("Quantity to sell:");
                      if (qty) handleSale(p._id, qty);
                    }}
                  >
                    Sell
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sales History */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Sales History</h2>
        <table className="w-full border-collapse text-white">
          <thead>
            <tr className={darkMode ? "bg-gray-700" : "bg-blue-700"}>
              <th className="p-3">Product</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr
                key={s._id}
                className={
                  darkMode
                    ? "border-b border-gray-700"
                    : "border-b border-blue-600"
                }
              >
                <td className="p-3">{s.productId?.name}</td>
                <td className="p-3">{s.quantity}</td>
                <td className="p-3">{new Date(s.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
