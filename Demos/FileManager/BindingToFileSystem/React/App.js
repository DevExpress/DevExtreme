import React from 'react';

import FileManager, { Permissions } from 'devextreme-react/file-manager';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';

const remoteProvider = new RemoteFileSystemProvider({
  endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-file-system-scripts'
});

const allowedFileExtensions = ['.js', '.json', '.css'];

class App extends React.Component {

  render() {
    return (
      <FileManager fileSystemProvider={remoteProvider} allowedFileExtensions={allowedFileExtensions}>
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
    );
  }
}

export default App;
