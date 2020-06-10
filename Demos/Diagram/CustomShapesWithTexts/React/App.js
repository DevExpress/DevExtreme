import React from 'react';
import Diagram, { CustomShape, Group, Toolbox } from 'devextreme-react/diagram';
import service from './data.js';
import 'whatwg-fetch';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.diagramRef = React.createRef();
    this.employees = service.getEmployees();
  }

  componentDidMount() {
    var diagram = this.diagramRef.current.instance;
    fetch('../../../../data/diagram-employees.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        diagram.import(JSON.stringify(json));
      })
      .catch(function() {
        throw 'Data Loading Error';
      });
  }
  render() {
    return (
      <Diagram id="diagram" ref={this.diagramRef}>
        {this.employees.map(function(employee, index) {
          return <CustomShape category="employees" type={`employee${employee.ID}`} baseType="rectangle"
            defaultText={employee.Full_Name} allowEditText={false} key={index} />;
        })}
        <Toolbox>
          <Group category="employees" title="Employees" displayMode="texts" />
        </Toolbox>
      </Diagram>
    );
  }
}

export default App;
