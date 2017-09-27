import React from 'react'

import Modal from './Modal';

class ButtonTriggeredModal extends React.Component
{
    constructor(props)
    {
        super(props)

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
                                    this.props.confirmHandler(this);
                                }}
                            >
                                {this.props.children}
                            </Modal>
                        )
                        : null
                }
            </span>
        );
    }
}

export default ButtonTriggeredModal
