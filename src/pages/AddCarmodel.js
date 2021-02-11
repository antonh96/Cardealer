import React, { Component } from 'react';
import $ from "jquery";

class AddCarmodel extends React.Component {

constructor(props) {
  super(props);
  this.state = {
    brand: '',
    model: '',
    price: '',
  };
}

clearFields() {
  this.setState({
    brand: '',
    model: '',
    price: '',
  });
}

handleChangeInBrandField = e => {
    this.setState({brand: e.target.value});
    console.log(e.target.value);
}

handleChangeInModelField = e => {
    this.setState({model: e.target.value});
    console.log(e.target.value);
}

handleChangeInPriceField = e => {
    this.setState({price: e.target.value});
    console.log(e.target.value);
}

sendNewCarmodel = (e) => {
    e.preventDefault();
    let {brand, model, price} = this.state;
    this.props.addModel(brand, model, price);
    this.clearFields();
    $("#CarViewerModal").modal('hide');
}

render() {
  return (
    <div className="container">

    <form onSubmit={this.sendNewCarmodel}>
        <label>Bilmärke</label>
        <input type="text" className="form-control" value={this.state.brand} id="inputBrand" onChange={this.handleChangeInBrandField}/>
    
        <label>Modell</label>
        <input type="text" className="form-control" value={this.state.model} id="inputModel" onChange={this.handleChangeInModelField}/>
        
        <label>Pris</label>
        <input type="text" className="form-control" value={this.state.price} id="inputPrice" onChange={this.handleChangeInPriceField}/>

        <button type="submit" class="btn btn-primary">Lägg till</button>
    
    </form>
    
    </div>
  );
  }
}
export default AddCarmodel;