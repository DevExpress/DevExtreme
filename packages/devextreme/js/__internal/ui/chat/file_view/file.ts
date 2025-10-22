import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { ClickEvent } from '@js/ui/button';
import Button from '@js/ui/button';
import type {
  Attachment,
  AttachmentDownloadEvent,
} from '@js/ui/chat';
import { getImageContainer } from '@ts/core/utils/m_icon';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import type { ButtonProps as ButtonProperties } from '@ts/ui/button/button';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getFileIconName = (fileName: string): string => 'file';

export type Properties = WidgetProperties & {
  data: Attachment;

  onDownload?: (e: Partial<AttachmentDownloadEvent>) => void;
};

const CHAT_FILE_CLASS = 'dx-chat-file';
const CHAT_FILE_ICON_CONTAINER_CLASS = 'dx-chat-file-icon-container';
const CHAT_FILE_NAME_CLASS = 'dx-chat-file-name';
const CHAT_FILE_SIZE_CLASS = 'dx-chat-file-size';
const CHAT_FILE_DOWNLOAD_BUTTON_CLASS = 'dx-chat-file-download-button';

class File extends Widget<Properties> {
  private _downloadButton?: Button | null;

  private _downloadAction?: (e: Partial<AttachmentDownloadEvent>) => void;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      data: {
        name: '',
        size: 0,
      },
      onDownload: undefined,
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
    this.$element().addClass(CHAT_FILE_CLASS);
    super._initMarkup();
    this._renderSections();
  }

  private _renderSections(): void {
    this._renderIcon();
    this._renderName();
    this._renderSize();
    this._renderButton();
  }

  private _renderIcon(): void {
    const { data } = this.option();

    const iconName = getFileIconName(data.name);
    const $icon = getImageContainer(iconName) as dxElementWrapper;

    const $iconContainer = $('<div>')
      .addClass(CHAT_FILE_ICON_CONTAINER_CLASS)
      .append($icon);

    this.$element().append($iconContainer);
  }

  private _renderName(): void {
    const { data } = this.option();
    const { name } = data;

    const $name = $('<div>')
      .addClass(CHAT_FILE_NAME_CLASS)
      .text(name)
      .attr('title', name);

    this.$element().append($name);
  }

  private _renderSize(): void {
    const { data } = this.option();
    const { size } = data;

    const text = `${size} B`;

    const $size = $('<div>')
      .addClass(CHAT_FILE_SIZE_CLASS)
      .text(text)
      .attr('title', text);

    this.$element().append($size);
  }

  private _renderButton(): void {
    const $button = $('<div>').addClass(CHAT_FILE_DOWNLOAD_BUTTON_CLASS);

    this._downloadButton = this._createComponent<Button, ButtonProperties>(
      $button,
      Button,
      this._getButtonConfig(),
    );

    this.$element().append($button);
  }

  private _getButtonConfig(): ButtonProperties {
    const { data } = this.option();

    const configuration = {
      icon: 'download',
      stylingMode: 'text' as const,
      onClick: (e: ClickEvent): void => {
        const event = {
          event: e,
          attachment: data,
        };

        this._downloadAction?.(event);
      },
    };

    return configuration as ButtonProperties;
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name } = args;

    switch (name) {
      case 'data':
        this._invalidate();
        break;

      case 'onDownload':
        this._createDownloadAction();
        break;

      default:
        super._optionChanged(args);
    }
  }

  _dispose(): void {
    this._downloadButton?.dispose();
    this._downloadButton = null;
    super._dispose();
  }
}

export default File;
