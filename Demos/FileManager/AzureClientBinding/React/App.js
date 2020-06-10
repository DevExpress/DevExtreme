import React from 'react';

import FileManager, { Permissions } from 'devextreme-react/file-manager';
import CustomFileSystemProvider from 'devextreme/file_management/custom_provider';
import { LoadPanel } from 'devextreme-react/load-panel';

const endpointUrl = 'https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-access';
const allowedFileExtensions = [];
const loadPanelPosition = { of: '#file-manager' };

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      requests: [],
      loadPanelVisible: true,
      wrapperClassName: ''
    };
    this.onRequestExecuted = this.onRequestExecuted.bind(this);

    gateway = new AzureGateway(endpointUrl, this.onRequestExecuted);
    azure = new AzureFileSystem(gateway);

    this.fileSystemProvider = new CustomFileSystemProvider({
      getItems,
      createDirectory,
      renameItem,
      deleteItem,
      copyItem,
      moveItem,
      uploadFileChunk,
      downloadItems
    });

    this.checkAzureStatus();
  }

  render() {
    return (
      <div id="wrapper" className={this.state.wrapperClassName}>
        <LoadPanel visible={this.state.loadPanelVisible} position={loadPanelPosition} />
        <div id="widget-area">
          <FileManager id="file-manager" fileSystemProvider={this.fileSystemProvider} allowedFileExtensions={allowedFileExtensions}>
            {/* uncomment the code below to enable file/directory management */}
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
          <div id="request-panel">
            {
              this.state.requests.map((r, i) => {
                return <div key={i} className="request-info">
                  <div className="parameter-info">
                    <div className="parameter-name">Method:</div>
                    <div className="parameter-value dx-theme-accent-as-text-color">{r.method}</div>
                  </div>
                  <div className="parameter-info">
                    <div className="parameter-name">Url path:</div>
                    <div className="parameter-value dx-theme-accent-as-text-color">{r.urlPath}</div>
                  </div>
                  <div className="parameter-info">
                    <div className="parameter-name">Query string:</div>
                    <div className="parameter-value dx-theme-accent-as-text-color">{r.queryString}</div>
                  </div>
                  <br />
                </div>;
              })
            }
          </div>
        </div>
        <div id="message-box">
          To run the demo locally, specify your Azure storage account name, access key and container name in the web.config file.
          Refer to the <a href="https://js.devexpress.com/Demos/WidgetsGallery/Demo/FileManager/AzureClientBinding/React/Light/"
            target="_blank" rel="noopener noreferrer">
            https://js.devexpress.com/Demos/WidgetsGallery/Demo/FileManager/AzureClientBinding/React/Light/</a>
          to see the demo online.
        </div>
      </div>
    );
  }

  checkAzureStatus() {
    fetch('https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-status?widgetType=fileManager')
      .then(response => response.json())
      .then(result => {
        const className = result.active ? 'show-widget' : 'show-message';
        this.setState({
          wrapperClassName: className,
          loadPanelVisible: false
        });
      });
  }

  onRequestExecuted({ method, urlPath, queryString }) {
    const request = { method, urlPath, queryString };
    this.setState({ requests: [request, ...this.state.requests] });
  }
}

function getItems(parentDirectory) {
  return azure.getItems(parentDirectory.path);
}

function createDirectory(parentDirectory, name) {
  return azure.createDirectory(parentDirectory.path, name);
}

function renameItem(item, name) {
  return item.isDirectory ? azure.renameDirectory(item.path, name) : azure.renameFile(item.path, name);
}

function deleteItem(item) {
  return item.isDirectory ? azure.deleteDirectory(item.path) : azure.deleteFile(item.path);
}

function copyItem(item, destinationDirectory) {
  const destinationPath = destinationDirectory.path ? `${destinationDirectory.path}/${item.name}` : item.name;
  return item.isDirectory ? azure.copyDirectory(item.path, destinationPath) : azure.copyFile(item.path, destinationPath);
}

function moveItem(item, destinationDirectory) {
  const destinationPath = destinationDirectory.path ? `${destinationDirectory.path}/${item.name}` : item.name;
  return item.isDirectory ? azure.moveDirectory(item.path, destinationPath) : azure.moveFile(item.path, destinationPath);
}

function uploadFileChunk(fileData, uploadInfo, destinationDirectory) {
  let promise = null;

  if(uploadInfo.chunkIndex === 0) {
    const filePath = destinationDirectory.path ? `${destinationDirectory.path}/${fileData.name}` : fileData.name;
    promise = gateway.getUploadAccessUrl(filePath).done(accessUrl => {
      uploadInfo.customData.accessUrl = accessUrl;
    });
  } else {
    promise = Promise.resolve();
  }

  promise = promise.then(() => gateway.putBlock(uploadInfo.customData.accessUrl, uploadInfo.chunkIndex, uploadInfo.chunkBlob));

  if(uploadInfo.chunkIndex === uploadInfo.chunkCount - 1) {
    promise = promise.then(() => gateway.putBlockList(uploadInfo.customData.accessUrl, uploadInfo.chunkCount));
  }

  return promise;
}

function downloadItems(items) {
  azure.downloadFile(items[0].path);
}

let gateway = null;
let azure = null;

export default App;
