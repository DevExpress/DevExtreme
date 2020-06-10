import React from 'react';

import FileManager, { Permissions } from 'devextreme-react/file-manager';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';
import { Popup } from 'devextreme-react/popup';

const remoteProvider = new RemoteFileSystemProvider({
  endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-file-system-images'
});

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPath: 'Widescreen',
      popupVisible: false,
      imageItemToDisplay: {}
    };

    this.displayImagePopup = this.displayImagePopup.bind(this);
    this.hideImagePopup = this.hideImagePopup.bind(this);
    this.onCurrentDirectoryChanged = this.onCurrentDirectoryChanged.bind(this);
  }

  displayImagePopup(e) {
    this.setState({
      popupVisible: true,
      imageItemToDisplay: {
        name: e.fileItem.name,
        url: e.fileItem.dataItem.url
      }
    });
  }

  hideImagePopup() {
    this.setState({
      popupVisible: false
    });
  }

  onCurrentDirectoryChanged(e) {
    this.setState({
      currentPath: e.component.option('currentPath')
    });
  }

  render() {
    return (
      <div>
        <FileManager
          currentPath={this.state.currentPath}
          fileSystemProvider={remoteProvider}
          onSelectedFileOpened={this.displayImagePopup}
          onCurrentDirectoryChanged={this.onCurrentDirectoryChanged}>
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
          closeOnOutsideClick={true}
          title={this.state.imageItemToDisplay.name}
          visible={this.state.popupVisible}
          onHiding={this.hideImagePopup}
          className="photo-popup-content">

          <img src={this.state.imageItemToDisplay.url} className="photo-popup-image" />
        </Popup>
      </div>
    );
  }
}

export default App;
