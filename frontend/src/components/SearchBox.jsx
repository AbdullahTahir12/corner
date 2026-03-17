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
    <Form onSubmit={searchProductHandler} className='search-box w-100'>
      <Form.Control
        size='sm'
        type='text'
        value={input}
        onChange={event => setInput(event.target.value)}
        placeholder='Search for products'
        className='bg-transparent border-0 text-white'
      />
      {input && (
        <Button
          type='button'
          variant='light'
          className='text-dark border-0 d-flex align-items-center justify-content-center'
          onClick={clearSearchHandler}
        >
          <FaTimes />
        </Button>
      )}
      <Button
        type='submit'
        variant='warning'
        className='text-dark border-0 d-flex align-items-center justify-content-center'
      >
        <FaSearch />
      </Button>
    </Form>
  );
}

export default SearchBox;
