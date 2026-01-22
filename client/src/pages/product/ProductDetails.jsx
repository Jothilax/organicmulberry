import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ProductDetails.css";
import { productService } from "../../services/productService";
import { cartService } from "../../services/cartService";
import { wishlistService } from "../../services/wishlistService";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(id);
        if (response.data) {
          const productData = response.data;
          setProduct({
            id: productData.id,
            name: productData.name,
            category: productData.category?.category_name || "General",
            price: productData.price || 0,
            description: productData.description || productData.name,
            images: productData.images || [],
            inStock: (productData.stock || 0) > 0,
            stock: productData.stock || 0,
            brand: productData.brand,
            size: productData.sizeData?.size_name,
            color: productData.colorData?.color_name,
            colorCode: productData.colorData?.color_code,
          });

          // Check if product is in wishlist (if user is logged in)
          const token = localStorage.getItem('customerToken');
          if (token) {
            try {
              const wishlistCheck = await wishlistService.checkWishlist(id);
              setIsInWishlist(wishlistCheck.inWishlist || false);
            } catch (error) {
              console.error("Error checking wishlist:", error);
            }
          }

          // Fetch related products (same category)
          if (productData.category?.id) {
            const allProductsResponse = await productService.getAllProducts();
            if (allProductsResponse.data) {
              const related = allProductsResponse.data
                .filter(p => p.category?.id === productData.category.id && p.id !== productData.id)
                .slice(0, 4)
                .map(p => {
                  const primaryImage = p.images?.find(img => img.is_primary) || p.images?.[0];
                  return {
                    id: p.id,
                    name: p.name,
                    image: primaryImage?.imageUrl || (primaryImage?.images ? `http://16.171.20.13:5000/uploads/products/${primaryImage.images}` : null),
                    price: p.price || 0,
                  };
                });
              setRelatedProducts(related);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('customerToken');
    if (!token) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      await cartService.addToCart(id, quantity);
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "Failed to add product to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!product) return <p className="loading">Product not found</p>;

  const mainImage = product.images?.[currentImageIndex]?.imageUrl || 
    (product.images?.[currentImageIndex]?.images ? `http://localhost:3000/uploads/products/${product.images[currentImageIndex].images}` : null) ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f0f0f0' width='400' height='400'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EProduct Image%3C/text%3E%3C/svg%3E";

  const maxQuantity = Math.min(product.stock || 5, 10);

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/collection">Products</Link> / {product.name}
      </div>

      <div className="product-container">
        {/* Product Image */}
        <div className="product-image">
          <img 
            src={mainImage} 
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f0f0f0' width='400' height='400'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EProduct Image%3C/text%3E%3C/svg%3E";
            }}
          />
          {product.images && product.images.length > 1 && (
            <div className="image-thumbnails">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img.imageUrl || `http://localhost:3000/uploads/products/${img.images}`}
                  alt={`${product.name} ${index + 1}`}
                  className={index === currentImageIndex ? "active" : ""}
                  onClick={() => setCurrentImageIndex(index)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3C/svg%3E";
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <span className="category">{product.category}</span>
          <h2>{product.name}</h2>
          {product.brand && <p style={{ color: '#666', margin: '5px 0' }}>Brand: {product.brand}</p>}
          {product.size && <p style={{ color: '#666', margin: '5px 0' }}>Size: {product.size}</p>}
          {product.color && (
            <p style={{ color: '#666', margin: '5px 0' }}>
              Color: {product.color}
              {product.colorCode && (
                <span 
                  style={{ 
                    display: 'inline-block', 
                    width: '20px', 
                    height: '20px', 
                    backgroundColor: product.colorCode,
                    marginLeft: '10px',
                    border: '1px solid #ccc',
                    verticalAlign: 'middle'
                  }}
                />
              )}
            </p>
          )}
          <div className="price">
            <span className="current">₹{product.price.toLocaleString()}</span>
          </div>
          <p className="desc">{product.description}</p>
          <p className={`stock ${product.inStock ? "in" : "out"}`}>
            {product.inStock ? `In Stock (${product.stock} available)` : "Out of Stock"}
          </p>

          {product.inStock && (
            <>
              <div className="quantity">
                <label>Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  disabled={maxQuantity === 0}
                >
                  {Array.from({ length: maxQuantity }, (_, i) => i + 1).map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <div className="buttons">
                <button 
                  className="btn-cart" 
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? "Adding..." : "🛒 Add to Cart"}
                </button>
                <button
                  className={`btn-wishlist ${isInWishlist ? "active" : ""}`}
                  onClick={async () => {
                    const token = localStorage.getItem('customerToken');
                    if (!token) {
                      alert("Please login to add items to wishlist");
                      navigate("/login");
                      return;
                    }

                    try {
                      setWishlistLoading(true);
                      if (isInWishlist) {
                        // Remove from wishlist - we need to get the wishlist item ID first
                        const wishlistCheck = await wishlistService.checkWishlist(id);
                        if (wishlistCheck.wishlistItem) {
                          await wishlistService.removeFromWishlist(wishlistCheck.wishlistItem.id);
                          setIsInWishlist(false);
                          alert("Removed from wishlist");
                        }
                      } else {
                        await wishlistService.addToWishlist(id);
                        setIsInWishlist(true);
                        alert("Added to wishlist");
                      }
                    } catch (error) {
                      console.error("Error updating wishlist:", error);
                      alert(error.response?.data?.message || "Failed to update wishlist");
                    } finally {
                      setWishlistLoading(false);
                    }
                  }}
                  disabled={wishlistLoading}
                >
                  {wishlistLoading ? "..." : (isInWishlist ? "♥ Remove from Wishlist" : "♡ Add to Wishlist")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-section">
          <h3>Related Products</h3>
          <div className="related-grid">
            {relatedProducts.map((item) => (
              <Link to={`/collectiondetails/${item.id}`} key={item.id} className="related-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <img 
                  src={item.image} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='12' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EProduct%3C/text%3E%3C/svg%3E";
                  }}
                />
                <h4>{item.name}</h4>
                <p>₹{item.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
