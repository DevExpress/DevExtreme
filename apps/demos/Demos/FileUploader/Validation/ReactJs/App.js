import React from 'react';
import FileUploader from 'devextreme-react/file-uploader';

const fileExtensions = ['.jpg', '.jpeg', '.gif', '.png'];
export default function App() {
  return (
    <div className="main-block">
      <div className="file-uploader-block">
        <FileUploader
          multiple={true}
          uploadMode="useButtons"
          uploadUrl="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
          allowedFileExtensions={fileExtensions}
        />
        <span className="note">
          {'Allowed file extensions: '}
          <span>.jpg, .jpeg, .gif, .png</span>.
        </span>
      </div>
      <div
        className="file-uploader-block"
        style={{ float: 'right' }}
      >
        <FileUploader
          multiple={true}
          uploadMode="useButtons"
          uploadUrl="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
          maxFileSize={4000000}
        />
        <span className="note">
          {'Maximum file size: '}
          <span>4 MB</span>.
        </span>
      </div>
    </div>
  );
}
