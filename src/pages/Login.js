import React, { Component } from 'react';
import $ from "jquery";
import Register from './Register';
import { BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import PropTypes from 'prop-types';

class Login extends React.Component {

constructor(props) {
  super(props);
  this.state = {
    username: '',
    password: '',
    error: '',
  };

}

clearFields() {
  this.setState({
    username: '',
    password: '',
    error: '',
  });
}

handleChangeInUsernameField = e => {
    this.setState({username: e.target.value});
}

handleChangeInPasswordField = e => {
    this.setState({password: e.target.value});
}

tryToLogin = (e) => {
    e.preventDefault();
    let {username, password} = this.state;
    this.props.loginUser(username, password).then(resp => {
      if(resp.message === 'OK'){
        localStorage.setItem('token', resp.token);
        this.clearFields();
        this.props.history.push('/view_carmodels');
      } else {
        this.setState({
          error: resp.message
        });
      }
    }
    );
}

render() {
  return (
    <div className="start_container">
      <div class="row"> 
        <div class="column" id="start_header">
          <h3>Detta är den officiella sidan för bilhandeln. Här kan du se och hantera bilar som vi säljer, 
                            kolla in våra anställda och även du som anställd kan se din profil. </h3>
        </div>
      <div class="column" id="start_form">

    <div className="container_login">
      <h2>Logga in</h2>
        <form onSubmit={this.tryToLogin}>
            <div class="input_username">
                <input type="text" required value={this.state.username} class="form-control" placeholder="Email" onChange={this.handleChangeInUsernameField}/>
            </div>
            <div class="input_password">
                <input type="password" required value={this.state.password} class="form-control" placeholder="Lösenord" onChange={this.handleChangeInPasswordField}/>
            </div>
            <div className="error_label">
              <label>{this.state.error}</label>
            </div>
            <div class="submit_login">
                <button type="submit" class="btn btn-primary">Logga in</button>
            </div>
            <div class="link_register"> 
              <Link to="/register">Inte registrerad? Här kan du registrera dig</Link>
            </div>
        </form>

        </div>
      </div>
      </div>
    </div>
  );
  }
}


export default Login;