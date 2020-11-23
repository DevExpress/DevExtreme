import React from 'react';
import FileUploader from 'devextreme-react/file-uploader';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      multiple: false,
      uploadMode: 'instantly',
      accept: '*',
      selectedFiles: []
    };

    this.fileTypesSource = [
      { name: 'All types', value: '*' },
      { name: 'Images', value: 'image/*' },
      { name: 'Videos', value: 'video/*' }
    ];

    this.onSelectedFilesChanged = this.onSelectedFilesChanged.bind(this);
    this.onAcceptChanged = this.onAcceptChanged.bind(this);
    this.onUploadModeChanged = this.onUploadModeChanged.bind(this);
    this.onMultipleChanged = this.onMultipleChanged.bind(this);
  }

  render() {
    return (
      <div>
        <div className="widget-container">
          <FileUploader multiple={this.state.multiple} accept={this.state.accept} uploadMode={this.state.uploadMode}
            uploadUrl="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload" onValueChanged={this.onSelectedFilesChanged} />
          <div className="content" style={{ display: this.state.selectedFiles.length > 0 ? 'block' : 'none' }}>
            <div>
              <h4>Selected Files</h4>
              {
                this.state.selectedFiles.map((file, i) => {
                  return <div className="selected-item" key={i}>
                    <span>{`Name: ${file.name}`}<br /></span>
                    <span>{`Size ${file.size}`}<br /></span>
                    <span>{`Type ${file.size}`}<br /></span>
                    <span>{`Last Modified Date: ${file.lastModifiedDate}`}</span>
                  </div>;
                })
              }
            </div>
          </div>
        </div>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>File types</span>
            <SelectBox dataSource={this.fileTypesSource} valueExpr="value" displayExpr="name" defaultValue="*" onValueChanged={this.onAcceptChanged} />
          </div>
          <div className="option">
            <span>Upload mode</span>
            <SelectBox items={['instantly', 'useButtons']} defaultValue="instantly" onValueChanged={this.onUploadModeChanged} />
          </div>
          <div className="option">
            <CheckBox text="Allow multiple files selection" onValueChanged={this.onMultipleChanged} />
          </div>
        </div>
      </div>
    );
  }

  onSelectedFilesChanged(e) {
    this.setState({ selectedFiles: e.value });
  }

  onAcceptChanged(e) {
    this.setState({ accept: e.value });
  }

  onUploadModeChanged(e) {
    this.setState({ uploadMode: e.value });
  }

  onMultipleChanged(e) {
    this.setState({ multiple: e.value });
  }

}

export default App;
