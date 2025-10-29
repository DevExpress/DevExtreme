import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { ClickEvent } from '@js/ui/button';
import Button from '@js/ui/button';
import type {
  Attachment,
  AttachmentDownloadEvent,
} from '@js/ui/chat';
import { getImageContainer } from '@ts/core/utils/m_icon';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';
import type { ButtonProps as ButtonProperties } from '@ts/ui/button/button';
import { getFileIconName, getFileSize } from '@ts/ui/file_uploader/file_uploader.utils';

export type Properties = DOMComponentProperties<File> & {
  activeStateEnabled?: boolean;

  focusStateEnabled?: boolean;

  hoverStateEnabled?: boolean;

  data: Attachment;

  onDownload?: (e: AttachmentDownloadEvent) => void;
};

export const CHAT_FILE_CLASS = 'dx-chat-file';
const CHAT_FILE_ICON_CONTAINER_CLASS = 'dx-chat-file-icon-container';
const CHAT_FILE_NAME_CLASS = 'dx-chat-file-name';
const CHAT_FILE_SIZE_CLASS = 'dx-chat-file-size';
const CHAT_FILE_DOWNLOAD_BUTTON_CLASS = 'dx-chat-file-download-button';

class File extends DOMComponent<File, Properties> {
  private _downloadButton?: Button | null;

  private _downloadAction?: (e: Partial<AttachmentDownloadEvent>) => void;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      activeStateEnabled: true,
      focusStateEnabled: true,
      hoverStateEnabled: true,
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
    this.$element()
      .addClass(CHAT_FILE_CLASS)
      .attr('role', 'listitem');

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

    const text = getFileSize(size);

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
    const {
      data,
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    // @ts-expect-error useInkRipple should be optional
    const configuration: ButtonProperties = {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      elementAttr: {
        // @ts-expect-error format params should be extended
        'aria-label': messageLocalization.format('dxChat-downloadButtonLabel', data?.name ?? ''),
      },
      icon: 'download',
      stylingMode: 'text' as const,
      onClick: (e: ClickEvent): void => {
        const event = {
          event: e.event,
          attachment: data,
        };

        this._downloadAction?.(event);
      },
    };

    return configuration;
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    switch (name) {
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
        this._downloadButton?.option(name, value);
        break;

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

  _clean(): void {
    this._cleanDownloadButton();
    this.$element().empty();
    super._clean();
  }

  _cleanDownloadButton(): void {
    this._downloadButton?.dispose();
    this._downloadButton = null;
  }
}

export default File;
