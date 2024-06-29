import React from 'react';
import { Link } from 'react-router-dom';
import Price from '../../components/Price/Price';
import Title from '../../components/Title/Title';
import { useCart } from '../../hooks/useCart';
import classes from './cartPage.module.css';
import NotFound from '../../components/NotFound/NotFound';

export default function CartPage() {
  const { cart, removeFromCart, changeQuantity } = useCart();

  return (
    <>
      <Title title="Your Shopping Cart" />

      {cart.items.length === 0 ? (
        <NotFound message="Your cart is empty!" />
      ) : (
        <div className={classes.container}>
          <ul className={classes.list}>
            {cart.items.map((item) => (
              <li key={item.food.id}>
                <img src={item.food.imageUrl} alt={item.food.name} />
                <div>
                  <Link to={`/food/${item.food.id}`}>{item.food.name}</Link>
                </div>
                <div>
                  <select
                    value={item.quantity}
                    onChange={(e) => changeQuantity(item, Number(e.target.value))}
                  >
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Price price={item.price} />
                </div>
                <button
                  className={classes.remove_button}
                  onClick={() => removeFromCart(item.food.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className={classes.checkout}>
            <div className={classes.summary}>
              <span>Items Count: {cart.totalCount}</span>
              <span>Total Price: <Price price={cart.totalPrice} /></span>
            </div>
            <Link to="/checkout" className={classes.proceed_button}>
              Proceed To Checkout
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
