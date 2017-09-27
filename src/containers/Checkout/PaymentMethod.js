import React from 'react'
import { connect } from 'react-redux'
import OrderTotalToPay from './OrderTotalToPay'
import { paymentAddLine, updateOrderStatus } from '../../actions'

const mapStateToProps = (state, ownProps) => ({
  totalToPay: state.orderTotalToPay
});

class PaymentMethodComponent extends React.Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            'amount': parseFloat(this.props.totalToPay).toFixed(2)
        }
    }

    componentDidMount()
    {
        this.input.select();
    }

    handleChange(event)
    {
        var value = parseFloat(event.target.value) + 0;
        if (isNaN(value) || 0 === value) {
            value = '';
        }
        this.setState({
            'amount': value
        });
    }

    handleSubmit(e)
    {
        e.preventDefault();
        if (0 < this.getPaidAmount()) {
            this.props.dispatch(paymentAddLine({
                'type': this.props.type,
                'label': this.props.label+' (Reçu : '+parseFloat(this.state.amount).toFixed(2)+' €)',
                'amount': this.getPaidAmount()
            }));
            this.props.dispatch(updateOrderStatus(
                parseFloat(this.props.totalToPay.toFixed(2)) - this.getPaidAmount() > 0
                    ? 'PAYMENT_IN_PROGRESS'
                    : 'IN_PROGRESS'
            ));
        }
    }

    getPaidAmount()
    {
        return parseFloat((this.state.amount > this.props.totalToPay)
            ? this.props.totalToPay
            : this.state.amount
        );
    }

    render() {

        var returnBlock = '';
        if (this.props.withReturn) {
            var toGiveBack = this.state.amount - this.props.totalToPay;
            if (toGiveBack < 0) {
                toGiveBack = 0;
            }

            returnBlock = (
                <span style={{ 'fontSize': '2em', 'fontWeight': 'bold' }}>
                    A RENDRE :&nbsp;
                    <span style={{ 'color': 'green' }}>
                    {toGiveBack.toFixed(2)} &euro;
                    </span><br/>
                    <br />
                </span>
            )
        }

        return (
            <form onSubmit={this.handleSubmit.bind(this)} className="text-center">
                <span style={{ 'fontSize': '2em', 'fontWeight': 'bold', 'textTransform': 'uppercase' }}>
                    {this.props.label}
                </span><br />
                <br />
                <span style={{ 'fontSize': '1.3em', 'fontWeight': 'bold' }}>
                    TOTAL A PAYER :{" "}
                    <span style={{ 'color': 'red' }}>
                        <OrderTotalToPay />
                    </span>
                </span><br/>
                <br />
                <label>
                    Montant payé :
                    {" "}
                    <input
                        type="text"
                        className="text-right"
                        ref={node => {this.input = node}}
                        defaultValue={this.state.amount}
                        onChange={this.handleChange.bind(this)}
                    /> &euro;
                </label><br/>

                {returnBlock}

                <button
                    onClick={this.handleSubmit.bind(this)}
                    className="btn btn-success"
                >
                    VALIDER
                </button>
            </form>
        );
    }
}

let PaymentMethod = connect(mapStateToProps)(PaymentMethodComponent);

export default PaymentMethod
