import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, ListGroup, Button, Image, Card } from 'react-bootstrap';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useUpdateDeliverMutation,
  useGetStripePublishableKeyQuery
} from '../slices/ordersApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import axios from 'axios';
import Meta from '../components/Meta';
import { addCurrency } from '../utils/addCurrency';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize outside
let stripePromise;
const getStripe = (pubkey) => {
  if (!stripePromise && pubkey) {
    stripePromise = loadStripe(pubkey);
  }
  return stripePromise;
};

const StripePaymentForm = ({ order, onSuccess, payOrder }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = React.useState(null);
  const [processing, setProcessing] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { data } = await axios.post('/api/v1/payment/stripe/create-payment-intent', {
        amount: Math.round(order.totalPrice * 100),
        currency: 'inr'
      });

      const cardElement = elements.getElement(CardElement);

      const payload = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: order.user.name,
            email: order.user.email,
          }
        }
      });

      if (payload.error) {
        setError(`Payment failed: ${payload.error.message}`);
        setProcessing(false);
      } else {
        setError(null);
        setProcessing(false);
        if (payload.paymentIntent.status === 'succeeded') {
          const details = {
            id: payload.paymentIntent.id,
            status: payload.paymentIntent.status,
            updateTime: new Date().toISOString(),
            email: order.user.email
          };
          await payOrder({ orderId: order._id, details });
          onSuccess();
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="p-3 mb-3 bg-light rounded shadow-sm border">
        <CardElement options={{style: {base: {fontSize: '16px', color: '#32325d', '::placeholder': {color: '#aab7c4'}}}}} />
      </div>
      <Button 
        type="submit" 
        disabled={!stripe || processing} 
        className="w-100 rounded-pill shadow-sm fw-bold" 
        variant="primary" 
        size="lg"
      >
        {processing ? 'Processing...' : 'Pay securely with Stripe'}
      </Button>
      {error && <Message variant='danger' className="mt-3">{error}</Message>}
    </form>
  );
};

