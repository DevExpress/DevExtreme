import React from 'react';
import FileUploader, { FileUploaderTypes } from 'devextreme-react/file-uploader';
import ProgressBar from 'devextreme-react/progress-bar';

const allowedFileExtensions = ['.jpg', '.jpeg', '.gif', '.png'];

export default function App() {
  const [isDropZoneActive, setIsDropZoneActive] = React.useState(false);
  const [imageSource, setImageSource] = React.useState<string>('');
  const [textVisible, setTextVisible] = React.useState(true);
  const [progressVisible, setProgressVisible] = React.useState(false);
  const [progressValue, setProgressValue] = React.useState(0);

  const onDropZoneEnter = React.useCallback((e: FileUploaderTypes.DropZoneEnterEvent) => {
    if (e.dropZoneElement.id === 'dropzone-external') {
      setIsDropZoneActive(true);
    }
  }, [setIsDropZoneActive]);

  const onDropZoneLeave = React.useCallback((e: FileUploaderTypes.DropZoneLeaveEvent) => {
    if (e.dropZoneElement.id === 'dropzone-external') {
      setIsDropZoneActive(false);
    }
  }, [setIsDropZoneActive]);

  const onUploaded = React.useCallback((e: FileUploaderTypes.UploadedEvent) => {
    const { file } = e;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setIsDropZoneActive(false);
      setImageSource(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
    setTextVisible(false);
    setProgressVisible(false);
    setProgressValue(0);
  }, [setImageSource, setIsDropZoneActive, setTextVisible, setProgressVisible, setProgressValue]);

  const onProgress = React.useCallback((e: { bytesLoaded: number; bytesTotal: number; }) => {
    setProgressValue((e.bytesLoaded / e.bytesTotal) * 100);
  }, [setProgressValue]);

  const onUploadStarted = React.useCallback(() => {
    setImageSource('');
    setProgressVisible(true);
  }, [setImageSource, setProgressVisible]);

  return (
    <div className="widget-container flex-box">
      <span>Profile Picture</span>
      <div id="dropzone-external" className={`flex-box ${isDropZoneActive ? 'dx-theme-accent-as-border-color dropzone-active' : 'dx-theme-border-color'}`}>
        {imageSource && <img id="dropzone-image" src={imageSource} alt="" />}
        {textVisible && (
          <div id="dropzone-text" className="flex-box">
            <span>Drag & Drop the desired file</span>
            <span>…or click to browse for a file instead.</span>
          </div>
        )}
        <ProgressBar
          id="upload-progress"
          min={0}
          max={100}
          width="30%"
          showStatus={false}
          visible={progressVisible}
          value={progressValue}
        ></ProgressBar>
      </div>
      <FileUploader
        id="file-uploader"
        dialogTrigger="#dropzone-external"
        dropZone="#dropzone-external"
        multiple={false}
        allowedFileExtensions={allowedFileExtensions}
        uploadMode="instantly"
        uploadUrl="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
        visible={false}
        onDropZoneEnter={onDropZoneEnter}
        onDropZoneLeave={onDropZoneLeave}
        onUploaded={onUploaded}
        onProgress={onProgress}
        onUploadStarted={onUploadStarted}
      ></FileUploader>
    </div>
  );
}
