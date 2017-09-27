const refill = (state=[], action) => {
    switch (action.type) {
        case 'REFILL_SET_CONFIG':
        console.log('here');
            return [
                ...state, {
                    variable: action.refillVariable,
                    value:    action.refillValue
                }
            ];
        case 'REFILL_DELETE_CONFIG':
            return state.filter(function(refillItem) {
                return refillItem.variable != action.refillVariable
            });
        case 'REFILL_RESET':
            return [];
        default:
            return state;
    }
}

export default refill
