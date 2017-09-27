import React from 'react'
import { connect } from 'react-redux'
import { updateOrderStatus, saveCurrentOrder, orderReturn } from '../../actions'
import PaymentMethod from './PaymentMethod'

const mapStateToProps = (state, ownProps) => ({
    status: state.orderStatus,
    lines: state.orderLines,
    totalToPay: state.orderTotalToPay
});

let OrderFooter = ({ status, lines, totalToPay, dispatch }) => {
    switch (status)
    {
        case 'IN_PROGRESS':
            if (0 < lines.length) {
                const isntFinished = 0.01 < parseFloat(totalToPay.toFixed(2));
                return (
                    <tr>
                        <td colSpan="4" className="text-center">
                            <button className="btn btn-success" id="test" onClick={(e) => {
                                e.preventDefault();
                                if (isntFinished) {
                                    dispatch(updateOrderStatus('PAYMENT_IN_PROGRESS'));
                                } else {
                                    dispatch(saveCurrentOrder());
                                }
                            }}>
                                { isntFinished ? 'Encaisser' : 'Clore la commande' }
                            </button>
                            {" "}
                            <button className="btn btn-danger" id="test" onClick={(e) => {
                                e.preventDefault();
                                dispatch(orderReturn());
                            }}>
                                Éffectuer un retour
                            </button>
                        </td>
                    </tr>
                );
            } else {
                return null;
            }
        case 'PAYMENT_IN_PROGRESS':
            return (
                <tr>
                    <td colSpan="4" className="text-center">
                        <button className="btn btn-success" onClick={(e) => {
                            e.preventDefault();
                            dispatch(updateOrderStatus('PAY_BY_CASH'));
                        }}>ESPÈCE</button>
                        {" "}
                        <button className="btn btn-success" onClick={(e) => {
                            e.preventDefault();
                            dispatch(updateOrderStatus('PAY_BY_CREDIT_CARD'));
                        }}>CB</button>
                        {" "}
                        <button className="btn btn-success" onClick={(e) => {
                            e.preventDefault();
                            dispatch(updateOrderStatus('PAY_BY_CHECK'));
                        }}>CHÈQUE</button>
                    </td>
                </tr>
            );
        case 'PAY_BY_CASH':
            return (
                <tr>
                    <td colSpan="4" className="text-center">
                        <PaymentMethod type="CASH" label="Espèce" withReturn="true" />
                        <br />
                        <button className="btn btn-danger" onClick={(e) => {
                            e.preventDefault();
                            dispatch(updateOrderStatus('IN_PROGRESS'));
                        }}>Annuler</button>
                    </td>
                </tr>
            );
        case 'PAY_BY_CREDIT_CARD':
            return (
                <tr>
                    <td colSpan="4" className="text-center">
                        <PaymentMethod type="CARD" label="Carte bancaire" />
                        <br />
                        <button className="btn btn-danger" onClick={(e) => {
                            e.preventDefault();
                            dispatch(updateOrderStatus('IN_PROGRESS'));
                        }}>Annuler</button>
                    </td>
                </tr>
            );
        case 'PAY_BY_CHECK':
            return (
                <tr>
                    <td colSpan="4" className="text-center">
                        <PaymentMethod type="CHECK" label="Chêque" />
                        <br />
                        <button className="btn btn-danger" onClick={(e) => {
                            e.preventDefault();
                            dispatch(updateOrderStatus('IN_PROGRESS'));
                        }}>Annuler</button>
                    </td>
                </tr>
            );
        default:
            return (
                <tr>
                    <td colSpan="4" className="text-center">ERROR</td>
                </tr>
            );
    }
}

OrderFooter = connect(mapStateToProps)(OrderFooter);

export default OrderFooter
