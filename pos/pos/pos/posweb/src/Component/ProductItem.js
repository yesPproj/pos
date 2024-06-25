import React, { useState } from 'react';
import ProductForm from './ProductForm';

const ProductItem = ({ product, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (updatedProduct) => {
    onUpdate(product._id, updatedProduct);
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <ProductForm
          onSubmit={handleUpdate}
          initialData={product}
        />
      ) : (
        <div>
          <h3>{product.name}</h3>
          <p>{product.price}</p>
          <p>{product.description}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(product._id)}>Delete</button>
        </div>
      )}
    </li>
  );
};

export default ProductItem;
