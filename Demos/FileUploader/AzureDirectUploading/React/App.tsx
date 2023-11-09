import React from 'react';

import FileUploader, { FileUploaderTypes } from 'devextreme-react/file-uploader';
import { LoadPanel } from 'devextreme-react/load-panel';
import { AzureGateway } from './azure.file.system.js'; // eslint-disable-line import/no-unresolved

const endpointUrl = 'https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-access';
const loadPanelPosition = { of: '#file-uploader' };

let gateway = null;

export default function App() {
  const [requests, setRequests] = React.useState([]);
  const [loadPanelVisible, setLoadPanelVisible] = React.useState(true);
  const [wrapperClassName, setWrapperClassName] = React.useState('');

  const checkAzureStatus = React.useCallback(() => {
    fetch('https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-status?widgetType=fileUploader')
      .then((response) => response.json())
      .then((result) => {
        const className = result.active ? 'show-widget' : 'show-message';
        setWrapperClassName(className);
        setLoadPanelVisible(false);
      });
  }, [setWrapperClassName, setLoadPanelVisible]);

  React.useEffect(() => {
    gateway = new AzureGateway(endpointUrl, onRequestExecuted);
    checkAzureStatus();

    return () => {
      gateway.dispose();
    };
  }, [checkAzureStatus]);

  const onRequestExecuted = React.useCallback(({ method, urlPath, queryString }) => {
    const request = { method, urlPath, queryString };
    setRequests([request, ...requests]);
  }, [requests]);

  const uploadChunk = React.useCallback<FileUploaderTypes.Properties['uploadChunk']>((file, uploadInfo) => {
    let promise = null;

    if (uploadInfo.chunkIndex === 0) {
      promise = gateway.getUploadAccessUrl(file.name).then((accessURLs: { url1: any; }) => {
        uploadInfo.customData.accessUrl = accessURLs.url1;
      });
    } else {
      promise = Promise.resolve();
    }

    promise = promise.then(() => {
      const accessUrl = uploadInfo.customData.accessUrl;
      return gateway.putBlock(
        accessUrl,
        uploadInfo.chunkIndex,
        uploadInfo.chunkBlob,
      );
    });

    if (uploadInfo.chunkIndex === uploadInfo.chunkCount - 1) {
      promise = promise.then(() => gateway.putBlockList(
        uploadInfo.customData.accessUrl,
        uploadInfo.chunkCount,
      ));
    }

    return promise;
  }, []);

  return (
    <div id="wrapper" className={wrapperClassName}>
      <LoadPanel visible={loadPanelVisible} position={loadPanelPosition} />
      <div id="widget-area">
        <FileUploader id="file-uploader" chunkSize={200000} maxFileSize={1048576} uploadChunk={uploadChunk} />
        <div id="request-panel">
          {requests.map((r, i) => (
            <div key={i} className="request-info">
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
            </div>
          ))}
        </div>
      </div>
      <div id="message-box">
        To run the demo locally, specify your Azure storage account name,
        access key and container name in the web.config file.
        Refer to the <a href="https://js.devexpress.com/Demos/WidgetsGallery/Demo/FileUploader/AzureDirectUploading/React/Light/"
          target="_blank" rel="noopener noreferrer">
          https://js.devexpress.com/Demos/WidgetsGallery/Demo/FileUploader/AzureDirectUploading/React/Light/</a>
        to see the demo online.
      </div>
    </div>
  );
}
