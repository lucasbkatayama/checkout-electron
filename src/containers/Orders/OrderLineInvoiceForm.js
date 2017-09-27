import React from 'react'

import { saveInvoiceInformationsForOrder } from '../../actions'

class OrderLineInvoiceForm extends React.Component
{
    constructor(props)
    {
        super(props)

        this.input = null;

        this.state = {
            error: null
        };
    }

    setError(error)
    {
        let state = this.state;
        state.error = error;
        this.setState(state);
    }

    submitHandler(parentCallback)
    {
        this.props.order.invoiceInformations = this.input.value;

        saveInvoiceInformationsForOrder(
            this.props.order,
            parentCallback,
            (errorMessage) => {
                this.setError(errorMessage);
            }
        );
    }

    render()
    {
        return (
            <form onSubmit={(e) => { e.preventDefault(); this.props.submitHandler() }}>
                {
                    this.state.error
                        ? (<div className="alert alert-danger">{this.state.error}</div>)
                        : null
                }
                <div className="form-group">
                    <label htmlFor="informations">Informations pour la facture :</label>
                    <textarea className="form-control" id="informations"
                        rows="8"
                        ref={node => {this.input = node}}
                        defaultValue={this.props.order.invoiceInformations || "Nom : \nPrénom : \nEmail : \nTéléphone : "}
                    ></textarea>
                    <p className="help-block" style={{ fontWeight: 'normal' }}>
                        À demander : nom, prénom, email, téléphone
                    </p>
                </div>
            </form>
        );
    }
}

export default OrderLineInvoiceForm
