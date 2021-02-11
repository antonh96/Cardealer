import '../App.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from "react";

class Contact extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        employeesList: [],
      };
  }

  componentDidMount () {
      this.getEmployees();
  }

  getEmployees = () => {
    this.props.getEmployeeList().then(list => this.setState({
        employeesList : list,
    }));
  }

  render() {
      const {employeesList} = this.state
      return (
          <div className="employeeview_container">
            <h2>Här är en lista på våra anställda</h2>
            {employeesList.map(employee => {
                return (
                      <div class="row" >
                        <div class="column">
                          <img src="/Images/sillhouette.png" className="rounded float-left" width="150" height="150"></img>
                        </div>
                        <div class="column" id="description">
                          <div class="card text-white bg-dark mb-3">
                          <div class="card-header"> Anställningsnummer: {employee.id}</div>
                          <div class="card-body">
                            <h5 class="card-title"> {employee.name}</h5>
                          </div>
                          </div>
                        </div>
                      </div>
                )
            }
            )}
    
          </div>
      );
  }
}

export default Contact;