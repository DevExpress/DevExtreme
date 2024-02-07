import React, { useCallback, useState } from 'react';
import FileUploader, { FileUploaderTypes } from 'devextreme-react/file-uploader';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import CheckBox, { CheckBoxTypes } from 'devextreme-react/check-box';

const uploadModes = ['instantly', 'useButtons'];
const fileTypeLabel = { 'aria-label': 'File Type' };
const uploadModeLabel = { 'aria-label': 'Mode' };
const fileTypesSource = [
  { name: 'All types', value: '*' },
  { name: 'Images', value: 'image/*' },
  { name: 'Videos', value: 'video/*' },
];

export default function App() {
  const [multiple, setMultiple] = useState(false);
  const [uploadMode, setUploadMode] = useState<FileUploaderTypes.Properties['uploadMode']>('instantly');
  const [accept, setAccept] = useState('*');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onSelectedFilesChanged = useCallback((e: FileUploaderTypes.ValueChangedEvent) => {
    setSelectedFiles(e.value);
  }, [setSelectedFiles]);

  const onAcceptChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setAccept(e.value);
  }, [setAccept]);

  const onUploadModeChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setUploadMode(e.value);
  }, [setUploadMode]);

  const onMultipleChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent) => {
    setMultiple(e.value);
  }, [setMultiple]);

  return (
    <div>
      <div className="widget-container">
        <FileUploader
          multiple={multiple}
          accept={accept}
          uploadMode={uploadMode}
          uploadUrl="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
          onValueChanged={onSelectedFilesChanged}
        />
        <div className="content" style={{ display: selectedFiles.length > 0 ? 'block' : 'none' }}>
          <div>
            <h4>Selected Files</h4>
            {selectedFiles.map((file, i) => (
              <div className="selected-item" key={i}>
                <span>{`Name: ${file.name}`}<br /></span>
                <span>{`Size ${file.size}`}<br /></span>
                <span>{`Type ${file.type}`}<br /></span>
                <span>{`Last Modified Date: ${file.lastModifiedDate}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>File types</span>
          <SelectBox
            dataSource={fileTypesSource}
            inputAttr={fileTypeLabel}
            valueExpr="value"
            displayExpr="name"
            defaultValue="*"
            onValueChanged={onAcceptChanged}
          />
        </div>
        <div className="option">
          <span>Upload mode</span>
          <SelectBox
            items={uploadModes}
            defaultValue="instantly"
            inputAttr={uploadModeLabel}
            onValueChanged={onUploadModeChanged}
          />
        </div>
        <div className="option">
          <CheckBox text="Allow multiple files selection" onValueChanged={onMultipleChanged} />
        </div>
      </div>
    </div>
  );
}
