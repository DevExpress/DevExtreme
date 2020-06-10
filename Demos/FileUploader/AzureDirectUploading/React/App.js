import React from 'react';

import FileUploader from 'devextreme-react/file-uploader';
import { LoadPanel } from 'devextreme-react/load-panel';

const endpointUrl = 'https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-access';
const loadPanelPosition = { of: '#file-uploader' };

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

    this.checkAzureStatus();
  }

  render() {
    return (
      <div id="wrapper" className={this.state.wrapperClassName}>
        <LoadPanel visible={this.state.loadPanelVisible} position={loadPanelPosition} />
        <div id="widget-area">
          <FileUploader id="file-uploader" chunkSize={200000} maxFileSize={1048576} uploadChunk={this.uploadChunk} />
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
          Refer to the <a href="https://js.devexpress.com/Demos/WidgetsGallery/Demo/FileUploader/AzureDirectUploading/React/Light/"
            target="_blank" rel="noopener noreferrer">
            https://js.devexpress.com/Demos/WidgetsGallery/Demo/FileUploader/AzureDirectUploading/React/Light/</a>
          to see the demo online.
        </div>
      </div>
    );
  }

  uploadChunk(file, uploadInfo) {
    let promise = null;

    if(uploadInfo.chunkIndex === 0) {
      promise = gateway.getUploadAccessUrl(file.name).done(accessUrl => {
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

  checkAzureStatus() {
    fetch('https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-status?widgetType=fileUploader')
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

let gateway = null;

export default App;
