import React from 'react'
import { connect } from 'react-redux'
import { updateOrderStatus, saveCurrentOrder, orderReturn } from '../../actions'
import PaymentMethod from './PaymentMethod'
import mouseTrap from 'react-mousetrap';

const mapStateToProps = (state, ownProps) => ({
    status: state.orderStatus,
    lines: state.orderLines,
    totalToPay: state.orderTotalToPay
});

class OrderFooterComponent extends React.Component
{
    componentDidMount()
    {
        this.props.bindShortcut('1', () => {
            if (this.props.status == 'IN_PROGRESS' &&
                0 < this.props.lines.length &&
                0.01 < parseFloat(this.props.totalToPay.toFixed(2))
            ) {
                this.props.dispatch(updateOrderStatus('PAYMENT_IN_PROGRESS'));
            }
            return false;
        });
        this.props.bindShortcut('2', () => {
            if (this.props.status == 'IN_PROGRESS' &&
                0 < this.props.lines.length &&
                !(0.01 < parseFloat(this.props.totalToPay.toFixed(2)))
            ) {
                this.props.dispatch(saveCurrentOrder());
            }
            return false;
        });
        this.props.bindShortcut('3', () => {
            if (this.props.status == 'IN_PROGRESS' &&
                0 < this.props.lines.length
            ) {
                this.props.dispatch(orderReturn());
            }
            return false;
        });
        this.props.bindShortcut('4', () => {
            if (this.props.status == 'PAYMENT_IN_PROGRESS') {
                this.props.dispatch(updateOrderStatus('PAY_BY_CASH'));
            }
            return false;
        });
        this.props.bindShortcut('5', () => {
            if (this.props.status == 'PAYMENT_IN_PROGRESS') {
                this.props.dispatch(updateOrderStatus('PAY_BY_CREDIT_CARD'));
            }
            return false;
        });
        this.props.bindShortcut('6', () => {
            if (this.props.status == 'PAYMENT_IN_PROGRESS') {
                this.props.dispatch(updateOrderStatus('PAY_BY_CHECK'));
                return false;
            }
        });
    }

    render()
    {
        switch (this.props.status)
        {
            case 'IN_PROGRESS':
                if (0 < this.props.lines.length) {
                    const isntFinished = 0.01 < parseFloat(this.props.totalToPay.toFixed(2));
                    return (
                        <tr>
                            <td colSpan="4" className="text-center">
                                <button className="btn btn-success" id="test" onClick={(e) => {
                                    e.preventDefault();
                                    if (isntFinished) {
                                        this.props.dispatch(updateOrderStatus('PAYMENT_IN_PROGRESS'));
                                    } else {
                                        this.props.dispatch(saveCurrentOrder());
                                    }
                                }}>
                                    { isntFinished ? 'Encaisser (1)' : 'Clore la commande (2)' }
                                </button>
                                {" "}
                                <button className="btn btn-danger" id="test" onClick={(e) => {
                                    e.preventDefault();
                                    this.props.dispatch(orderReturn());
                                }}>
                                    Éffectuer un retour (3)
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
                                this.props.dispatch(updateOrderStatus('PAY_BY_CASH'));
                            }}>ESPÈCE (4)</button>
                            {" "}
                            <button className="btn btn-success" onClick={(e) => {
                                e.preventDefault();
                                this.props.dispatch(updateOrderStatus('PAY_BY_CREDIT_CARD'));
                            }}>CB (5)</button>
                            {" "}
                            <button className="btn btn-success" onClick={(e) => {
                                e.preventDefault();
                                this.props.dispatch(updateOrderStatus('PAY_BY_CHECK'));
                            }}>CHÈQUE (6)</button>
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
                                this.props.dispatch(updateOrderStatus('IN_PROGRESS'));
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
                                this.props.dispatch(updateOrderStatus('IN_PROGRESS'));
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
                                this.props.dispatch(updateOrderStatus('IN_PROGRESS'));
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
}

var OrderFooter = mouseTrap(connect(mapStateToProps)(OrderFooterComponent));

export default OrderFooter
