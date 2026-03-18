import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <Container>
        <Row className='align-items-center gy-3'>
          <Col md={6} className='text-md-start text-center fw-semibold'>
            Corner Store &copy; {currentYear}
            <div className='small text-muted'>Neo Aurora commerce powered by MERN.</div>
          </Col>
          <Col md={6} className='text-md-end text-center'>
            <nav className='footer__links' aria-label='Footer links'>
              <Link to='/#products'>Products</Link>
              <Link to='/profile'>Account</Link>
              <Link to='/cart'>Cart</Link>
            </nav>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
