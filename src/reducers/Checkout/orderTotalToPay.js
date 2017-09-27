const orderTotalToPay = (state=0, action) => {
    switch (action.type) {
        case 'ORDER_LINES_ADD':
            return state + action.productLine.price;
        case 'ORDER_LINES_REMOVE':
            return state - action.productLine.price;
        case 'PAYMENT_LINES_ADD':
            return state - action.paymentLine.amount;
        case 'PAYMENT_LINES_REMOVE':
            return state + action.paymentLine.amount;
        case 'RESET_ORDER':
            return 0;
        default:
            return state;
    }
}

export default orderTotalToPay
