import React, { useState, useEffect } from 'react';
import '../styles/ProductReview.css';
import Navbar from '../components/Navbar';
import CommentsList from '../components/CommentsList';
import AddCommentForm from '../components/AddCommentForm';

function ProductReview() {
  const [skincareProducts, setSkincareProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [commentsKey, setCommentsKey] = useState(0); // To trigger CommentsList refresh

  useEffect(() => {
    fetch('./skincareProducts.json')
      .then((response) => response.json())
      .then((data) => setSkincareProducts(data))
      .catch((error) => console.error('Error fetching skincare products: ', error));
  }, []);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseEnlargedView = () => {
    setSelectedProduct(null);
  };

  // Refresh comments after adding, updating, or deleting a comment
  const handleCommentAdded = () => {
    setCommentsKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="full-page">
      <Navbar />
      <div className="community-page">
        <h1>Skincare Product Reviews</h1>
        <p>Explore the best skincare products reviewed by our community!</p>
        <div className="reviews-container">
          {!selectedProduct ? (
            skincareProducts.map((product) => (
              <div
                className="review-card"
                key={product.id}
                onClick={() => handleCardClick(product)}
              >
                <div className="user-info">
                  <img
                    className="profile-pic"
                    src={product.user.profilePic}
                    alt={product.user.name}
                  />
                  <h3>{product.user.name}</h3>
                  <p className="user-role">{product.user.role}</p>
                </div>
                <img
                  className="product-image"
                  src={product.image_url}
                  alt={product.product_name}
                />
                <h3>{product.product_name}</h3>
                <p className="price">${product.price.toFixed(2)}</p>
                <div className="rating">
                  {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
                  <span> ({product.review_count} reviews)</span>
                </div>
                <p className="description">{product.description}</p>
                <button className="comment-button">Add Your Comment here</button>
              </div>
            ))
          ) : (
            <div className="enlarged-card">
              <button className="close-button" onClick={handleCloseEnlargedView}>
                X
              </button>
              <div className="user-info">
                <img
                  className="profile-pic"
                  src={selectedProduct.user.profilePic}
                  alt={selectedProduct.user.name}
                />
                <h3>{selectedProduct.user.name}</h3>
                <p className="user-role">{selectedProduct.user.role}</p>
              </div>
              <img
                className="product-image"
                src={selectedProduct.image_url}
                alt={selectedProduct.product_name}
              />
              <h3>{selectedProduct.product_name}</h3>
              <p className="price">${selectedProduct.price.toFixed(2)}</p>
              <div className="rating">
                {'★'.repeat(Math.round(selectedProduct.rating))}{'☆'.repeat(5 - Math.round(selectedProduct.rating))}
                <span> ({selectedProduct.review_count} reviews)</span>
              </div>
              <p className="description">{selectedProduct.description}</p>

              {/* AddCommentForm Component */}
              <AddCommentForm
                productId={selectedProduct.id}
                onCommentAdded={handleCommentAdded}
              />

              {/* CommentsList Component */}
              <CommentsList key={commentsKey} productId={selectedProduct.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductReview;
