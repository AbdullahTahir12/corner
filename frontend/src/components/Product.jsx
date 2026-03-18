import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addCurrency } from '../utils/addCurrency';
import { addToCart } from '../slices/cartSlice';
import Rating from './Rating';

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const inStock = (product.countInStock ?? 0) > 0;

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success('Added to cart!');
  };

  return (
    <article className='product-card'>
      <div className='position-relative'>
        <Link to={`/product/${product._id}`} className='d-block'>
          <img src={product.image} alt={product.name} className='product-card__image mb-3' />
        </Link>
        <span className={`product-card__badge ${inStock ? '' : 'out'}`}>
          {inStock ? 'In stock' : 'Sold out'}
        </span>
      </div>
      <Link to={`/product/${product._id}`} className='text-decoration-none'>
        <h3 className='product-title h5 mb-1'>{product.name}</h3>
      </Link>
      <p className='text-muted small mb-2'>{product.brand || 'Corner Store'}</p>
      <div className='mb-2'>
        <Rating value={product.rating} text={`(${product.numReviews} reviews)`} />
      </div>
      <div className='d-flex justify-content-between align-items-baseline mb-3'>
        <p className='product-card__price mb-0'>{addCurrency(product.price)}</p>
        <span className='badge bg-dark text-uppercase'>ships fast</span>
      </div>
      <div className='product-card__actions mt-auto'>
        <Button
          variant='warning'
          className='fw-semibold'
          type='button'
          disabled={!inStock}
          onClick={addToCartHandler}
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
        <Button as={Link} to={`/product/${product._id}`} variant='outline-dark' className='fw-semibold'>
          Details
        </Button>
      </div>
    </article>
  );
};

export default Product;
