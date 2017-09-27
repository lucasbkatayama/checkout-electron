import React from 'react'
import { connect } from 'react-redux'
import Papa from 'papaparse'
import fileDownload from 'react-file-download'
import moment from 'moment'

import ProductLine from './ProductLine'
import ProductModal from './ProductModal'
import ProductsUpload from './ProductsUpload'
import { loadProductsList, saveNewProduct, deleteAllProducts } from '../../actions'

const mapStateToProps = (state, ownProps) => ({
  lines: state.productLines
});

class ProductsListComponent extends React.Component
{
    componentDidMount()
    {
        if (this.props.lines.length == 0)
        {
            this.props.dispatch(loadProductsList());
        }
    }

    render()
    {
        let linesList = this.props.lines.map((line, key) => {
            return (
                <ProductLine key={key} line={line} />
            )
        });

        return (
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Catégorie</th>
                        <th>EAN</th>
                        <th>Nom</th>
                        <th>Prix</th>
                        <th>
                            <ProductModal
                                buttonLabel="Ajouter"
                                buttonIcon="glyphicon glyphicon-plus"
                                modalTitle="Ajouter un produit"
                                modalClose="Fermer"
                                modalConfirm="Ajouter"
                                edit="false"
                                submitHandler={saveNewProduct}
                            />
                            {" "}
                            <ProductsUpload />
                            {" "}
                            <button
                                className="btn btn-xs btn-success"
                                onClick={(e) => {
                                    e.preventDefault();
                                    let csv = Papa.unparse(
                                        this.props.lines,
                                        {
                                        	quotes: true,
                                        	quoteChar: '"',
                                        	delimiter: ";",
                                        	header: true,
                                        	newline: "\r\n"
                                        }
                                    );
                                    fileDownload(csv, 'products--'+moment().locale('fr').format("YYYY-MM-DD--HH-mm-ss")+'.csv');
                                }}
                            >
                                <span className="glyphicon glyphicon-floppy-disk"></span>
                                {" "}
                                Exporter
                            </button>
                            {" "}
                            <button
                                className="btn btn-xs btn-danger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.props.dispatch(deleteAllProducts())
                                }}
                            >
                                <span className="glyphicon glyphicon-remove"></span>
                                {" "}
                                Tout supprimer
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {linesList}
                </tbody>
            </table>
        );
    }
}

var ProductsList = connect(mapStateToProps)(ProductsListComponent);

export default ProductsList
