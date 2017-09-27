import React from 'react'
import { connect } from 'react-redux'

import ActionButton from './ActionButton'
import Order from './Order'
import ProductModal from '../Products/ProductModal'
import { orderAddLineFromEan, orderAddSpecialDiscountEuro, orderAddSpecialDiscountPercent, loadProductsList, saveNewProduct } from '../../actions'

const mapStateToProps = (state, ownProps) => ({
  products: state.productLines.filter((item) => { return item.shortcut; })
});

class CheckoutComponent extends React.Component
{
    componentDidMount()
    {
        if (this.props.products.length == 0)
        {
            this.props.dispatch(loadProductsList());
        }
    }

    render() {
        let productsList = this.props.products.map((item) => {
            return (
                <span key={item.ean}>
                    <div className="button btn btn-default col-lg-3 text-center"
                        onClick={(e) => { e.preventDefault(); this.props.dispatch(orderAddLineFromEan(item.ean)) }}
                        style={{ height: '120px' }}
                    >
                        {item.pictureUrl && (<span><img src={item.pictureUrl} alt={item.name} className="center-block img-responsive" style={{ maxHeight: '110px' }} /><br /></span>)}
                        <p style={{ position: 'absolute', left:'0', bottom:'-10px', right:0, whiteSpace: 'normal', textAlign: 'center', background: 'rgba(255, 255, 255, 0.85)' }}>{item.name}</p>
                    </div>
                    {" "}
                </span>
            )
        });

        return (
            <div className="row">
                <div className="col-lg-6">
                    <Order />
                </div>
                <div className="col-lg-6">
                    <div className="row">
                        <div className="button btn btn-danger"
                            onClick={(e) => { e.preventDefault(); this.props.dispatch(orderAddSpecialDiscountEuro()) }}
                        >
                            Remise en €
                        </div>
                        {" "}
                        <div className="button btn btn-danger"
                            onClick={(e) => { e.preventDefault(); this.props.dispatch(orderAddSpecialDiscountPercent()) }}
                        >
                            Remise en %
                        </div>
                        {" "}
                        <ProductModal
                            buttonLabel="Créer un produit"
                            buttonIcon="glyphicon glyphicon-plus"
                            buttonClass="btn btn-success"
                            modalTitle="Créer un produit"
                            modalClose="Fermer"
                            modalConfirm="Ajouter"
                            edit="false"
                            submitHandler={saveNewProduct}
                        />
                        <hr />
                        {productsList}
                    </div>
                </div>
            </div>
        );
    }
}

let Checkout = connect(mapStateToProps)(CheckoutComponent);

export default Checkout
