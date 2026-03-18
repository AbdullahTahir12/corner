import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const PRODUCTS_PER_PAGE = 8;

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { search: searchTerm = '' } = useSelector(state => state.search);
  const trimmedSearch = searchTerm.trim();

  useEffect(() => {
    setCurrentPage(1);
  }, [trimmedSearch]);

  const { data, isLoading, error, isFetching } = useGetProductsQuery({
    limit: PRODUCTS_PER_PAGE,
    skip: (currentPage - 1) * PRODUCTS_PER_PAGE,
    search: trimmedSearch || undefined
  });

  const products = data?.products ?? [];
  const totalProducts = data?.total ?? 0;
  const totalPage = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE));

  const pageHandler = pageNumber => {
    if (pageNumber >= 1 && pageNumber <= totalPage && pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <Meta />
            <section className='hero mb-5'>
        <p className='hero__tag text-uppercase'>Neo Aurora drop</p>
        <h1 className='hero__title'>Shop the luminous night market</h1>
        <p className='hero__subtitle'>
          Curated gadgets, decor, and everyday upgrades bathed in neon. Fast, secure checkout &amp;
          transparent reviews so you can shop boldly after dark.
        </p>
        <div className='hero__cta'>
          <a href='#products' className='btn-cta primary'>
            Explore catalog
          </a>
          <Link to='/cart' className='btn-cta secondary'>
            Go to cart
          </Link>
        </div>
      </section>

      {!trimmedSearch && (
        <div className='carousel-wrapper'>
          <ProductCarousel />
        </div>
      )}

      <div className='section-heading' id='products'>
        <div>
          <p className='text-uppercase text-muted small mb-1'>Just dropped</p>
          <h2>Latest products</h2>
        </div>
        <p>
          {products.length > 0
            ? `Showing ${products.length} of ${totalProducts} items`
            : isFetching
            ? 'Looking for products...'
            : 'No products available'}
        </p>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <div className='product-grid'>
            {products.map(product => (
              <Product key={product._id} product={product} />
            ))}
          </div>
          {totalPage > 1 && !trimmedSearch && (
            <Paginate currentPage={currentPage} totalPage={totalPage} pageHandler={pageHandler} />
          )}
        </>
      )}
    </>
  );
};

export default HomePage;

