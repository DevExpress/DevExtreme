import React from 'react';
import FileUploader from 'devextreme-react/file-uploader';
import Button from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import notify from 'devextreme/ui/notify';

const firstNameLabel = { 'aria-label': 'First Name' };
const lastNameLabel = { 'aria-label': 'Last Name' };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.formElement = React.createRef();
  }

  onClick() {
    notify('Uncomment the line to enable sending a form to the server.');
    // this.formElement.current.submit();
  }

  render() {
    return (
      <form id="form" ref={this.formElement} method="post" action="" encType="multipart/form-data">
        <h3>Profile Settings</h3>
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">First Name:</div>
            <TextBox inputAttr={firstNameLabel} name="FirstName" value="John" className="dx-field-value" />
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Last Name:</div>
            <TextBox inputAttr={lastNameLabel} name="LastName" value="Smith" className="dx-field-value" />
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
