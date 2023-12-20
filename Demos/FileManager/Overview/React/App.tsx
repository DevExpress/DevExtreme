import React, { useCallback, useState } from 'react';
import FileManager, { FileManagerTypes, Permissions } from 'devextreme-react/file-manager';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';
import { Popup } from 'devextreme-react/popup';

const remoteProvider = new RemoteFileSystemProvider({
  endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-file-system-images',
});

export default function App() {
  const [currentPath, setCurrentPath] = useState('Widescreen');
  const [popupVisible, setPopupVisible] = useState(false);
  const [imageItemToDisplay, setImageItemToDisplay] = useState<{ name?: string, url?: string }>({});

  const displayImagePopup = useCallback((e: FileManagerTypes.SelectedFileOpenedEvent) => {
    setPopupVisible(true);
    setImageItemToDisplay({
      name: e.file.name,
      url: e.file.dataItem.url,
    });
  }, [setPopupVisible, setImageItemToDisplay]);

  const hideImagePopup = useCallback(() => {
    setPopupVisible(false);
  }, [setPopupVisible]);

  const onCurrentDirectoryChanged = useCallback((e: FileManagerTypes.CurrentDirectoryChangedEvent) => {
    setCurrentPath(e.component.option('currentPath'));
  }, [setCurrentPath]);

  return (
    <div>
      <FileManager
        currentPath={currentPath}
        fileSystemProvider={remoteProvider}
        onSelectedFileOpened={displayImagePopup}
        onCurrentDirectoryChanged={onCurrentDirectoryChanged}>
        <Permissions
          create={true}
          copy={true}
          move={true}
          delete={true}
          rename={true}
          upload={true}
          download={true}>
        </Permissions>
      </FileManager>

      <Popup
        maxHeight={600}
        hideOnOutsideClick={true}
        showCloseButton={true}
        title={imageItemToDisplay.name}
        visible={popupVisible}
        onHiding={hideImagePopup}
        className="photo-popup-content">

        <img src={imageItemToDisplay.url} className="photo-popup-image" />
      </Popup>
    </div>
  );
}
