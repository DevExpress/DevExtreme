import React, { useCallback, useState } from 'react';
import FileUploader from 'devextreme-react/file-uploader';
import type { FileUploaderTypes } from 'devextreme-react/file-uploader';
import ProgressBar from 'devextreme-react/progress-bar';

const allowedFileExtensions: string[] = ['.jpg', '.jpeg', '.gif', '.png'];

export default function App() {
  const [isDropZoneActive, setIsDropZoneActive] = useState<boolean>(false);
  const [imageSource, setImageSource] = useState<string>('');
  const [textVisible, setTextVisible] = useState<boolean>(true);
  const [progressVisible, setProgressVisible] = useState<boolean>(false);
  const [progressValue, setProgressValue] = useState<number>(0);

  const onDropZoneEnter = useCallback(({ component, dropZoneElement, event }): void => {
    if (dropZoneElement.id === 'dropzone-external') {
      const items = event.originalEvent.dataTransfer.items;

      const currentAllowedFileExtensions = component.option('allowedFileExtensions');
      const draggedFileExtension = `.${items[0].type.replace(/^image\//, '')}`;

      const isSingleFileDragged = items.length === 1;
      const isValidFileExtension = currentAllowedFileExtensions.includes(draggedFileExtension);

      if (isSingleFileDragged && isValidFileExtension) {
        setIsDropZoneActive(true);
      }
    }
  }, []);

  const onDropZoneLeave = useCallback((e: FileUploaderTypes.DropZoneLeaveEvent): void => {
    if (e.dropZoneElement.id === 'dropzone-external') {
      setIsDropZoneActive(false);
    }
  }, []);

  const onUploaded = useCallback((e: FileUploaderTypes.UploadedEvent): void => {
    const { file } = e;
    const fileReader = new FileReader();
    fileReader.onload = (): void => {
      setIsDropZoneActive(false);
      setImageSource(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
    setTextVisible(false);
    setProgressVisible(false);
    setProgressValue(0);
  }, []);

  const onProgress = useCallback((e: FileUploaderTypes.ProgressEvent): void => {
    setProgressValue((e.bytesLoaded / e.bytesTotal) * 100);
  }, []);

  const onUploadStarted = useCallback(() => {
    setImageSource('');
    setProgressVisible(true);
  }, []);

  return (
    <div className="widget-container flex-box">
      <span>Profile Picture</span>
      <div id="dropzone-external" className={`flex-box ${isDropZoneActive ? 'dropzone-active' : ''}`}>
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
