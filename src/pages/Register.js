import React, { Component } from 'react';
import $ from "jquery";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

class Register extends React.Component {

constructor(props) {
  super(props);
  this.state = {
    name: '',
    id: '',
    username: '',
    password: '',
    error: '',
  };

}

clearFields() {
  this.setState({
    name: '',
    id: '',
    username: '',
    password: '',
    error: '',
  });
}

handleChangeInNameField = e => {
    this.setState({name: e.target.value});
    console.log(e.target.value);
}

handleChangeInIdField = e => {
    this.setState({id: e.target.value});
    console.log(e.target.value);
}

handleChangeInUsernameField = e => {
    this.setState({username: e.target.value});
    console.log(e.target.value);
}

handleChangeInPasswordField = e => {
    this.setState({password: e.target.value});
    console.log(e.target.value);
    console.log(this.props);
}

addUser = (e) => {
    e.preventDefault();
    let {name, id, username, password} = this.state;
    this.props.addUserToServer(name, id, username, password).then(resp => {
        if (resp.message === 'OK') {
            this.clearFields();
            this.props.history.push('/login')
        } else {
            this.setState({
                error: resp.message
              });   
        }
    }); 
}

render() {
  return (
    <div className="register_container">
    <h2>Registrera dig</h2>
    <form onSubmit={this.addUser}>
    <div className="form-group row">
        <label for="colFormLabel" className="col-sm-2 col-form-label">Namn</label>
        <div className="col-sm-10">
            <input type="text" required className="form-control" value={this.state.name} id="inputBrand" placeholder="Namn" onChange={this.handleChangeInNameField}/>
        </div>
    </div>
    <div className="form-group row">
        <label for="colFormLabel" className="col-sm-2 col-form-label">Anställningsnummer</label>
        <div className="col-sm-10">
            <input type="text" className="form-control" value={this.state.id} id="inputModel" placeholder="Anställningsnummer" onChange={this.handleChangeInIdField}/>
        </div>
    </div>
    <div className="form-group row">
        <label for="colFormLabel" className="col-sm-2 col-form-label">Email</label>
        <div className="col-sm-10">
            <input type="text" required className="form-control" value={this.state.username} id="inputEmail" placeholder="email@example.com" onChange={this.handleChangeInUsernameField}/>
        </div>
    </div>
    <div className="form-group row">
        <label for="colFormLabel" className="col-sm-2 col-form-label">Lösenord</label>
        <div className="col-sm-10">
            <input type="password" required className="form-control" value={this.state.password} id="inputPrice" placeholder="Lösenord" onChange={this.handleChangeInPasswordField}/>
        </div>
    </div>

    <div className="error_label">
        <label> {this.state.error}</label>
    </div>
    
    <button type="submit" className="btn btn-primary">Registrera</button>    
        <Link to="/login">Redan registrerad? Här kan du logga in</Link>
    </form>
    
    </div>
  );
  }
}
export default Register;