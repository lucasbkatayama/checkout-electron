const orderPayments = (state=[], action) => {
    switch (action.type) {
        case 'PAYMENT_LINES_ADD':
            return [
                ...state,
                action.paymentLine
            ];
        case 'PAYMENT_LINES_REMOVE':
            return state.filter(function(line) {
                return line != action.paymentLine
            });
        case 'RESET_ORDER':
            return [];
        default:
            return state;
    }
}

export default orderPayments
