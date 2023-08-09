import React from 'react';
import FileManager, { Permissions } from 'devextreme-react/file-manager';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';
import { Popup } from 'devextreme-react/popup';

const remoteProvider = new RemoteFileSystemProvider({
  endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-file-system-images',
});

export default function App() {
  const [currentPath, setCurrentPath] = React.useState('Widescreen');
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [imageItemToDisplay, setImageItemToDisplay] = React.useState({});

  const displayImagePopup = React.useCallback((e) => {
    setPopupVisible(true);
    setImageItemToDisplay({
      name: e.file.name,
      url: e.file.dataItem.url,
    });
  }, [setPopupVisible, setImageItemToDisplay]);

  const hideImagePopup = React.useCallback(() => {
    setPopupVisible(false);
  }, [setPopupVisible]);

  const onCurrentDirectoryChanged = React.useCallback((e) => {
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
        title={imageItemToDisplay.name}
        visible={popupVisible}
        onHiding={hideImagePopup}
        className="photo-popup-content">

        <img src={imageItemToDisplay.url} className="photo-popup-image" />
      </Popup>
    </div>
  );
}
