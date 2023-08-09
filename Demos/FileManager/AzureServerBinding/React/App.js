import React from 'react';
import FileManager, { Permissions } from 'devextreme-react/file-manager';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';
import { LoadPanel } from 'devextreme-react/load-panel';

const fileSystemProvider = new RemoteFileSystemProvider({
  endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-azure',
});

const allowedFileExtensions = [];
const loadPanelPosition = { of: '#file-manager' };
export default function App() {
  const [loadPanelVisible, setLoadPanelVisible] = React.useState(true);
  const [wrapperClassName, setWrapperClassName] = React.useState('');

  React.useEffect(() => {
    checkAzureStatus();
  }, []);

  const checkAzureStatus = React.useCallback(() => {
    fetch('https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-status?widgetType=fileManager')
      .then((response) => response.json())
      .then((result) => {
        const className = result.active ? 'show-widget' : 'show-message';
        setWrapperClassName(className);
        setLoadPanelVisible(false);
      });
  }, [setWrapperClassName, setLoadPanelVisible]);

  return (
    <div id="wrapper" className={wrapperClassName}>
      <LoadPanel visible={loadPanelVisible} position={loadPanelPosition} />
      <FileManager id="file-manager" fileSystemProvider={fileSystemProvider} allowedFileExtensions={allowedFileExtensions}>
        {/* uncomment the code below to enable file/directory management */}
        <Permissions
          // create={true}
          // copy={true}
          // move={true}
          // delete={true}
          // rename={true}
          // upload={true}
          download={true}>
        </Permissions>
      </FileManager>
      <div id="message-box">
        To run the demo locally, specify your Azure storage account name,
        access key and container name in the web.config file.
        Refer to the <a href="https://js.devexpress.com/Demos/WidgetsGallery/Demo/FileManager/AzureServerBinding/React/Light/"
          target="_blank" rel="noopener noreferrer">
          https://js.devexpress.com/Demos/WidgetsGallery/Demo/FileManager/AzureServerBinding/React/Light/</a>
        to see the demo online.
      </div>
    </div>
  );
}
