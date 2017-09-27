import React from 'react'
import { connect } from 'react-redux'
import { updateOrder } from '../../actions'

let ActionButton = ({ action, info, children, dispatch }) => {
    return (
        <div
            className="button btn btn-danger"
            onClick={(e) => {
                e.preventDefault()
                dispatch(action(info))
            }
        }>
            {children}
        </div>
    )
};

ActionButton = connect()(ActionButton);

export default ActionButton
