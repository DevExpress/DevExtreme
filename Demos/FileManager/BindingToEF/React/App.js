import React from 'react';

import FileManager, { Permissions, ItemView, Details, Column } from 'devextreme-react/file-manager';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';

const remoteProvider = new RemoteFileSystemProvider({
  endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-db'
});

const allowedFileExtensions = [];

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPath: 'Documents/Reports'
    };

    this.onCurrentDirectoryChanged = this.onCurrentDirectoryChanged.bind(this);
  }

  onCurrentDirectoryChanged(e) {
    this.setState({
      currentPath: e.component.option('currentPath')
    });
  }

  render() {
    return (
      <FileManager
        currentPath={this.state.currentPath}
        fileSystemProvider={remoteProvider}
        allowedFileExtensions={allowedFileExtensions}
        height={550}
        onCurrentDirectoryChanged={this.onCurrentDirectoryChanged}>
        <Permissions
          create={true}
          copy={true}
          move={true}
          delete={true}
          rename={true}>
        </Permissions>
        <ItemView>
          <Details>
            <Column dataField="thumbnail"></Column>
            <Column dataField="name"></Column>
            <Column dataField="dateModified" caption="Modified"></Column>
            <Column dataField="created" caption="Created" dataType="date"></Column>
            <Column dataField="modifiedBy" caption="Modified By" visibleIndex="2"></Column>
          </Details>
        </ItemView>
      </FileManager>
    );
  }
}

export default App;
