import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
// import type {
//   ClickEvent,
//   InitializedEvent,
// } from '@js/ui/button';
import type Button from '@js/ui/button';
import type {
  Attachment,
  AttachmentDownloadEvent,
} from '@js/ui/chat';
import { getImageContainer } from '@ts/core/utils/m_icon';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';

export type Properties = WidgetProperties & {
  data?: Attachment;

  onDownload?: (e: Partial<AttachmentDownloadEvent>) => void;
};

const CHAT_FILE_CLASS = 'dx-chat-file';
const CHAT_FILE_MAIN_CLASS = 'dx-chat-file-main';
const CHAT_FILE_META_CLASS = 'dx-chat-file-meta';
const CHAT_FILE_NAME_CLASS = 'dx-chat-file-name';
const CHAT_FILE_SIZE_CLASS = 'dx-chat-file-size';
const CHAT_FILE_DOWNLOAD_BUTTON_CLASS = 'dx-chat-file-download-button';

class File extends Widget<Properties> {
  _downloadButton?: Button | null;

  _downloadAction?: (e: Partial<AttachmentDownloadEvent>) => void;

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

    // this._createSendAction();
  }

  // _createSendAction(): void {
  //   this._downloadAction = this._createActionByOption(
  //     'onDownload',
  //     { excludeValidators: ['disabled'] },
  //   );
  // }

  _initMarkup(): void {
    this.$element().addClass(CHAT_FILE_CLASS);
    super._initMarkup();
    this._renderSections();
  }

  _renderSections(): void {
    this._renderMain();
    this._renderMeta();
  }

  _renderMain(): void {
    const $mainSection = $('<div>').addClass(CHAT_FILE_MAIN_CLASS);

    this.$element().append($mainSection);

    this._renderIcon($mainSection);
    this._renderName($mainSection);
  }

  _renderIcon($section: dxElementWrapper): void {
    const $icon = getImageContainer('file') ?? $('<div>');

    $section.append($icon);
  }

  _renderName($section: dxElementWrapper): void {
    const { data } = this.option();
    const { name } = data ?? {};

    const $name = $('<span>')
      .addClass(CHAT_FILE_NAME_CLASS)
      .text(name ?? '');

    $section.append($name);
  }

  _renderMeta(): void {
    const $metaSection = $('<div>').addClass(CHAT_FILE_META_CLASS);

    this.$element().append($metaSection);

    this._renderSize($metaSection);
    this._renderButton($metaSection);
  }

  _renderSize($section: dxElementWrapper): void {
    const { data } = this.option();
    const { size } = data ?? {};

    const text = `${size ?? 0} KB`;

    const $size = $('<span>')
      .addClass(CHAT_FILE_SIZE_CLASS)
      .text(text);

    $section.append($size);
  }

  _renderButton($section: dxElementWrapper): void {
    const $button = $('<div>').addClass(CHAT_FILE_DOWNLOAD_BUTTON_CLASS);

    $section.append($button);
  }

  // _getSendButtonConfig(): any {
  //   const {
  //     activeStateEnabled,
  //     focusStateEnabled,
  //     hoverStateEnabled,
  //   } = this.option();

  //   const configuration = {
  //     activeStateEnabled,
  //     focusStateEnabled,
  //     hoverStateEnabled,
  //     icon: 'arrowright',
  //     type: 'default',
  //     stylingMode: 'contained',
  //     onClick: (e: ClickEvent): void => {
  //       this._downloadAction?.(e);
  //     },
  //     onInitialized: (e: InitializedEvent): void => {
  //       this._downloadButton = e.component;
  //     },
  //   };

  //   return configuration;
  // }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    switch (name) {
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
        this._downloadButton?.option(name, value);
        break;

      case 'data': {
        this._invalidate();
        break;
      }

      case 'onDownload':
        // this._createSendAction();
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
