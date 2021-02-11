import '../App.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from "react";

class Profile extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        about: {},
      };
  }

  componentDidMount () {
    this.getUserProfile();
  }

  getUserProfile = () => {
    this.props.getUserProfile().then(list => this.setState({
        about : list.sales,
    }));
  }

  render() {
      const {about} = this.state;

      return (
          <div className="profile_container">
            
            <h2 className="header_profile">Min Profil</h2>
            <img src="/Images/sillhouette.png" className="rounded float-left" width="300" height="300"></img>
            <ul className="list-group">
            <div className="id">
               <h3><span className="badge badge-secondary">Anställningsnummer:</span> {about.id}</h3>
            </div>
            <div className="name_field">
                <h3><span className="badge badge-secondary">Namn: </span> {about.name}</h3>
            </div>
            <div className="total_sales">
                <h3><span className="badge badge-secondary">Total försäljning: </span> {about.sales || 0} kr</h3>
            </div>
            </ul>
          </div>
      );
  }
}

export default Profile;