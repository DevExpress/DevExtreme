import React from 'react';
import FileManager, {
  Permissions, ItemView, FileManagerTypes, IItemViewProps,
} from 'devextreme-react/file-manager';
import { fileItems } from './data.ts';

export default function App() {
  const [itemViewMode, setItemViewMode] = React.useState<IItemViewProps['mode']>('thumbnails');

  const onOptionChanged = React.useCallback((e: FileManagerTypes.OptionChangedEvent) => {
    if (e.fullName === 'itemView.mode') {
      setItemViewMode(e.value);
    }
  }, [setItemViewMode]);

  const customizeIcon = React.useCallback<FileManagerTypes.Properties['customizeThumbnail']>((fileSystemItem) => {
    if (fileSystemItem.isDirectory) {
      return '../../../../images/thumbnails/folder.svg';
    }

    const fileExtension = fileSystemItem.getFileExtension();
    switch (fileExtension) {
      case '.txt':
        return '../../../../images/thumbnails/doc-txt.svg';
      case '.rtf':
        return '../../../../images/thumbnails/doc-rtf.svg';
      case '.xml':
        return '../../../../images/thumbnails/doc-xml.svg';
      default:
        return '../../../../images/thumbnails/doc-txt.svg';
    }
  }, []);

  return (
    <FileManager
      fileSystemProvider={fileItems}
      customizeThumbnail={customizeIcon}
      height={450}
      onOptionChanged={onOptionChanged}
    >
      <ItemView mode={itemViewMode} />
      <Permissions
        create={true}
        copy={true}
        move={true}
        delete={true}
        rename={true}
        upload={true}
        download={true}
      />
    </FileManager>
  );
}
