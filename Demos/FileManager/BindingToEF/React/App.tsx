import React from 'react';
import FileManager, {
  Permissions, ItemView, Details, Column, FileManagerTypes,
} from 'devextreme-react/file-manager';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';

const remoteProvider = new RemoteFileSystemProvider({
  endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-db',
});

const allowedFileExtensions = [];

export default function App() {
  const [currentPath, setCurrentPath] = React.useState('Documents/Reports');

  const onCurrentDirectoryChanged = React.useCallback((e: FileManagerTypes.CurrentDirectoryChangedEvent) => {
    setCurrentPath(e.component.option('currentPath'));
  }, []);

  return (
    <FileManager
      currentPath={currentPath}
      fileSystemProvider={remoteProvider}
      allowedFileExtensions={allowedFileExtensions}
      height={550}
      onCurrentDirectoryChanged={onCurrentDirectoryChanged}>
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
          <Column dataField="modifiedBy" caption="Modified By" visibleIndex={2}></Column>
        </Details>
      </ItemView>
    </FileManager>
  );
}
