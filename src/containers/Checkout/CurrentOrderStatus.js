import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => ({
  status: state.orderStatus
});

const OrderStatus = ({status}) => (
    <span>{status}</span>
);

const CurrentOrderStatus = connect(mapStateToProps)(OrderStatus);

export default CurrentOrderStatus
