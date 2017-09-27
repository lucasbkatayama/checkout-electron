import React from 'react'
import { connect } from 'react-redux'
import smalltalk from 'smalltalk'

import Config from './Config'
import { getAllOrders, markLinesAdRefilled } from '../../actions'

const mapStateToProps = (state, ownProps) => ({
  refill: state.refill
});

class RefillComponent extends React.Component
{
    constructor(props)
    {
        super(props)

        this.variables = [];

        this.orders         = [];
        this.ordersToUpdate = [];
        this.linesToRefill  = [];
    }

    componentDidMount()
    {
        this.refreshOrders();
    }

    refreshOrders()
    {
        getAllOrders().then((orders) => {
            this.orders = orders;
        }).catch((error) => {
            smalltalk.alert('Technical error', error);
        });
    }

    updateVariables()
    {
        this.variables = [];
        this.props.refill.map((refillItem) => {
            this.variables[refillItem.variable] = refillItem.value;
        });
    }

    getOrderLines()
    {
        if (!this.variables.categories || this.variables.categories.join(',') == '') {
            return ;
        }

        let toUpdate       = false;
        let lines          = [];
        let ordersToUpdate = [];
        this.orders.map((order) => {
            toUpdate = false;
            if (order.lines) {
                order.lines.map((line) => {
                    if (!line.refilled && this.variables['categories'].indexOf(line.category) >= 0) {
                        toUpdate = true;

                        if (!lines[line.ean]) {
                            lines[line.ean] = {
                                product: line,
                                count: 0
                            };
                        }

                        lines[line.ean].count ++;
                    }
                });

                if (toUpdate) {
                    ordersToUpdate.push(order);
                }
            }
        });

        this.ordersToUpdate = ordersToUpdate;
        this.linesToRefill = lines;
    }

    render()
    {
        this.updateVariables();
        this.getOrderLines();

        let refillLines = [];
        for (let line in this.linesToRefill) {
            let product = this.linesToRefill[line].product;

            refillLines.push((
                <tr key={product.ean}>
                    <td>{this.linesToRefill[line].count}</td>
                    <td>{product.name}</td>
                    <td>{product.ean}</td>
                    <td>{product.category}</td>
                </tr>
            ));
        }

        return (
            <div className="row" style={{ padding: '0 10px' }}>
                <div className="col-md-10">
                    <h2>Refill</h2>
                    { !this.variables['categories']
                        ? "Merci de configurer le refill à droite"
                        : (
                            <div>
                                <h5>Catégories : {this.variables.categories.join(', ')}</h5>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Qty</th>
                                            <th>Nom</th>
                                            <th>EAN</th>
                                            <th>Catégorie</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {refillLines}
                                    </tbody>
                                </table>
                            </div>
                        )
                    }
                </div>
                <div className="col-md-2">
                    <Config />
                    <br />
                    <button
                        className="btn btn-xs btn-danger"
                        onClick={(e) => {
                            e.preventDefault();
                            smalltalk.confirm(
                                'Refill',
                                "Êtes vous sûrs de vouloir sauvegarder ce refill ?\n"+
                                    "Une fois sauvegardé, il vous sera impossible de revenir à ces lignes."
                            ).then(
                                () => {
                                    markLinesAdRefilled(this.ordersToUpdate, this.linesToRefill, () => {
                                        this.refreshOrders();
                                        this.setState({});
                                    });
                                },
                                () => {}
                            );
                        }}
                    >
                        <span className="glyphicon glyphicon-floppy-disk"></span>
                        {" "}
                        Sauvegarder ce refill
                    </button>
                </div>
            </div>
        );
    }
}

var Refill = connect(mapStateToProps)(RefillComponent);

export default Refill
