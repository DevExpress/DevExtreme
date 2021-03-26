import React from 'react';

import { Button } from 'devextreme-react/button';

export class EmployeeItem extends React.Component {

  constructor(props) {
    super(props);

    this.showInfo = () => this.props.showInfo(props.employee);
  }

  render() {
    return (
      <React.Fragment>
        <img src={ this.props.employee.Picture } id={ `image${this.props.employee.ID}` } /><br />
        <i>{this.props.employee.FirstName} {this.props.employee.LastName}</i><br />
        <Button
          className="button-info"
          text="Details"
          onClick={this.showInfo}
        />
      </React.Fragment>
    );
  }
}
