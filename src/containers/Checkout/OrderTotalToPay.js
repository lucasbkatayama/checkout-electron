import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => ({
  totalToPay: state.orderTotalToPay
});

let OrderTotalToPay = ({ totalToPay, dispatch }) => {

    return (
        <span>
            {parseFloat(totalToPay).toFixed(2)} &euro;
        </span>
    );
}

OrderTotalToPay = connect(mapStateToProps)(OrderTotalToPay);

export default OrderTotalToPay
