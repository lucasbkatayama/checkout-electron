const ordersListLines = (state=[], action) => {
    switch (action.type) {
        case 'ORDERS_LIST_LINES_ADD':
            return [
                action.order,
                ...state
            ];
        case 'ORDERS_LIST_RESET':
            return [];
        default:
            return state;
    }
}

export default ordersListLines
