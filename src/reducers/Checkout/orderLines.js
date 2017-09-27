const orderLines = (state=[], action) => {
    switch (action.type) {
        case 'ORDER_LINES_ADD':
            return [
                ...state,
                action.productLine
            ];
        case 'ORDER_LINES_REMOVE':
            return state.filter(function(line) {
                return line != action.productLine
            });
        case 'RESET_ORDER':
            return [];
        default:
            return state;
    }
}

export default orderLines
