import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { toast } from 'react-toastify';
import SearchBox from './SearchBox';

const Header = () => {
  const { cartItems } = useSelector(state => state.cart);
  const { userInfo } = useSelector(state => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItemCount = cartItems.reduce((total, item) => total + item.qty, 0);
  const firstName = userInfo?.name?.split(' ')[0] || 'Friend';

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
      toast.success('Logout successful');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <Navbar
      bg='dark'
      variant='dark'
      expand='lg'
      fixed='top'
      collapseOnSelect
      className='navbar-modern w-100'
    >
      <Container fluid='lg' className='py-2'>
        <LinkContainer to='/'>
          <Navbar.Brand className='fw-bold text-uppercase'>
            <span className='text-warning'>Corner</span> Store
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls='main-navbar' />
        <Navbar.Collapse id='main-navbar' className='align-items-center'>
          <div className='ms-lg-4 me-lg-2 flex-grow-1 mb-3 mb-lg-0'>
            <SearchBox />
          </div>
          <Nav className='ms-auto align-items-lg-center gap-1'>
            <LinkContainer to='/cart'>
              <Nav.Link className='d-flex align-items-center gap-2'>
                <FaShoppingCart />
                Cart
                {cartItemCount > 0 && (
                  <Badge bg='warning' text='dark' pill>
                    {cartItemCount}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>
            {userInfo ? (
              <NavDropdown title={`Hello, ${firstName}`} id='username' align='end'>
                <LinkContainer to='/profile'>
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={logoutHandler}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <LinkContainer to='/login'>
                <Nav.Link className='d-flex align-items-center gap-2'>
                  <FaUser />
                  Sign In
                </Nav.Link>
              </LinkContainer>
            )}
            {userInfo?.isAdmin && (
              <NavDropdown title='Admin' id='adminmenu' align='end'>
                <LinkContainer to='/admin/product-list'>
                  <NavDropdown.Item>Products</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/order-list'>
                  <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/user-list'>
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
