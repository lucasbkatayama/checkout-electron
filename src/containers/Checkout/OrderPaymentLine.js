import React from 'react'
import { connect } from 'react-redux'

import { paymentRemoveLine } from '../../actions'

let OrderPaymentLine = ({line, key, dispatch}) => (
    <tr>
        <td>{line.type}</td>
        <td>{line.label}</td>
        <td className="text-right">- {line.amount.toFixed(2)} &euro;</td>
        <td>
            <button
                className="btn btn-xs btn-danger glyphicon glyphicon-remove"
                onClick={(e) => {
                    dispatch(paymentRemoveLine(line))
                }}
            >
            </button>
        </td>
    </tr>
);

OrderPaymentLine = connect()(OrderPaymentLine);

export default OrderPaymentLine
