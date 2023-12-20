import React, { useCallback, useRef } from 'react';
import FileUploader from 'devextreme-react/file-uploader';
import Button from 'devextreme-react/button';
import TextBox from 'devextreme-react/text-box';
import notify from 'devextreme/ui/notify';

const firstNameLabel = { 'aria-label': 'First Name' };
const lastNameLabel = { 'aria-label': 'Last Name' };
export default function App() {
  const formElement = useRef(null);
  const onClick = useCallback(() => {
    notify('Uncomment the line to enable sending a form to the server.');
    // formElement.current.submit();
  }, []);
  return (
    <form
      id="form"
      ref={formElement}
      method="post"
      action=""
      encType="multipart/form-data"
    >
      <h3>Profile Settings</h3>
      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">First Name:</div>
          <TextBox
            inputAttr={firstNameLabel}
            name="FirstName"
            value="John"
            className="dx-field-value"
          />
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Last Name:</div>
          <TextBox
            inputAttr={lastNameLabel}
            name="LastName"
            value="Smith"
            className="dx-field-value"
          />
        </div>
      </div>
      <div className="fileuploader-container">
        <FileUploader
          selectButtonText="Select photo"
          labelText=""
          accept="image/*"
          uploadMode="useForm"
        />
      </div>
      <Button
        className="button"
        text="Update profile"
        type="success"
        onClick={onClick}
      />
    </form>
  );
}
