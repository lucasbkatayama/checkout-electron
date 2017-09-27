const productLines = (state=[], action) => {
    switch (action.type) {
        case 'PRODUCT_LINE_ADD':
            return [
                ...state,
                action.productLine
            ];
        case 'PRODUCT_LINE_UPDATE':
            return state.map(product =>
                (product._id === action.productLine._id)
                    ? action.productLine
                    : product
                );
        case 'PRODUCT_LINE_REMOVE':
            return state.filter(function(product) {
                return product._id != action.productId
            });
        case 'RESET_PRODUCT_LINES':
            return [];
        default:
            return state;
    }
}

export default productLines
