import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img 
        src={`https://bhadohi-aluminium-yczh.vercel.app/${product.image}`} 
        alt={product.name} 
        onError={(e) => { e.target.src = 'https://via.placeholder.com/250?text=Image+Not+Found'; }} 
      />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>Total: ₹{product.cost.total}</p>
      <Link to={`/product/${product._id}`} className="btn">
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
// import React from 'react';
// import { Link } from 'react-router-dom';

// const ProductCard = ({ product }) => {
//   return (
//     <div className="product-card">
//       <img 
//         src={`data:image/jpeg;base64,${product.image.replace(/^data:image\/(jpeg|png);base64,/, '')}`} 
//         alt={product.name} 
//         onError={(e) => { e.target.src = 'https://via.placeholder.com/250?text=Image+Not+Found'; }} 
//       />
//       <h3>{product.name}</h3>
//       <p>{product.description}</p>
//       <p>Total: ₹{product.cost.total}</p>
//       <Link to={`/product/${product._id}`} className="btn">
//         View Details
//       </Link>
//     </div>
//   );
// };

// export default ProductCard;