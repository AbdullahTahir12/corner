import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { searchProduct, clearSearch } from '../slices/searchProductSlice';

function SearchBox() {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();

  const searchProductHandler = event => {
    event.preventDefault();
    dispatch(searchProduct(input.trim()));
  };

  const clearSearchHandler = () => {
    dispatch(clearSearch());
    setInput('');
  };

  return (
    <Form onSubmit={searchProductHandler} className='search-box w-100' role='search'>
      <Form.Control
        size='sm'
        type='text'
        value={input}
        onChange={event => setInput(event.target.value)}
        placeholder='Search the night market'
        className='search-box__input flex-grow-1'
        aria-label='Search products'
      />
      {input && (
        <Button
          type='button'
          variant='dark'
          className='search-box__btn search-box__btn--ghost'
          onClick={clearSearchHandler}
          aria-label='Clear search'
        >
          <FaTimes />
        </Button>
      )}
      <Button
        type='submit'
        variant='warning'
        className='search-box__btn'
        aria-label='Submit search'
      >
        <FaSearch />
      </Button>
    </Form>
  );
}

export default SearchBox;
