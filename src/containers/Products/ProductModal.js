import React from 'react'
import { connect } from 'react-redux'

import ProductForm from './ProductForm'
import Modal from '../Global/Modal'

const mapStateToProps = (state, ownProps) => ({
});

class ProductsListComponent extends React.Component
{
    constructor(props)
    {
        super(props)

        this.productForm = null;

        this.state = {
            showModal: false
        }
    }

    updateModalVisility(visible="hidden")
    {
        let state = this.state;
        state.showModal = ("hidden" === visible ? false : true);
        this.setState(state);
    }

    submitHandler(event)
    {
        let product = this.props.edit === "true"
            ? this.productForm.getProduct(this.props.product._id)
            : this.productForm.getProduct()
        ;

        this.props.dispatch(this.props.submitHandler(
            product,
            (product) => {
                this.updateModalVisility('hidden');
            },
            (error) => {
                this.productForm.setError(error);
            }
        ));
    }

    render()
    {
        return (
            <span>
                <button
                    className={this.props.buttonClass ? this.props.buttonClass : "btn btn-xs btn-success"}
                    onClick={(e) => {
                        e.preventDefault();
                        this.updateModalVisility('visible');
                    }}
                >
                    <span className={this.props.buttonIcon}></span>
                    {" "}
                    {this.props.buttonLabel}
                </button>
                {
                    (this.state.showModal)
                        ? (
                            <Modal
                                title={this.props.modalTitle}
                                close={this.props.modalClose}
                                confirm={this.props.modalConfirm}
                                closeHandler={(e) => {
                                    this.updateModalVisility('hidden');
                                }}
                                confirmHandler={(e) => {
                                    this.submitHandler();
                                }}
                            >
                                <ProductForm
                                    ref={node => {this.productForm = node}}
                                    product={this.props.product ? this.props.product : false}
                                    submitHandler={(e) => {
                                        this.submitHandler();
                                    }}
                                />
                            </Modal>
                        )
                        : null
                }
            </span>
        );
    }
}

var ProductsList = connect(mapStateToProps)(ProductsListComponent);

export default ProductsList
