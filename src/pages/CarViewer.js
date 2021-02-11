import '../App.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from "react";
import CarViewerModal from "./CarViewerModal";

class CarViewer extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        carModels: []
      };
  }

  componentDidMount() {
      this.getCarModels();
  }

  getCarModels = () => {
    this.props.getCarList().then(list => this.setState({
        carModels : list,
    })).then(res => console.log(res));
  }

  deleteModel = (id) => {
    this.props.deleteCarmodel(id).then(this.getCarModels());
  }

  addModel = (brand, model, price) => {
    this.props.addCarmodel(brand, model, price).then(this.getCarModels());
  }

  render() {
      const {carModels} = this.state
      return (
          <div className="carview_conatiner">
            <h2>Vi säljer följande bilar:</h2>

            <table className="table table-dark">
                <thead className="thead-light">
                    <tr>
                        <th>
                        Märke
                        </th>
                        <th>
                        Modell
                        </th>
                        <th>
                        Pris
                        </th>
                        <th>
                        </th>
                    </tr>
                </thead>
                {carModels.map(carmodel => {
                    return(
                        <tbody key={carmodel.id}>
                            <tr>
                                <td>
                                    {carmodel.brand}
                                </td>
                                <td>
                                    {carmodel.model}
                                </td>
                                <td>
                                    {carmodel.price}
                                </td>
                                <td>
                                    <button type="button" className="btn btn-danger" onClick={() => {this.deleteModel(carmodel.id)}}>Ta bort</button>
                                </td>
                            </tr>
                        </tbody>
                    )
                })}
                <tbody key="last">
                    <tr></tr>
                </tbody>
            </table>
            <CarViewerModal addModel={this.addModel}/>

          </div>
      );
  }
}

export default CarViewer;