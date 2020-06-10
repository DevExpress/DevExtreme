import React from 'react';
import { FileUploader, Button, TextBox } from 'devextreme-react';
import notify from 'devextreme/ui/notify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.formElement = React.createRef();
  }

  onClick() {
    notify('Uncomment the line to enable sending a form to the server.');
    //this.formElement.current.submit();
  }

  render() {
    return (
      <form id="form" ref={this.formElement} method="post" action="" encType="multipart/form-data">
        <h3>Profile Settings</h3>
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">First Name:</div>
            <TextBox name="FirstName" value="John" className="dx-field-value" />
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Last Name:</div>
            <TextBox name="LastName" value="Smith" className="dx-field-value" />
          </div>
        </div>
        <div className="fileuploader-container">
          <FileUploader selectButtonText="Select photo" labelText="" accept="image/*" uploadMode="useForm" />
        </div>
        <Button className="button" text="Update profile" type="success" onClick={this.onClick} />
      </form>
    );
  }
}

export default App;
