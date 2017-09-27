import React from 'react'
import { connect } from 'react-redux'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import moment from 'moment'
import smalltalk from 'smalltalk'

import { getOrdersToClose, defineCashFund, markOrdersAsClosed } from '../../actions'

class ClosingComponent extends React.Component
{
    constructor(props)
    {
        super(props)

        this.moneyFields = [
            0.01, 0.02, 0.05, 0.1, 0.2, 0.5,
            1, 2, 5, 10, 20, 50, 100, 200, 500
        ];

        this.state = this.getDefaultState();
    }

    getDefaultState()
    {
        let state = {
            fields: [],
            orders: [],
            paymentsDetails: []
        }
        state.fields['card_count'] = 0;
        state.fields['check_count'] = 0;
        state.paymentsDetails['CASH']      = 0;
        state.paymentsDetails['CARD']      = 0;
        state.paymentsDetails['CHECK']     = 0;
        state.paymentsDetails['CASH_FUND'] = 0;

        return state;
    }

    componentDidMount()
    {
        getOrdersToClose().then((data) => {
            let state = this.state;
            state.orders = data;
            state.paymentsDetails = this.calculatePaymentDetails();
            this.setState(state);
        }).catch((error) => {
            smalltalk.alert('Technical error', error);
        });
    }

    updateField(field)
    {
        let state = this.state;
        state.fields[field.target.name] = field.target.value;
        this.setState(state);
    }

    calculatePaymentDetails()
    {
        let payments = [];
        payments['CASH']      = 0;
        payments['CARD']      = 0;
        payments['CHECK']     = 0;
        payments['CASH_FUND'] = 0;

        this.state.orders.map((order) => {
            if (order.payments) {
                order.payments.map((payment) => {
                    if (!payments[payment.type]) {
                        payments[payment.type] = 0;
                    }

                    payments[payment.type] += parseFloat(payment.amount);
                });
            }
        });

        return payments;
    }

    getField(name)
    {
        return (
            <input
                type="number"
                name={name}
                defaultValue={this.state.fields[name] ? this.state.fields[name] : ''}
                className="text-right"
                style={{ width: '100px' }}
                onChange={this.updateField.bind(this)}
            />
        )
    }

