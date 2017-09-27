import React from 'react'
import Papa from 'papaparse'
import { connect } from 'react-redux'
import smalltalk from 'smalltalk'

import Modal from '../Global/Modal'
import { saveNewProduct, refreshProductsList } from '../../actions'

const mapStateToProps = (state, ownProps) => ({
});

class ProductsUploadComponent extends React.Component
{
    constructor(props)
    {
        super(props)

        this.importedFile = null;

        this.state = {
            showModal: false,
            inProgress: false,
            countLines: 0,
            countImportedLines: 0
        }
    }

    updateModalVisility(visible)
    {
        let state = this.state;
        state.showModal = ("hidden" === visible ? false : true);
        this.setState(state);
    }

    toggleProgress(visible)
    {
        let state = this.state;
        state.inProgress = !state.inProgress;
        this.setState(state);
    }

    setCountLines(count)
    {
        let state = this.state;
        state.countLines = count;
        this.setState(state);
    }

    setCountImportedLines(count)
    {
        let state = this.state;
        state.countImportedLines = count;
        this.setState(state);
    }

    incrementCountImportedLines(count)
    {
        let state = this.state;
        state.countImportedLines ++;
        this.setState(state);
    }

    submitHandler(e)
    {
        e.preventDefault();

        var component = this;
        var dispatch = this.props.dispatch;

        Papa.parse(this.importedFile[0], {
            header: true,
            skipEmptyLines: true,
            complete: function(results, file)
            {
                if (results.errors.length > 0) {
                    smalltalk.alert('Erreur', 'Le fichier n\'est pas valide (CSV seulement)');
                } else {
                    component.setCountLines(results.data.length);
                    component.setCountImportedLines(0);
                    component.toggleProgress();
                    results.data.map(function(item) {
                        dispatch(saveNewProduct(
                            item,
                            (product) => {
                                component.incrementCountImportedLines();
                                if (component.state.countImportedLines >= component.state.countLines) {
                                    dispatch(refreshProductsList());
                                }
                            },
                            (error) => {
                                smalltalk.alert('Erreur', 'Erreur sur le produit EAN <'+item.ean+'> : '+"\n"+error);
                                component.incrementCountImportedLines();
                                if (component.state.countImportedLines >= component.state.countLines) {
                                    dispatch(refreshProductsList());
                                }
                            },
                            true
                        ));
                    });
                }
            }
        });
    }

    handleChange(event)
    {
        this.importedFile = event.target.files;
    }

    render()
    {
        var percent = 0;
        if (this.state.inProgress) {
            percent = (this.state.countImportedLines * 100 / this.state.countLines).toFixed(2);
        }

        return (
            <span>
                <button
                    className="btn btn-xs btn-success"
                    onClick={(e) => {
                        e.preventDefault();
                        this.updateModalVisility('visible');
                    }}
                >
                    <span className="glyphicon glyphicon-file"></span>
                    {" "}
                    Importer
                </button>
                {
                    (this.state.showModal)
                        ? (
                            <Modal
                                title="Importer un fichier CSV de produits"
                                close="Fermer"
                                closeHandler={(e) => {
                                    this.updateModalVisility('hidden');
                                }}
                            >
                                {
                                    this.state.inProgress
                                        ? (
                                            <div className="text-center">
                                                <h5>IMPORT EN COURS</h5>
                                                <div className="progress">
                                                    <div className="progress-bar" role="progressbar"
                                                        aria-valuenow="{this.state.countImportedLines}"
                                                        aria-valuemin="0"
                                                        aria-valuemax="{this.state.countLines}"
                                                        style={{ width: percent+'%'}}
                                                    >
                                                        <span className="sr-only">{percent}% Complete</span>
                                                    </div>
                                                </div>
                                                {this.state.countImportedLines} / {this.state.countLines}
                                                <br />
                                                <br />
                                                {
                                                    this.state.countImportedLines >= this.state.countLines
                                                    ? (
                                                        <button
                                                            className="btn btn-success"
                                                            onClick={(e) => { this.toggleProgress() }}
                                                        >
                                                            OK
                                                        </button>
                                                    )
                                                    : null
                                                }
                                            </div>
                                        )
                                        : (
                                            <form onSubmit={(e) => { this.submitHandler(e) }}>
                                                <div className="form-group">
                                                    <label htmlFor="csvImportFile">Fichier CSV seulement</label>
                                                    <input type="file" id="csvImportFile"
                                                        onChange={this.handleChange.bind(this)}
                                                    />
                                                    <p className="help-block" style={{ fontWeight: 'normal' }}>
                                                        Format: <em>ean,category,name,price</em>, entête nécessaire
                                                    </p>
                                                </div>
                                                <input type="submit"
                                                    className="btn btn-success"
                                                    onClick={(e) => { this.submitHandler(e) }}
                                                    value="Envoyer"
                                                />
                                            </form>
                                        )
                                }
                            </Modal>
                        )
                        : null
                }
            </span>
        )
    }
}

var ProductsUpload = connect(mapStateToProps)(ProductsUploadComponent);


export default ProductsUpload
