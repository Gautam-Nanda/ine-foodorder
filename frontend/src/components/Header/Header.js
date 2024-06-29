import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import classes from "./header.module.css";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        {user && (
          <Link to="/">
            <span className={classes.greeting}>
              Hey {user.name}, welcome to FEAST!
            </span>
          </Link>
        )}
        <nav>
          <ul className={classes.navList}>
            {user ? (
              <>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/orders">Orders</Link>
                </li>
                <li>
                  <Link to="/cart">
                    Cart
                    {cart.totalCount > 0 && (
                      <span className={classes.cart_count}>
                        {cart.totalCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <a onClick={logout}>Logout</a>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
