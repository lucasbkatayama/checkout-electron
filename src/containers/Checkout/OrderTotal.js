import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => ({
  lines: state.orderLines
});

let OrderTotal = ({ lines, dispatch }) => {
    let total = 0;
    lines.forEach((line, key) => {
        total += line.price;
    });

    return (
        <span>
            {total.toFixed(2)} &euro;
        </span>
    );
}

OrderTotal = connect(mapStateToProps)(OrderTotal);

export default OrderTotal
