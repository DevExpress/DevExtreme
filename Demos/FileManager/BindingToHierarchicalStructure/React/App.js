import React from 'react';
import FileManager, { Permissions } from 'devextreme-react/file-manager';
import { fileItems } from './data.js';

export default function App() {
  return (
    <FileManager
      height='450'
      fileSystemProvider={fileItems}>
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
  );
}
