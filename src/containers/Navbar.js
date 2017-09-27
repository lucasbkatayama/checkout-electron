import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => (
    <nav className="navbar navbar-default">
        <div className="container-fluid">
            <span className="navbar-brand" href="#">AT Checkout</span>
            <ul className="nav navbar-nav navbar-right">
                <li>
                    <NavLink to="/checkout" activeStyle={{fontWeight:'bold'}}>Caisse</NavLink>
                </li>
                <li>
                    <NavLink to="/products" activeStyle={{fontWeight:'bold'}}>Produits</NavLink>
                </li>
                <li>
                    <NavLink to="/orders" activeStyle={{fontWeight:'bold'}}>Commandes</NavLink>
                </li>
                <li>
                    <NavLink to="/refill" activeStyle={{fontWeight:'bold'}}>Refill</NavLink>
                </li>
                <li>
                    <NavLink to="/stats" activeStyle={{fontWeight:'bold'}}>Statistiques</NavLink>
                </li>
                <li>
                    <NavLink to="/closing" activeStyle={{fontWeight:'bold'}}>Clôture de caisse</NavLink>
                </li>
            </ul>
        </div>
    </nav>
);

export default Navbar
