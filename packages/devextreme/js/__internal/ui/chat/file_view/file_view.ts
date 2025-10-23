import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Attachment, AttachmentDownloadEvent } from '@js/ui/chat';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';

import File from './file';

export interface FileViewProperties extends WidgetProperties<FileView> {
  files?: Attachment[];

  onDownload?: (e: AttachmentDownloadEvent) => void;
}

export const CHAT_FILE_VIEW_CLASS = 'dx-chat-file-view';
export const CHAT_FILE_VIEW_CONTAINER_CLASS = 'dx-chat-file-view-container';
export const CHAT_FILE_VIEW_ITEM_CLASS = 'dx-chat-file-view-item';

class FileView extends Widget<FileViewProperties> {
  private _fileInstances: File[] = [];

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
    this.$element().addClass(CHAT_FILE_VIEW_CLASS);
    super._initMarkup();

    this._renderContainer();
    this._renderItems();
  }

  _renderContainer(): void {
    const $container = $('<div>').addClass(CHAT_FILE_VIEW_CONTAINER_CLASS);
    this.$element().append($container);
  }

  _getContainer(): dxElementWrapper {
    return this.$element().find(`.${CHAT_FILE_VIEW_CONTAINER_CLASS}`);
  }

  _renderItems(): void {
    const { files = [] } = this.option();
    const $container = this._getContainer();

    this._clearFileInstances();

    files.forEach((file) => {
      this._renderItem(file, $container);
    });
  }

  _renderItem(data: Attachment, $container: dxElementWrapper): void {
    const {
      activeStateEnabled, focusStateEnabled, hoverStateEnabled, onDownload,
    } = this.option();

    const $itemWrapper = $('<div>').addClass(CHAT_FILE_VIEW_ITEM_CLASS);
    const $file = $('<div>');

    $itemWrapper.append($file);
    $container.append($itemWrapper);

    const fileInstance = this._createComponent($file, File, {
      data,
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      onDownload,
    });

    this._fileInstances.push(fileInstance);
  }

  _clearFileInstances(): void {
    this._fileInstances?.forEach((instance) => { instance.dispose(); });
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

export default FileView;
