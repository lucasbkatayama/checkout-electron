import React from 'react'
import { connect } from 'react-redux'
import { orderAddLineFromEan } from '../../actions'

const mapStateToProps = (state, ownProps) => ({
    status: state.orderStatus,
    lines: state.orderLines
});

class EanSearchFormComponent extends React.Component
{
    constructor(props)
    {
        super(props)

        this.manual = null;
        this.input = null;
        this.timer = null;
    }

    componentDidMount()
    {
        this.input.select();
    }

    componentWillUpdate(nextProps, nextState)
    {
        if (this.props.status == 'IN_PROGRESS' &&
            nextProps.lines.length == 0
        ){
            this.input.select();
        }
    }

    handleSubmit()
    {
        this.timer = null;

        if (!this.input.value.trim()) {
          return ;
        }

        this.props.dispatch(orderAddLineFromEan(this.input.value))
        this.input.value = '';
    }

    render()
    {
        return (
            <form
                className="col-md-6 col-md-offset-3"
                onSubmit={(e) => {
                    e.preventDefault()
                    this.handleSubmit();
                }}
            >
                <div className="input-group input-group-md">
                    <span className="input-group-addon" id="sizing-addon1">
                        <span className="glyphicon glyphicon-search"></span>
                    </span>
                    <input type="text" className="form-control" placeholder="EAN"
                        aria-describedby="sizing-addon1"
                        ref={node => {this.input = node}}
                        onChange={(e) => {
                            e.preventDefault();

                            if (!this.manual.checked) {
                                this.timer = setTimeout(() => {
                                    this.handleSubmit();
                                }, 300);
                            }
                        }}
                    />
                    <span className="input-group-btn">
                        <input type="submit" className="btn btn-success" type="button" value="Go!"
                            onClick={(e) => {
                                e.preventDefault()
                                if (!this.input.value.trim()) {
                                  return ;
                                }
                                this.props.dispatch(orderAddLineFromEan(this.input.value))
                                this.input.value = ''
                            }}
                         />
                    </span>
                </div>
                <div class="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            ref={node => {this.manual = node}}
                        />
                        Saisie manuelle
                    </label>
                </div>
            </form>
        );
    }
}

let EanSearchForm = connect(mapStateToProps)(EanSearchFormComponent);

export default EanSearchForm
