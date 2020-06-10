import React from 'react';

import FileManager, { Permissions, ItemView } from 'devextreme-react/file-manager';

import { fileItems } from './data.js';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      itemViewMode: 'thumbnails'
    };

    this.onOptionChanged = this.onOptionChanged.bind(this);
  }

  onOptionChanged(e) {
    if(e.fullName === 'itemView.mode') {
      this.setState({
        itemViewMode: e.value
      });
    }
  }

  render() {
    return (
      <FileManager
        fileSystemProvider={fileItems}
        customizeThumbnail={this.customizeIcon}
        height={450}
        onOptionChanged={this.onOptionChanged}>
        <ItemView
          mode={this.state.itemViewMode}>
        </ItemView>
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

  customizeIcon(fileSystemItem) {
    if(fileSystemItem.isDirectory) {
      return '../../../../images/thumbnails/folder.svg';
    }

    const fileExtension = fileSystemItem.getFileExtension();
    switch(fileExtension) {
      case '.txt':
        return '../../../../images/thumbnails/doc-txt.svg';
      case '.rtf':
        return '../../../../images/thumbnails/doc-rtf.svg';
      case '.xml':
        return '../../../../images/thumbnails/doc-xml.svg';
    }
  }

}

export default App;