    generatePdf()
    {
        const input = document.getElementById('HTMLtoPDF');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'JPEG', 0, 0);
                pdf.save("cloture-"+moment().locale('fr').format("YYYY-MM-DD--HH-mm-ss")+".pdf");
            });
        ;
    }

    render()
    {
        let cardTotal = 0;
        let cardFields = [];
        for (let i = 0; i<this.state.fields['card_count']; ++i) {
            if (this.state.fields['card_'+i]) {
                cardTotal += parseFloat(this.state.fields['card_'+i]);
            }
            cardFields.push((
                <div key={i}>{this.getField('card_'+i)} €</div>
            ));
        }

        let checkTotal = 0;
        let checkFields = [];
        for (let i = 0; i<this.state.fields['check_count']; ++i) {
            if (this.state.fields['check_'+i]) {
                checkTotal += parseFloat(this.state.fields['check_'+i]);
            }
            checkFields.push((
                <div key={i}>{this.getField('check_'+i)} €</div>
            ));
        }

        let lineTotal  = 0;
        let moneyTotal = 0;
        let moneyLines = this.moneyFields.map((money) => {
            lineTotal = this.state.fields['money_'+money]
                ? this.state.fields['money_'+money] * money
                : 0
            ;

            moneyTotal += lineTotal;

            return (
                <tr key={money}>
                    <th>{money.toFixed(2)} €</th>
                    <td>{this.getField('money_'+money)}</td>
                    <td className="text-right">{lineTotal.toFixed(2)} €</td>
                </tr>
            )
        });

        let total = checkTotal + cardTotal + moneyTotal;

        let savedTotal = parseFloat(this.state.paymentsDetails['CASH'])
            + parseFloat(this.state.paymentsDetails['CASH_FUND'])
            + parseFloat(this.state.paymentsDetails['CARD'])
            + parseFloat(this.state.paymentsDetails['CHECK'])
        ;

        let diff = [];
        diff['CASH']  = moneyTotal - parseFloat(this.state.paymentsDetails['CASH']) - parseFloat(this.state.paymentsDetails['CASH_FUND']);
        diff['CARD']  = cardTotal - parseFloat(this.state.paymentsDetails['CARD']);
        diff['CHECK'] = checkTotal - parseFloat(this.state.paymentsDetails['CHECK']);
        diff['TOTAL'] = diff['CASH'] + diff['CARD'] + diff['CHECK'];
        return (
            <div>
                <div className="row" style={{ padding: '0 10px' }}>
                    <div className="col-md-6">
                        <h2>Clôture de caisse</h2>
                    </div>
                    <div className="col-md-6 text-right">
                        <button
                            className="btn btn-xs btn-success"
                            onClick={(e) => {
                                defineCashFund(function(amount) {
                                    let state = this.state;
                                    state.paymentsDetails['CASH_FUND'] = amount;
                                    this.setState(state);
                                }.bind(this));
                            }}
                        >
                            <span className="glyphicon glyphicon-piggy-bank"></span>
                            {" "}
                            Définir le fond de caisse
                        </button>
                        {" "}
                        <button
                            className="btn btn-xs btn-success"
                            onClick={(e) => { e.preventDefault(); this.generatePdf(); }}
                        >
                            <span className="glyphicon glyphicon-print"></span>
                            {" "}
                            Enregistrer en PDF
                        </button>
                        {" "}
                        <button
                            className="btn btn-xs btn-danger"
                            onClick={(e) => {
                                e.preventDefault();
                                if (confirm("Êtes vous sûrs de vouloir colturer ces commandes ?\n"+
                                    "Une fois colutré, il vous sera impossible de revenir à ces commandes.")
                                ) {
                                    this.generatePdf();
                                    markOrdersAsClosed(this.state.orders);
                                    this.setState(this.getDefaultState());
                                }
                            }}
                        >
                            <span className="glyphicon glyphicon-floppy-disk"></span>
                            {" "}
                            Finaliser la cloture
                        </button>
                    </div>
                </div>
                <div className="row" style={{ padding: '0 10px' }}>
                    <div className="col-md-5" id="HTMLtoPDF">
                        <h3>Encaissements</h3>

                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <td></td>
                                    <td className="text-right">Enregistré</td>
                                    <td className="text-right">Calculé</td>
                                    <td className="text-right">Écart</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>
                                        Espèces ({parseFloat(this.state.paymentsDetails['CASH']).toFixed(2)})
                                        +
                                        Fond de caisse ({parseFloat(this.state.paymentsDetails['CASH_FUND']).toFixed(2)})
                                    </th>
                                    <td className="text-right">{
                                        (parseFloat(this.state.paymentsDetails['CASH']) + parseFloat(this.state.paymentsDetails['CASH_FUND']))
                                        .toFixed(2)
                                    } €</td>
                                    <td className="text-right">{moneyTotal.toFixed(2)} €</td>
                                    <td className="text-right">{ diff['CASH'].toFixed(2) } €</td>
                                </tr>
                                <tr>
                                    <th>Cartes bancaires</th>
                                    <td className="text-right">{parseFloat(this.state.paymentsDetails['CARD']).toFixed(2)} €</td>
                                    <td className="text-right">{cardTotal.toFixed(2)} €</td>
                                    <td className="text-right">{ diff['CARD'].toFixed(2) } €</td>
                                </tr>
                                <tr>
                                    <th>Chèques</th>
                                    <td className="text-right">{parseFloat(this.state.paymentsDetails['CHECK']).toFixed(2)} €</td>
                                    <td className="text-right">{checkTotal.toFixed(2)} €</td>
                                    <td className="text-right">{ diff['CHECK'].toFixed(2) } €</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th className="text-right">TOTAL</th>
                                    <td className="text-right">{ savedTotal.toFixed(2) } €</td>
                                    <td className="text-right">{total.toFixed(2)} €</td>
                                    <td className="text-right">{ diff['TOTAL'].toFixed(2) } €</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="col-md-2">
                        <h5>Cartes bancaires <small>(tickets de collecte)</small></h5>
                        Nombre : {this.getField('card_count')}<br />
                        {cardFields}
                        <strong>TOTAL : </strong> {cardTotal.toFixed(2)} €<br/>
                        <hr />
                        <h5>Chèques</h5>
                        Nombre : {this.getField('check_count')}<br />
                        {checkFields}
                        <strong>TOTAL : </strong> {checkTotal.toFixed(2)} €<br/>
                    </div>
                    <div className="col-md-5">
                        <h5>Espèces</h5>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <td></td>
                                    <td>Qte</td>
                                    <td className="text-right">Total</td>
                                </tr>
                            </thead>
                            <tbody>
                                {moneyLines}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="2" className="text-right">TOTAL</th>
                                    <td className="text-right">{moneyTotal.toFixed(2)} €</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

var Closing = connect()(ClosingComponent);

export default Closing
