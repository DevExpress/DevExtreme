import React from 'react';
import FileUploader from 'devextreme-react/file-uploader';
import ProgressBar from 'devextreme-react/progress-bar';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDropZoneActive: false,
      imageSource: '#',
      progressVisible: false,
      progressValue: 0
    };

    this.onDropZoneEnter = this.onDropZoneEnter.bind(this);
    this.onDropZoneLeave = this.onDropZoneLeave.bind(this);
    this.onUploaded = this.onUploaded.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onUploadStarted = this.onUploadStarted.bind(this);
  }

  render() {
    return (
      <div className="widget-container flex-box">
        <span>Profile Picture</span>
        <div id="dropzone-external" className={`flex-box ${this.state.isDropZoneActive ? 'dx-theme-accent-as-border-color dropzone-active' : 'dx-theme-border-color'}`}>
          <img id="dropzone-image" src={this.state.imageSource} hidden={!this.state.imageSource} alt="" />
          <div id="dropzone-text" className="flex-box">
            <span>Drag & Drop the desired file</span>
            <span>…or click to browse for a file instead.</span>
          </div>
          <ProgressBar
            id="upload-progress"
            min={0}
            max={100}
            width="30%"
            showStatus={false}
            visible={this.state.progressVisible}
            value={this.state.progressValue}
          ></ProgressBar>
        </div>
        <FileUploader
          id="file-uploader"
          dialogTrigger="#dropzone-external"
          dropZone="#dropzone-external"
          multiple={false}
          allowedFileExtensions={['.jpg', '.jpeg', '.gif', '.png']}
          uploadMode="instantly"
          uploadUrl="https://js.devexpress.com/Content/Services/upload.aspx"
          visible={false}
          onDropZoneEnter={this.onDropZoneEnter}
          onDropZoneLeave={this.onDropZoneLeave}
          onUploaded={this.onUploaded}
          onProgress={this.onProgress}
          onUploadStarted={this.onUploadStarted}
        ></FileUploader>
      </div>
    );
  }

  onDropZoneEnter(e) {
    if(e.dropZoneElement.id === 'dropzone-external') {
      this.setState({ isDropZoneActive: true });
    }
  }

  onDropZoneLeave(e) {
    if(e.dropZoneElement.id === 'dropzone-external') {
      this.setState({ isDropZoneActive: false });
    }
  }

  onUploaded(e) {
    const file = e.file;
    const dropZoneText = document.getElementById('dropzone-text');
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.setState({
        isDropZoneActive: false,
        imageSource: fileReader.result
      });
    };
    fileReader.readAsDataURL(file);
    dropZoneText.style.display = 'none';
    this.setState({ progressVisible: false });
    this.setState({ progressValue: 0 });
  }

  onProgress(e) {
    this.setState({ progressValue: e.bytesLoaded / e.bytesTotal * 100 });
  }

  onUploadStarted() {
    this.setState({ imageSource: '' });
    this.setState({ progressVisible: true });
  }
}

export default App;
