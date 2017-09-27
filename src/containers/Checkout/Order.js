import React from 'react'

import OrderLines from './OrderLines'
import CurrentOrderStatus from './CurrentOrderStatus'
import OrderTotal from './OrderTotal'
import OrderTotalToPay from './OrderTotalToPay'
import OrderPayments from './OrderPayments'
import OrderFooter from './OrderFooter'
import EanSearchForm from './EanSearchForm'

const Order = () => {
    return (
        <table className="table table-striped">
            <caption className="text-center">
                Nouvelle commande
                {" "}
                <CurrentOrderStatus />
            </caption>
            <thead>
                <tr>
                    <th>EAN</th>
                    <th>Produit</th>
                    <th>Prix</th>
                    <th>&shy;</th>
                </tr>
            </thead>
            <OrderLines />
            <tbody>
                <tr style={{ 'fontWeight': 'bold', 'fontSize': '1.3em' }}>
                    <td className="text-right" colSpan="2">Total :</td>
                    <td className="text-right">
                        <OrderTotal />
                    </td>
                    <td>&shy;</td>
                </tr>
            </tbody>
            <OrderPayments />
            <tfoot>
                <tr style={{ 'fontWeight': 'bold', 'fontSize': '1.3em' }}>
                    <td className="text-right" colSpan="2">Reste à payer :</td>
                    <td className="text-right">
                        <OrderTotalToPay />
                    </td>
                    <td>&shy;</td>
                </tr>
                <tr>
                    <td colSpan="4" className="text-center">
                        <EanSearchForm />
                    </td>
                </tr>
                <OrderFooter />
            </tfoot>
        </table>
    );
}

export default Order
