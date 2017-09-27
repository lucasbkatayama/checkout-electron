import React from 'react'

class ProductForm extends React.Component
{
    constructor(props)
    {
        super(props)

        this.inputCategory = null;
        this.inputEan = null;
        this.inputName = null;
        this.inputPrice = null;
        this.inputPictureUrl = null;
        this.inputShortcut = null;

        var product = this.props.product
            ? this.props.product
            : {
                category: '',
                ean: '',
                name: '',
                price: ''
            }
        ;

        this.state = {
            product: product,
            error: null
        };
    }

    getProduct (id)
    {
        return {
            _id:        id,
            category:   this.inputCategory.value,
            ean:        this.inputEan.value,
            name:       this.inputName.value,
            price:      parseFloat(this.inputPrice.value),
            pictureUrl: this.inputPictureUrl.value,
            shortcut:   this.inputShortcut.checked,
        }
    }

    setError(error)
    {
        let state = this.state;
        state.error = error;
        this.setState(state);
    }

    render()
    {
        return (
            <form onSubmit={(e) => { e.preventDefault(); this.props.submitHandler() }}>
                {
                    this.state.error
                        ? (<div className="alert alert-danger">{this.state.error}</div>)
                        : null
                }
                <div className="form-group">
                    <label htmlFor="category">Catégorie</label>
                    <input type="text" className="form-control" id="category" placeholder="Catégorie"
                        ref={node => {this.inputCategory = node}}
                        defaultValue={this.state.product.category} />
                </div>
                <div className="form-group">
                    <label htmlFor="ean">EAN</label>
                    <input type="text" className="form-control" id="ean" placeholder="EAN (123456789123456)"
                        ref={node => {this.inputEan = node}}
                        defaultValue={this.state.product.ean} />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Nom</label>
                    <input type="text" className="form-control" id="name" placeholder="Nom"
                        ref={node => {this.inputName = node}}
                        defaultValue={this.state.product.name} />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Prix</label>
                    <input type="numeric" className="form-control" id="price" placeholder="Prix"
                        ref={node => {this.inputPrice = node}}
                        defaultValue={this.state.product.price} />
                </div>
                <div className="form-group">
                    <label htmlFor="pictureUrl">Photo (Url)</label>
                    <input type="text" className="form-control" id="pictureUrl" placeholder="http://...."
                        ref={node => {this.inputPictureUrl = node}}
                        defaultValue={this.state.product.pictureUrl} />
                </div>
                <div className="form-group">
                    <label htmlFor="shortcut">
                        <input type="checkbox" id="shortcut"
                            ref={node => {this.inputShortcut = node}}
                            defaultChecked={this.state.product.shortcut} />
                        {" "}
                        Mettre en raccourci
                    </label>
                </div>
                <input type="submit" style={{ display: 'none' }} />
            </form>
        );
    }
}

export default ProductForm
