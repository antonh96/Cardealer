import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.js";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch, Redirect  } from "react-router-dom";
import CarViewer from "./pages/CarViewer";
import Contact from "./pages/Contact";
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './pages/ProtectedRoute';
import Profile from './pages/Profile';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      car_models: [],
      employees: [],
      sales_parameters: {},
    };
    this.deleteCarmodel = this.deleteCarmodel.bind(this);
    this.addCarmodel = this.addCarmodel.bind(this);
    this.addUserToServer = this.addUserToServer.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  componentDidMount() {
    this.checkIfEmployee();
  }

  getCarList = () => {
    return fetch('/carmodels')
    .then(res => res.json());
  }

  deleteCarmodel = (id) => {
    return fetch('/carmodels', { method: 'DELETE' ,  headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }) });
  }

  addCarmodel = (brand, model, price) => {
    return fetch('/carmodels', { method: 'POST' ,  headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ brand, model, price }) });
  }

  getEmployeeList = () => {
    return fetch('/employees')
    .then(res => res.json());
  }

  addUserToServer = async (name, id, username, password) => {
    const res = await fetch('/create_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, id, username, password })
    });
    return await res.json();
  }

  loginUser = async (username, password) => {
    const resp = await fetch('/login', { 
      method: 'POST' ,  
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password})}).then(res => res.json());
    return resp
  }

  getTotalSales = async () => {
    fetch('/total_sales')
    .then(res => res.json());
  }

  getUserProfile = async () => {
    return fetch('/get_user_profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: localStorage.getItem('token')})
    }).then(res => res.json());
  }

  checkIfEmployee = async () => {
    fetch('/is_employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: localStorage.getItem('token')})
    }).then(res => res.json()).then(list => {
        if (list.message === 'OK') {
          const x = document.getElementById("profile_button");
          x.style.display = "block";
        } else {
          const x = document.getElementById("profile_button");
          x.style.display = "none";
        }
    });    
  } 
 
  render() {
    const viewCarmodelsElem = (params) => <CarViewer {...params} getCarList={this.getCarList} deleteCarmodel ={this.deleteCarmodel} addCarmodel={this.addCarmodel}/>;
    const contactElem = (params) => <Contact {...params} getEmployeeList={this.getEmployeeList}/>;
    const registerElem = (params) => <Register {...params} addUserToServer={this.addUserToServer}/>;
    const loginElem = (params) => <Login {...params} loginUser={this.loginUser}/>;
    const profileElem = (params) => <Profile {...params} getUserProfile={this.getUserProfile}/>
    return (
      <Router>
      <div className="App">
        <div className="jumbotron">
          <h1>Välkommen till våran bilhandel. Här finns bilar av hög kvalité!</h1>
        </div>
          <nav className="navbar navbar-expand-lg navbar navbar-dark bg-dark">
            <a className="navbar-brand" href="/start">Bilförsäljaren</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <a className="nav-item nav-link" href="/start">Startsida </a>
                <a className="nav-item nav-link" href="/view_carmodels">Våra bilar</a>
                <a className="nav-item nav-link" href="/contact">Kontakt</a>
                <a className="nav-item nav-link" id="profile_button" href="/profile">Min profil</a>
              </div>
            </div>
          </nav>  
      <div className="background">
        <div className="container_app">
          <Switch>
              <Route path='/start' component={loginElem}></Route>
              <ProtectedRoute path='/view_carmodels' component={viewCarmodelsElem}/>
              <ProtectedRoute path='/contact' component={contactElem}/>
              <Route path='/register' component={registerElem}/>
              <ProtectedRoute path='/profile' component={profileElem}/>
              <Route path='/login' component={loginElem}/>
          </Switch>
        </div>
        </div>
      </div>
    </Router>
    
    );
  }
}

export default App;
