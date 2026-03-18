import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <div className='pulse-loader' role='status' aria-live='polite'>
      <Spinner animation='border' role='presentation' />
      <span className='visually-hidden'>Loading…</span>
    </div>
  );
};

export default Loader;
