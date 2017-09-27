import React from 'react'
import { connect } from 'react-redux'

import { orderRemoveLine } from '../../actions'

let OrderLine = ({line, dispatch}) => (
    <tr>
        <td>{line.ean}</td>
        <td>{line.name}</td>
        <td className="text-right">{line.price.toFixed(2)} &euro;</td>
        <td>
            <button
                className="btn btn-xs btn-danger glyphicon glyphicon-remove"
                onClick={(e) => {
                    dispatch(orderRemoveLine(line))
                }}
            >
            </button>
        </td>
    </tr>
);

OrderLine = connect()(OrderLine);

export default OrderLine
