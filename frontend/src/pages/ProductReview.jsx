import React from 'react';
import Navbar from '../components/Navbar'; // Import Navbar

function ProductReview() {
  return (
    <div className="product-review-page">
      <Navbar /> {/* Include the Navbar component here */}
      <h2>Product Reviews</h2>
      <p>Reviews and ratings for skincare products.</p>
    </div>
  );
}

export default ProductReview;
