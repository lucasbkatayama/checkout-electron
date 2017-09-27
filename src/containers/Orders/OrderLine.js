import React from 'react'
import moment from 'moment'

import ButtonTriggeredModal from '../Global/ButtonTriggeredModal'
import OrderLineInvoiceForm from './OrderLineInvoiceForm'

class OrderLine extends React.Component
{
    constructor(props)
    {
        super(props)
        this.invoiceForm = null;
    }

    render()
    {
        return (
            <tr>
                <td>{moment(this.props.line.date).locale('fr').format('DD MMMM YYYY HH:mm:ss')}</td>
                <td>{this.props.line.lines && this.props.line.lines.length}</td>
                <td className="text-right">{
                    this.props.line.cashFund == 1
                        ? 'Fond de caisse : '+ parseFloat(this.props.line.payments[0].amount).toFixed(2)
                        : this.props.line.total && this.props.line.total.toFixed(2)
                }
                &euro;</td>
                <td>
                    <ButtonTriggeredModal
                        buttonLabel="Demande de facture"
                        buttonIcon="glyphicon glyphicon-plus"
                        modalTitle="Demande de facture"
                        modalClose="Fermer"
                        modalConfirm="Valider"
                        confirmHandler={function(modale) {
                            this.invoiceForm.submitHandler(() => {
                                modale.updateModalVisility('hidden');
                            });
                        }.bind(this)}
                    >
                        <OrderLineInvoiceForm
                            ref={node => {this.invoiceForm = node}}
                            order={this.props.line}
                        />
                    </ButtonTriggeredModal>
                </td>
            </tr>
        );
    }
}

export default OrderLine
