import React from 'react'

class Modal extends React.Component
{
    render()
    {
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{'display':'block'}}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="{this.props.close}"
                                onClick={function() { this.props.closeHandler() }.bind(this)}
                            ><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal"
                                onClick={function() { this.props.closeHandler() }.bind(this)}
                            >{this.props.close}</button>
                            {
                                this.props.confirm
                                    ? (
                                        <button type="button" className="btn btn-primary"
                                            onClick={function() { this.props.confirmHandler() }.bind(this)}
                                        >{this.props.confirm}</button>
                                    )
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal
