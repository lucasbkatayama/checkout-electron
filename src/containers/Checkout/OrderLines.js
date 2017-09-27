import React from 'react'
import { connect } from 'react-redux'

import OrderLine from './OrderLine'

const mapStateToProps = (state, ownProps) => ({
  lines: state.orderLines
});

let OrderLines = ({ lines, dispatch }) => {
    let linesList = lines.map((line, key) => {
        return (
            <OrderLine key={key} line={line} />
        )
    });

    return (
        <tbody>
            {linesList}
        </tbody>
    );
}

OrderLines = connect(mapStateToProps)(OrderLines);

export default OrderLines
