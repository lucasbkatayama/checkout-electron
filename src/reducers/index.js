import { combineReducers } from 'redux'
import orderLines from './Checkout/orderLines'
import orderStatus from './Checkout/orderStatus'
import orderPayments from './Checkout/orderPayments'
import orderTotalToPay from './Checkout/orderTotalToPay'

import productLines from './Products/productLines'

import ordersListLines from './OrdersList/ordersListLines'

import refill from './Refill/refill'

const checkoutApp = combineReducers({
    orderLines,
    orderStatus,
    orderPayments,
    orderTotalToPay,

    productLines,

    ordersListLines,

    refill
});

export default checkoutApp
