import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <Container>
        <Row className='align-items-center gy-2'>
          <Col md={6} className='text-md-start text-center fw-semibold'>
            Corner Store &copy; {currentYear}
          </Col>
          <Col md={6} className='text-md-end text-center text-muted small'>
            Crafted with the MERN stack for modern commerce.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
