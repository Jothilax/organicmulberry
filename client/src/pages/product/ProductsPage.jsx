import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ProductsPage.css";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await categoryService.getAllCategories();
        if (categoriesResponse.categories) {
          const activeCategories = categoriesResponse.categories
            .filter(cat => cat.is_active !== false)
            .map(cat => cat.category_name);
          setCategories(["All", ...activeCategories]);
        }

        // Fetch products
        const productsResponse = await productService.getAllProducts(searchTerm);
        if (productsResponse.data) {
          const formattedProducts = productsResponse.data
            .filter(product => product.is_active !== false)
            .map(product => {
              const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
              return {
                id: product.id,
                name: product.name,
                price: product.price || 0,
                image: primaryImage?.imageUrl || (primaryImage?.images ? `http://localhost:3000/uploads/products/${primaryImage.images}` : null),
                category: product.category?.category_name || "General",
                brand: product.brand,
                stock: product.stock,
              };
            });
          setAllProducts(formattedProducts);
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

    setProducts(filtered);
  }, [selectedCategory, searchTerm, sortBy, allProducts]);

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h2>Our Product Collection</h2>
          <p>Discover quality products crafted with precision and care</p>
        </div>

        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category, idx) => (
              <option key={idx} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name (A-Z)</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
          </select>

          <span className="count">
            {products.length} product
            {products.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {/* Products */}
        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div className="product-skeleton" key={idx}>
                <div className="image-skeleton" />
                <div className="line-skeleton short" />
                <div className="line-skeleton medium" />
                <div className="line-skeleton long" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <Link to={`/collectiondetails/${product.id}`} key={product.id} className="product-card">
                <img 
                  src={product.image} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                <h3>{product.name}</h3>
                <p>₹{product.price.toLocaleString()}</p>
                {product.stock !== undefined && (
                  <p style={{ fontSize: '0.9em', color: product.stock > 0 ? 'green' : 'red' }}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>
              {searchTerm || selectedCategory !== "All"
                ? "No products found matching your criteria."
                : "No products available."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
