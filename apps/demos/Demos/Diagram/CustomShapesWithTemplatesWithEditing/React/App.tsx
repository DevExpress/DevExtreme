import React, { useCallback, useRef, useState } from 'react';
import Diagram, {
  CustomShape, ContextToolbox, PropertiesPanel, Group, Tab, Toolbox, Nodes, AutoLayout, DiagramTypes,
} from 'devextreme-react/diagram';
import { Popup } from 'devextreme-react/popup';
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import ArrayStore from 'devextreme/data/array_store';
import CustomShapeTemplate from './CustomShapeTemplate.tsx';
import CustomShapeToolboxTemplate from './CustomShapeToolboxTemplate.tsx';
import service, { Employee } from './data.ts';

const pageCommands = ['pageSize', 'pageOrientation', 'pageColor'];

const nameLabel = { 'aria-label': 'Name' };
const emailLabel = { 'aria-label': 'Email' };
const titleLabel = { 'aria-label': 'Title' };
const stateLabel = { 'aria-label': 'State' };
const cityLabel = { 'aria-label': 'City' };
const phoneLabel = { 'aria-label': 'Phone' };
const skypeLabel = { 'aria-label': 'Skype' };

let generatedID = 100;

const employees = service.getEmployees();
const dataSource = new ArrayStore({
  key: 'ID',
  data: employees,
  onInserting(values, key) {
    this.update(key, {
      ID: values.ID || (generatedID += 1),
      Full_Name: values.Full_Name || "Employee's Name",
      Title: values.Title || "Employee's Title",
    });
  },
} as any);

function onRequestLayoutUpdate(e: DiagramTypes.RequestLayoutUpdateEvent) {
  for (let i = 0; i < e.changes.length; i += 1) {
    if (e.changes[i].type === 'remove') {
      e.allowed = true;
    } else if (e.changes[i].data.Head_ID !== undefined && e.changes[i].data.Head_ID !== null) {
      e.allowed = true;
    }
  }
}

function deleteEmployee(employee: Employee) {
  dataSource.push([{ type: 'remove', key: employee.ID }]);
}

function itemTypeExpr() {
  return 'employee';
}

function itemCustomDataExpr(obj: Employee, value: Employee) {
  if (value === undefined) {
    return {
      Full_Name: obj.Full_Name,
      Prefix: obj.Prefix,
      Title: obj.Title,
      City: obj.City,
      State: obj.State,
      Email: obj.Email,
      Skype: obj.Skype,
      Mobile_Phone: obj.Mobile_Phone,
    };
  }
  obj.Full_Name = value.Full_Name;
  obj.Prefix = value.Prefix;
  obj.Title = value.Title;
  obj.City = value.City;
  obj.State = value.State;
  obj.Email = value.Email;
  obj.Skype = value.Skype;
  obj.Mobile_Phone = value.Mobile_Phone;
  return null;
}

