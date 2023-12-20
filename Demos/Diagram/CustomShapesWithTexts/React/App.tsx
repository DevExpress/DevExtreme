import React, { useEffect, useRef } from 'react';
import Diagram, { CustomShape, Group, Toolbox } from 'devextreme-react/diagram';
import service from './data.ts';
import 'whatwg-fetch';

const employees = service.getEmployees();

export default function App() {
  const diagramRef = useRef<Diagram>();

  useEffect(() => {
    const diagram = diagramRef.current.instance;
    fetch('../../../../data/diagram-employees.json')
      .then((response) => response.json())
      .then((json) => {
        diagram.import(JSON.stringify(json));
      })
      .catch(() => {
        throw new Error('Data Loading Error');
      });
  }, []);

  return (
    <Diagram id="diagram" ref={diagramRef}>
      {employees.map((employee, index) => (
        <CustomShape
          category="employees"
          type={`employee${employee.ID}`}
          baseType="rectangle"
          defaultText={employee.Full_Name}
          allowEditText={false}
          key={index}
        />
      ))}
      <Toolbox>
        <Group category={'employees' as any} title="Employees" displayMode="texts" />
      </Toolbox>
    </Diagram>
  );
}
