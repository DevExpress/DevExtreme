import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import type { Attachment, AttachmentDownloadEvent } from '@js/ui/chat';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';
import type { Properties as FileProperties } from '@ts/ui/chat/file_view/file';
import File from '@ts/ui/chat/file_view/file';

export interface FileViewProperties extends DOMComponentProperties<FileView> {
  activeStateEnabled?: boolean;

  focusStateEnabled?: boolean;

  hoverStateEnabled?: boolean;

  files?: Attachment[];

  onDownload?: (e: AttachmentDownloadEvent) => void;
}

export const CHAT_FILE_VIEW_CLASS = 'dx-chat-file-view';
export const CHAT_FILE_VIEW_ITEM_CLASS = 'dx-chat-file-view-item';

class FileView extends DOMComponent<FileView, FileViewProperties> {
  private _fileInstances: File[] = [];

  private _downloadAction?: (e: Partial<AttachmentDownloadEvent>) => void;

  _getDefaultOptions(): FileViewProperties {
    return {
      ...super._getDefaultOptions(),
      files: [],
      activeStateEnabled: true,
      focusStateEnabled: true,
      hoverStateEnabled: true,
    };
  }

  _init(): void {
    super._init();

    this._createDownloadAction();
  }

  _createDownloadAction(): void {
    this._downloadAction = this._createActionByOption(
      'onDownload',
      { excludeValidators: ['disabled'] },
    );
  }

  _initMarkup(): void {
    this.$element().addClass(CHAT_FILE_VIEW_CLASS);

    super._initMarkup();

    this._renderItems();
    this._toggleAria();
  }

  _renderItems(): void {
    const { files = [] } = this.option();

    this._clearFileInstances();

    files.forEach((file) => {
      this._renderItem(file);
    });
  }

  _renderItem(data: Attachment): void {
    const $file = $('<div>');

    const fileInstance = this._createComponent($file, File, this._getFileConfig(data));

    this.$element().append($file);

    this._fileInstances.push(fileInstance);
  }

  _getFileConfig(data: Attachment): FileProperties {
    const { activeStateEnabled, focusStateEnabled, hoverStateEnabled } = this.option();

    const configuration: FileProperties = {
      data,
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      onDownload: (event) => {
        this._downloadAction?.(event);
      },
    };

    return configuration;
  }

  _toggleAria(): void {
    const { files } = this.option();

    const applyAria = Boolean(files?.length);

    const aria = {
      role: applyAria ? 'list' : null,
      'aria-label': applyAria
        ? messageLocalization.format('dxChat-fileViewLabel')
        : null,
    };

    // @ts-expect-error attr type should be extdened
    this.$element().attr(aria);
  }

  _clearFileInstances(): void {
    this._fileInstances?.forEach((instance) => { instance.dispose(); });
    this._fileInstances = [];
    this.$element().empty();
  }

  _dispose(): void {
    this._clearFileInstances();
    super._dispose();
  }

  _optionChanged(args: OptionChanged<FileViewProperties>): void {
    const { name } = args;

    switch (name) {
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
        this._renderItems();
        break;

      case 'files':
        this._renderItems();
        this._toggleAria();
        break;

      case 'onDownload':
        this._createDownloadAction();
        break;

      default:
        super._optionChanged(args);
    }
  }
}

export default FileView;
