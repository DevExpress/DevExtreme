import React, { useCallback, useState } from 'react';
import FileUploader from 'devextreme-react/file-uploader';
import type { FileUploaderTypes } from 'devextreme-react/file-uploader';
import SelectBox from 'devextreme-react/select-box';
import type { SelectBoxTypes } from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import type { CheckBoxTypes } from 'devextreme-react/check-box';

const uploadModes: FileUploaderTypes.FileUploadMode[] = ['instantly', 'useButtons'];
const fileTypeLabel = { 'aria-label': 'File Type' };
const uploadModeLabel = { 'aria-label': 'Mode' };
const fileTypesSource: { name: string, value: string }[] = [
  { name: 'All types', value: '*' },
  { name: 'Images', value: 'image/*' },
  { name: 'Videos', value: 'video/*' },
];

export default function App() {
  const [multiple, setMultiple] = useState<boolean>(false);
  const [uploadMode, setUploadMode] = useState<FileUploaderTypes.FileUploadMode>('instantly');
  const [accept, setAccept] = useState<string>('*');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onSelectedFilesChanged = useCallback(({ value }: FileUploaderTypes.ValueChangedEvent): void => {
    setSelectedFiles(value);
  }, []);

  const onAcceptChanged = useCallback(({ value }: SelectBoxTypes.ValueChangedEvent): void => {
    setAccept(value);
  }, []);

  const onUploadModeChanged = useCallback(({ value }: SelectBoxTypes.ValueChangedEvent): void => {
    setUploadMode(value);
  }, []);

  const onMultipleChanged = useCallback(({ value }: CheckBoxTypes.ValueChangedEvent): void => {
    setMultiple(value);
  }, []);

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
            {selectedFiles.map((file, index: number) => (
              <div className="selected-item" key={index}>
                <span>{`Name: ${file.name}`}<br /></span>
                <span>{`Size ${file.size}`}<br /></span>
                <span>{`Type ${file.type}`}<br /></span>
                <span>{`Last Modified Date: ${new Date(file.lastModified).toDateString()}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="options-panel">
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
