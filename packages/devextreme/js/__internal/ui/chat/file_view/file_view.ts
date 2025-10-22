import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Attachment, AttachmentDownloadEvent } from '@js/ui/chat';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';

export interface FileViewProperties extends WidgetProperties<FileView> {
  files?: Attachment[];

  onDownload?: (e: AttachmentDownloadEvent) => void;
}

export const FILE_VIEW_CLASS = 'dx-file-view';
export const FILE_VIEW_CONTAINER_CLASS = 'dx-file-view-container';
export const FILE_VIEW_ITEM_CLASS = 'dx-file-view-item';
// TODO: Import from File component once it's ready
export const CHAT_FILE_CLASS = 'dx-chat-file';

class FileView extends Widget<FileViewProperties> {
  // TODO: Replace with the actual type once File component is ready
  private _fileInstances: Widget[] = [];

  _getDefaultOptions(): FileViewProperties {
    return {
      ...super._getDefaultOptions(),
      files: [],
    };
  }

  _init(): void {
    super._init();
  }

  _initMarkup(): void {
    this.$element().addClass(FILE_VIEW_CLASS);
    super._initMarkup();

    this._renderContainer();
    this._renderItems();
  }

  _renderContainer(): void {
    const $container = $('<div>').addClass(FILE_VIEW_CONTAINER_CLASS);
    this.$element().append($container);
  }

  _getContainer(): dxElementWrapper {
    return this.$element().find(`.${FILE_VIEW_CONTAINER_CLASS}`);
  }

  _renderItems(): void {
    const { files = [] } = this.option();
    const $container = this._getContainer();

    this._clearFileInstances();

    files.forEach((file) => {
      this._renderItem(file, $container);
    });
  }

  _renderItem(attachment: Attachment, $container: dxElementWrapper): void {
    const $itemWrapper = $('<div>').addClass(FILE_VIEW_ITEM_CLASS);

    $container.append($itemWrapper);

    // TODO: Uncomment once File component is ready
    // const {
    //   activeStateEnabled, focusStateEnabled, hoverStateEnabled, onDownload,
    // } = this.option();
    // const fileInstance = this._createComponent($itemWrapper, File, {
    //   data,
    //   onDownload,
    //   activeStateEnabled,
    //   focusStateEnabled,
    //   hoverStateEnabled,
    // }).dxFile('instance');
    //
    // this._fileInstances.push(fileInstance);

    // TODO: Remove once File component is ready
    this._renderPlaceholderItem(attachment, $itemWrapper);
  }

  // TODO: Remove once File component is ready
  _renderPlaceholderItem({ name, size }: Attachment, $container: dxElementWrapper): void {
    const $placeholder = $('<div>')
      .addClass(CHAT_FILE_CLASS)
      .text(`${name} (${size} KB)`);

    $container.append($placeholder);
  }

  _clearFileInstances(): void {
    this._fileInstances?.forEach((instance) => {
      instance.dispose();
    });

    this._fileInstances = [];
    this._getContainer().empty();
  }

  _dispose(): void {
    this._clearFileInstances();
    super._dispose();
  }

  _optionChanged(args: OptionChanged<FileViewProperties>): void {
    const { name, value } = args;

    switch (name) {
      case 'files':
        this._renderItems();
        break;

      case 'onDownload':
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
        this._fileInstances.forEach((instance) => {
          instance.option(name, value);
        });
        break;

      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxFileView', FileView);

export default FileView;
