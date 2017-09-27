import React from 'react'
import { connect } from 'react-redux'

import ProductModal from './ProductModal'
import ProductForm from './ProductForm'
import Modal from '../Global/Modal'
import { saveUpdateProduct, removeProduct, orderAddLineFromEan } from '../../actions'

const mapStateToProps = (state, ownProps) => ({
});

class ProductLineComponent extends React.Component
{
    constructor(props)
    {
        super(props)

        this.productForm = null;

        this.state = {
            'showEditModal': false
        }
    }

    updateEditModalVisility(visible="hidden")
    {
        let state = this.state;
        state.showEditModal = ("hidden" === visible ? false : true);
        this.setState(state);
    }

    productUpdateHandler(event)
    {
        this.props.dispatch(saveUpdateProduct(
            this.productForm.getProduct(this.props.line._id),
            (product) => {
                this.updateEditModalVisility('hidden');
            },
            (error) => {
                this.productForm.setError(error);
            }
        ));
    }

    render()
    {
        return(
            <tr>
                <td>{this.props.line.category}</td>
                <td>{this.props.line.ean}</td>
                <td>{this.props.line.name}</td>
                <td className="text-right">{parseFloat(this.props.line.price).toFixed(2)} &euro;</td>
                <td>
                    <ProductModal
                        buttonLabel="Modifier"
                        buttonIcon="glyphicon glyphicon-edit"
                        buttonClass="btn btn-xs btn-warning"
                        modalTitle="Modifier un produit"
                        modalClose="Fermer"
                        modalConfirm="Modifier"
                        edit="true"
                        submitHandler={saveUpdateProduct}
                        product={this.props.line}
                    />
                    {" "}
                    <button
                        className="btn btn-xs btn-danger"
                        onClick={(e) => {
                            this.props.dispatch(removeProduct(this.props.line._id));
                        }}
                    >
                        <span className="glyphicon glyphicon-remove"></span>
                        {" "}
                        Supprimer
                    </button>
                    {" "}
                    <button
                        className="btn btn-xs btn-success"
                        onClick={(e) => {
                            this.props.dispatch(orderAddLineFromEan(this.props.line.ean));
                        }}
                    >
                        <span className="glyphicon glyphicon-plus"></span>
                        {" "}
                        Ajouter à la commande
                    </button>
                </td>
            </tr>
        );
    }
}

var ProductLine = connect(mapStateToProps)(ProductLineComponent);

export default ProductLine
