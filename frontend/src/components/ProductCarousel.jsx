import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import { addCurrency } from '../utils/addCurrency';
import Loader from './Loader';
import Message from './Message';

const ProductCarousel = () => {
  const {
    data: products = [],
    isLoading,
    error
  } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant='warning'>{error?.data?.message || error.error}</Message>;
  }

  if (!products.length) {
    return <Message>No featured products yet.</Message>;
  }

  return (
    <Carousel fade className='text-center'>
      {products.map(product => (
        <Carousel.Item key={product._id} interval={3500}>
          <Link to={`/product/${product._id}`} className='d-block text-white'>
            <Image
              src={product.image}
              alt={product.name}
              fluid
              className='w-100'
              style={{ height: '420px', objectFit: 'cover', borderRadius: '20px' }}
            />
            <Carousel.Caption className='pb-5 px-5'>
              <p className='text-uppercase small mb-1'>Featured pick</p>
              <h3 className='product-title'>{product.name}</h3>
              <h2>{addCurrency(product.price)}</h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
