import '../App.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import React, { Component } from "react";
import AddCarmodel from "./AddCarmodel";

class CarViewerModal extends React.Component {
  constructor(props) {
      super(props);
      this.state = {

      };
  }

  render() {

      return (
        <div>
        <button
          type="button"
          className="btn btn-primary"
          id="add_btn"
          data-toggle="modal"
          data-target="#CarViewerModal"
        >
          Lägg till en ny bilmodell
        </button>
        <div
          className="modal fade"
          id="CarViewerModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="CarViewerModalModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="CarViewerModalModalLabel">
                  Lägg till en ny bilmodell
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <AddCarmodel addModel={this.props.addModel}/>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Stäng fönstret
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
  }
}

export default CarViewerModal;