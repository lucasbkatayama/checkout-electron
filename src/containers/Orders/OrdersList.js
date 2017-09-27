import React from 'react'
import { connect } from 'react-redux'
import Papa from 'papaparse'
import fileDownload from 'react-file-download'
import moment from 'moment'

import OrderLine from './OrderLine'
import { loadOrdersList, deleteAllOrders } from '../../actions'

const mapStateToProps = (state, ownProps) => ({
  lines: state.ordersListLines
});

class OrdersListComponent extends React.Component
{
    componentDidMount()
    {
        if (this.props.lines.length == 0)
        {
            this.props.dispatch(loadOrdersList());
        }
    }

    getFlatOrders()
    {
        let flatOrders = [];
        this.props.lines.map((order) => {
            if (order.lines) {
                order.lines.map((line) => {
                    flatOrders.push({
                        id: order._id,
                        date: order.date,
                        total: order.total,
                        type: 'PRODUCT',
                        ean: line.ean,
                        name: line.name,
                        category: line.category,
                        price: line.price,
                        invoiceInformations: order.invoiceInformations ? order.invoiceInformations : null
                    });
                });
            }
            if (order.payments) {
                order.payments.map((payment) => {
                    flatOrders.push({
                        id: order._id,
                        date: order.date,
                        total: order.total,
                        type: 'PAIEMENT',
                        ean: null,
                        name: payment.label,
                        category: payment.type,
                        price: payment.amount,
                        invoiceInformations: order.invoiceInformations ? order.invoiceInformations : null
                    });
                });
            }
        });

        return flatOrders;
    }

    render()
    {
        let total     = 0;
        let linesList = this.props.lines.map((line, key) => {
            if (!isNaN(line.total)) {
                total += parseFloat(line.total);
            }

            return (
                <OrderLine key={key} line={line} />
            )
        });

        return (
            <div className="row">
                <div className="col-md-6" style={{ padding: '0 25px' }}>
                    <h2>Commandes</h2>
                </div>
                <div className="col-md-6 text-right" style={{ padding: '0 25px' }}>
                    <button
                        className="btn btn-xs btn-success"
                        onClick={(e) => {
                            e.preventDefault();

                            let csv = Papa.unparse(
                                this.getFlatOrders(),
                                {
                                	quotes: true,
                                	quoteChar: '"',
                                	delimiter: ";",
                                	header: true,
                                	newline: "\r\n"
                                }
                            );
                            fileDownload(csv, 'orders--'+moment().locale('fr').format("YYYY-MM-DD--HH-mm-ss")+'.csv');
                        }}
                    >
                        <span className="glyphicon glyphicon-floppy-disk"></span>
                        {" "}
                        Exporter les commandes
                    </button>
                    {" "}
                    <button
                        className="btn btn-xs btn-danger"
                        onClick={(e) => {
                            e.preventDefault();
                            this.props.dispatch(deleteAllOrders())
                        }}
                    >
                        <span className="glyphicon glyphicon-remove"></span>
                        {" "}
                        Tout supprimer
                    </button>
                </div>
                <div className="col-md-12" >

                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Nb lignes</th>
                                <th>Montant</th>
                                <th>TOTAL : {total.toLocaleString()} €</th>
                            </tr>
                        </thead>
                        <tbody>
                            {linesList}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

var OrdersList = connect(mapStateToProps)(OrdersListComponent);

export default OrdersList
