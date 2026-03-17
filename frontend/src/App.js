import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className='app-shell'>
      <Header />
      <main className='app-main'>
        <Container fluid='lg'>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer position='top-center' autoClose={1200} theme='colored' />
    </div>
  );
};

export default App;
