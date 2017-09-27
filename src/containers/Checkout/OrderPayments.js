import React from 'react'
import { connect } from 'react-redux'

import OrderPaymentLine from './OrderPaymentLine'

const mapStateToProps = (state, ownProps) => ({
  lines: state.orderPayments
});

let OrderPayments = ({ lines, dispatch }) => {
    let linesList = lines.map((line, key) => {
        return (
            <OrderPaymentLine key={key} line={line} />
        )
    });

    return (
        <tbody>
            {linesList}
        </tbody>
    );
}

OrderPayments = connect(mapStateToProps)(OrderPayments);

export default OrderPayments
