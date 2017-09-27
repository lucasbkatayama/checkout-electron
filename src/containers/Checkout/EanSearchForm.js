import React from 'react'
import { connect } from 'react-redux'
import { orderAddLineFromEan } from '../../actions'

class EanSearchFormComponent extends React.Component
{
    constructor(props)
    {
        super(props)

        this.input = null;
    }

    componentDidMount()
    {
        this.input.select();
    }

    render()
    {
        return (
            <form
                className="col-md-6 col-md-offset-3"
                onSubmit={(e) => {
                    e.preventDefault()
                    if (!this.input.value.trim()) {
                      return ;
                    }
                    this.props.dispatch(orderAddLineFromEan(this.input.value))
                    this.input.value = ''
                }}
            >
                <div className="input-group input-group-md">
                    <span className="input-group-addon" id="sizing-addon1">
                        <span className="glyphicon glyphicon-search"></span>
                    </span>
                    <input type="text" className="form-control" placeholder="EAN"
                        aria-describedby="sizing-addon1"
                        ref={node => {this.input = node}}
                    />
                    <span className="input-group-btn">
                        <input type="submit" className="btn btn-success" type="button" value="Go!" />
                    </span>
                </div>
            </form>
        );
    }
}

let EanSearchForm = connect()(EanSearchFormComponent);

export default EanSearchForm
