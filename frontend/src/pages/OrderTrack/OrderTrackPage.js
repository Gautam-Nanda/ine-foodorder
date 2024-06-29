import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { trackOrderById, cancelOrder, acceptOrder } from '../../services/orderService';
import NotFound from '../../components/NotFound/NotFound';
import classes from './orderTrackPage.module.css';
import DateTime from '../../components/DateTime/DateTime';
import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';
import Title from '../../components/Title/Title';
import { useAuth } from '../../hooks/useAuth';
import { OrderStatus } from '../OrderTrack/OrderStatus'

export default function OrderTrackPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState();
  const { user } = useAuth();

  useEffect(() => {
    orderId &&
      trackOrderById(orderId).then(order => {
        setOrder(order);
      });
  }, []);

  const handleCancelOrder = async () => {

    try {
      const updatedOrder = await cancelOrder(orderId);
      setOrder(updatedOrder);
      console.log('Order canceled successfully');
    } catch (error) {
      console.error('Error canceling order:', error);
    }
    

  };

    const handleAcceptOrder = async () => {
      try {
        const updatedOrder = await acceptOrder(orderId);
        setOrder(updatedOrder);
        console.log('Order accepted successfully');
      } catch (error) {
        console.error('Error accepting order:', error);
      }
    }

  if (!orderId)
    return <NotFound message="Order Not Found" linkText="Go To Home Page" />;

  return (
    order && (
      <div className={classes.container}>
        <div className={classes.content}>
          <h1>Order #{order.id}</h1>
          <div className={classes.header}>
            <div>
              <strong>Date</strong>
              <DateTime date={order.createdAt} />
            </div>
            <div>
              <strong>Name</strong>
              {order.name}
            </div>
            <div>
              <strong>Address</strong>
              {order.address}
            </div>
            <div>
              <strong>State</strong>
              {order.status}
            </div>
            
          </div>

          <OrderItemsList order={order} />
        </div>



        {user.isAdmin && order.status !== OrderStatus.CANCELED && (
          <div className={classes.cancelOrder}>
            <button onClick={handleAcceptOrder}>Accept Order</button>
            <button onClick={handleCancelOrder}>Cancel Order</button>
          </div>
        )}
        
      </div>
    )
  );
}
