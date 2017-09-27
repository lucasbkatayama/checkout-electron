const orderStatus = (state='IN_PROGRESS', action) => {
    switch (action.type) {
        case 'ORDER_STATE_UPDATE':
            return action.status;
        case 'RESET_ORDER':
            return 'IN_PROGRESS';
        default:
            return state;
    }
}

export default orderStatus