export default function App() {
  const [currentEmployee, setCurrentEmployee] = useState<Partial<Employee>>({});
  const [popupVisible, setPopupVisible] = useState(false);

  const diagramRef = useRef<Diagram>(null);

  const editEmployee = useCallback((employee) => {
    setCurrentEmployee({ ...employee });
    setPopupVisible(true);
  }, []);

  const updateEmployee = useCallback(() => {
    dataSource.push([{
      type: 'update',
      key: currentEmployee.ID,
      data: {
        Full_Name: currentEmployee.Full_Name,
        Title: currentEmployee.Title,
        City: currentEmployee.City,
        State: currentEmployee.State,
        Email: currentEmployee.Email,
        Skype: currentEmployee.Skype,
        Mobile_Phone: currentEmployee.Mobile_Phone,
      },
    }]);
    setCurrentEmployee({});
    setPopupVisible(false);
  }, [currentEmployee, setCurrentEmployee, setPopupVisible]);

  const customShapeTemplate = useCallback((item) => (CustomShapeTemplate(item.dataItem,
    () => { editEmployee(item.dataItem); },
    () => { deleteEmployee(item.dataItem); })
  ), [editEmployee]);

  const customShapeToolboxTemplate = useCallback(() => CustomShapeToolboxTemplate(), []);

  const cancelEditEmployee = useCallback(() => {
    setCurrentEmployee({});
    setPopupVisible(false);
  }, [setCurrentEmployee, setPopupVisible]);

  const handleChange = useCallback((field, value) => {
    setCurrentEmployee((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }, [setCurrentEmployee]);

  const handleNameChange = useCallback((e: { value: any; }) => {
    handleChange('Full_Name', e.value);
  }, [handleChange]);

  const handleTitleChange = useCallback((e: { value: any; }) => {
    handleChange('Title', e.value);
  }, [handleChange]);

  const handleCityChange = useCallback((e: { value: any; }) => {
    handleChange('City', e.value);
  }, [handleChange]);

  const handleStateChange = useCallback((e: { value: any; }) => {
    handleChange('State', e.value);
  }, [handleChange]);

  const handleEmailChange = useCallback((e: { value: any; }) => {
    handleChange('Email', e.value);
  }, [handleChange]);

  const handleSkypeChange = useCallback((e: { value: any; }) => {
    handleChange('Skype', e.value);
  }, [handleChange]);

  const handlePhoneChange = useCallback((e: { value: any; }) => {
    handleChange('Mobile_Phone', e.value);
  }, [handleChange]);

  const popupContentRender = useCallback(() => (
    <PopupContentFunc
      currentEmployee={currentEmployee}
      handleNameChange={handleNameChange}
      handleTitleChange={handleTitleChange}
      handleCityChange={handleCityChange}
      handleStateChange={handleStateChange}
      handleEmailChange={handleEmailChange}
      handleSkypeChange={handleSkypeChange}
      handlePhoneChange={handlePhoneChange}
      updateEmployeeClick={updateEmployee}
      cancelEditEmployeeClick={cancelEditEmployee}
    />
  ), [
    currentEmployee,
    handleNameChange,
    handleTitleChange,
    handleCityChange,
    handleStateChange,
    handleEmailChange,
    handleSkypeChange,
    handlePhoneChange,
    updateEmployee,
    cancelEditEmployee,
  ]);

  return (
    <div id="container">
      <Diagram
        id="diagram"
        ref={diagramRef}
        customShapeRender={customShapeTemplate}
        customShapeToolboxRender={customShapeToolboxTemplate}
        onRequestLayoutUpdate={onRequestLayoutUpdate}
      >
        <CustomShape
          type="employee"
          baseType="rectangle"
          category="employee"
          title="New Employee"
          defaultWidth={1.5}
          defaultHeight={1}
          toolboxWidthToHeightRatio={2}
          minWidth={1.5}
          minHeight={1}
          maxWidth={3}
          maxHeight={2}
          allowEditText={false}
        />
        <Nodes
          dataSource={dataSource}
          keyExpr="ID"
          typeExpr={itemTypeExpr}
          customDataExpr={itemCustomDataExpr}
          parentKeyExpr="Head_ID"
        >
          <AutoLayout type="tree" />
        </Nodes>
        <ContextToolbox shapeIconsPerRow={1} width={100} />
        <Toolbox showSearch={false} shapeIconsPerRow={1}>
          <Group category={'employee' as any} title="Employee" expanded={true} />
        </Toolbox>
        <PropertiesPanel>
          <Tab>
            <Group title="Page Properties" commands={pageCommands as any} />
          </Tab>
        </PropertiesPanel>
      </Diagram>
      <Popup
        visible={popupVisible}
        onHiding={cancelEditEmployee}
        dragEnabled={false}
        showTitle={true}
        title="Edit Employee"
        width={400}
        height={480}
        contentRender={popupContentRender}
      />
    </div>
  );
}

function PopupContentFunc(props) {
  return (
    <React.Fragment>
      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">Name</div>
          <div className="dx-field-value">
            <TextBox
              inputAttr={nameLabel}
              value={props.currentEmployee.Full_Name}
              onValueChanged={props.handleNameChange}
              valueChangeEvent="input">
            </TextBox>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Title</div>
          <div className="dx-field-value">
            <TextBox
              inputAttr={titleLabel}
              value={props.currentEmployee.Title}
              onValueChanged={props.handleTitleChange}
              valueChangeEvent="input">
            </TextBox>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">City</div>
          <div className="dx-field-value">
            <TextBox
              inputAttr={cityLabel}
              value={props.currentEmployee.City}
              onValueChanged={props.handleCityChange}
              valueChangeEvent="input">
            </TextBox>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">State</div>
          <div className="dx-field-value">
            <TextBox
              inputAttr={stateLabel}
              value={props.currentEmployee.State}
              onValueChanged={props.handleStateChange}
              valueChangeEvent="input">
            </TextBox>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Email</div>
          <div className="dx-field-value">
            <TextBox
              inputAttr={emailLabel}
              value={props.currentEmployee.Email}
              onValueChanged={props.handleEmailChange}
              valueChangeEvent="input">
            </TextBox>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Skype</div>
          <div className="dx-field-value">
            <TextBox
              inputAttr={skypeLabel}
              value={props.currentEmployee.Skype}
              onValueChanged={props.handleSkypeChange}
              valueChangeEvent="input">
            </TextBox>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Phone</div>
          <div className="dx-field-value">
            <TextBox
              inputAttr={phoneLabel}
              value={props.currentEmployee.Mobile_Phone}
              onValueChanged={props.handlePhoneChange}
              valueChangeEvent="input">
            </TextBox>
          </div>
        </div>
      </div>
      <div className="dx-fieldset buttons">
        <Button text="Update" type="default" onClick={props.updateEmployeeClick}></Button>
        <Button text="Cancel" onClick={props.cancelEditEmployeeClick}></Button>
      </div>
    </React.Fragment>
  );
}