const OrderDetailsPage = () => {
  const { id: orderId } = useParams();
  
  const { data: order, isLoading, error: orderError } = useGetOrderDetailsQuery(orderId);

  const [payOrder] = usePayOrderMutation();
  const [updateDeliver, { isLoading: isUpdateDeliverLoading }] = useUpdateDeliverMutation();

  const { userInfo } = useSelector(state => state.auth);

  const { data: stripeApiKey } = useGetStripePublishableKeyQuery();

  const deliveredHandler = async () => {
    try {
      await updateDeliver(orderId);
      toast.success('Order Delivered');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Meta title={`Order ${orderId}`} />
      {isLoading ? (
        <Loader />
      ) : orderError ? (
        <Message variant='danger'>
          {orderError?.data?.message || orderError.error}
        </Message>
      ) : (
        <>
          <h2 className="mb-4 fw-bold text-secondary">
            Order <span className="text-reset fs-4">#{orderId}</span>
          </h2>
          <Row>
            <Col md={8}>
              <Card className="mb-4 shadow-sm border-0 rounded-4">
                <Card.Body className="p-4">
                  <Card.Title as="h4" className="mb-3 fw-bold">Shipping Details</Card.Title>
                  <p className="mb-2"><strong>Name:</strong> {order?.user?.name}</p>
                  <p className="mb-2"><strong>Email:</strong> {order?.user?.email}</p>
                  <p className="mb-3">
                    <strong>Address:</strong> {order?.shippingAddress?.address}, {order?.shippingAddress?.city}{' '}
                    {order?.shippingAddress?.postalCode}, {order?.shippingAddress?.country}
                  </p>
                  {order?.isDelivered ? (
                    <Message variant='success'>
                      Delivered on {new Date(order?.deliveredAt).toLocaleString()}
                    </Message>
                  ) : (
                    <Message variant='danger'>Not Delivered</Message>
                  )}
                </Card.Body>
              </Card>

              <Card className="mb-4 shadow-sm border-0 rounded-4">
                <Card.Body className="p-4">
                  <Card.Title as="h4" className="mb-3 fw-bold">Payment Method</Card.Title>
                  <p className="mb-3"><strong>Method:</strong> {order?.paymentMethod}</p>
                  {order?.isPaid ? (
                    <Message variant='success'>
                      Paid on {new Date(order?.paidAt).toLocaleString()}
                    </Message>
                  ) : (
                    <Message variant='danger'>Not Paid</Message>
                  )}
                </Card.Body>
              </Card>

              <Card className="mb-4 shadow-sm border-0 rounded-4">
                <Card.Body className="p-4">
                  <Card.Title as="h4" className="mb-3 fw-bold">Order Items</Card.Title>
                  {order?.orderItems?.length === 0 ? (
                    <Message>Order is empty</Message>
                  ) : (
                    <ListGroup variant='flush'>
                      {order?.orderItems?.map((item, index) => (
                        <ListGroup.Item 
                          key={item._id} 
                          className={`px-0 ${index !== order.orderItems.length - 1 ? 'border-bottom' : 'border-0 pb-0'}`}
                        >
                          <Row className="align-items-center">
                            <Col md={2} xs={3}>
                              <Image src={item.image} alt={item.name} fluid rounded className="shadow-sm" />
                            </Col>
                            <Col md={6} xs={9}>
                              <Link to={`/product/${item._id}`} className='text-decoration-none text-reset fw-bold fs-5'>
                                {item.name}
                              </Link>
                            </Col>
                            <Col md={4} xs={12} className="text-md-end text-start mt-3 mt-md-0 fw-semibold text-secondary">
                              {item.qty} x {addCurrency(item.price)} = <span className="text-reset">{addCurrency(item.qty * item.price)}</span>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="shadow-sm border-0 rounded-4 sticky-top" style={{ top: '2rem' }}>
                <Card.Header className="bg-white border-bottom-0 pt-4 pb-2 px-4 rounded-top-4">
                  <Card.Title as="h4" className="mb-0 fw-bold">Order Summary</Card.Title>
                </Card.Header>
                <Card.Body className="px-4 pb-4">
                  <ListGroup variant='flush'>
                    <ListGroup.Item className="d-flex justify-content-between px-0 border-0 pb-2">
                      <span className="text-muted">Items:</span>
                      <span className="fw-semibold">{addCurrency(order?.itemsPrice)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0 border-0 pb-2">
                      <span className="text-muted">Shipping:</span>
                      <span className="fw-semibold">{addCurrency(order?.shippingPrice)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0 pb-3 border-bottom">
                      <span className="text-muted">Tax:</span>
                      <span className="fw-semibold">{addCurrency(order?.taxPrice)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0 pt-3 border-0">
                      <span className="fs-5 fw-bold">Total:</span>
                      <span className="fs-5 fw-bold text-success">{addCurrency(order?.totalPrice)}</span>
                    </ListGroup.Item>

                    {!order?.isPaid && !userInfo.isAdmin && (
                      <ListGroup.Item className="px-0 border-0 mt-3">
                        {stripeApiKey && stripeApiKey.stripePublishableKey ? (
                          <Elements stripe={getStripe(stripeApiKey.stripePublishableKey)}>
                            <StripePaymentForm 
                              order={order} 
                              payOrder={payOrder} 
                              onSuccess={() => toast.success('Payment successful')}
                            />
                          </Elements>
                        ) : (
                          <Loader />
                        )}
                      </ListGroup.Item>
                    )}

                    {userInfo && userInfo.isAdmin && order?.isPaid && !order?.isDelivered && (
                      <ListGroup.Item className="px-0 border-0 mt-3">
                        <Button
                          onClick={deliveredHandler}
                          variant='primary'
                          className="w-100 rounded-pill shadow-sm fw-bold"
                          disabled={isUpdateDeliverLoading}
                          size="lg"
                        >
                          Mark As Delivered
                        </Button>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default OrderDetailsPage;

