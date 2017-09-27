import React from 'react'
import { connect } from 'react-redux'
import smalltalk from 'smalltalk'

import { setOrUpdateRefillConfig, getAllProducts } from '../../actions'

class ConfigComponent extends React.Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            categories: []
        }
    }

    componentDidMount()
    {
        getAllProducts().then((products) => {
            let categories = [];
            products.map((product) => {
                if (-1 == categories.indexOf(product.category)) {
                    categories.push(product.category);
                }
            });

            let state = this.state;
            state.categories = categories;
            this.setState(state);
        }).catch((error) => {
            smalltalk.alert('Technical error', error);
        })
    }

    render()
    {
        let categories = this.state.categories.map((category) => {
            return (<option key={category} value={category}>{category}</option>);
        });

        return (
            <div>
                <label htmlFor="categories">Catégories</label><br />
                <select id="categories" multiple="multiple" className="form-control"
                    onChange={(e) => {
                        let options = e.target.options;
                        let value = [];
                        for (var i = 0, l = options.length; i < l; i++) {
                            if (options[i].selected) {
                                value.push(options[i].value);
                            }
                        }

                        this.props.dispatch(setOrUpdateRefillConfig('categories', value))
                    }}
                >
                    {categories}
                </select>
            </div>
        );
    }
}

var Config = connect()(ConfigComponent);

export default Config
