import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

const CHAT_MESSAGE_AVATAR_CLASS = 'dx-chat-message-avatar';
const CHAT_MESSAGE_AVATAR_INITIALS_CLASS = 'dx-chat-message-avatar-initials';
const CHAT_MESSAGE_AVATAR_IMAGE_CLASS = 'dx-chat-message-avatar-image';

const HIDDEN_CLASS = 'dx-hidden';

export interface Properties extends WidgetOptions<Avatar> {
  name?: string;
  url?: string;
}

class Avatar extends Widget<Properties> {
  _$initials!: dxElementWrapper;

  _$image!: dxElementWrapper;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      name: '',
      url: '',
    };
  }

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_MESSAGE_AVATAR_CLASS);

    super._initMarkup();

    this._renderAvatarContent();
  }

  _renderAvatarContent(): void {
    this._renderImageElement();
    this._updateImageVisibility();
    this._updateUrl();

    this._renderInitialsElement();
    this._updateName();
  }

  _renderImageElement(): void {
    this._$image = $('<img>')
      .addClass(CHAT_MESSAGE_AVATAR_IMAGE_CLASS)
      .appendTo(this.element());
  }

  _renderInitialsElement(): void {
    this._$initials = $('<div>')
      .addClass(CHAT_MESSAGE_AVATAR_INITIALS_CLASS)
      .appendTo(this.element());
  }

  _updateName(): void {
    const { name } = this.option();

    this._$initials.text(this._getInitials(name));
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this._$image.attr('alt', name || 'avatar');
  }

  _updateUrl(): void {
    const { url } = this.option();

    this._$image.attr('src', url ?? '');
  }

  _updateImageVisibility(): void {
    const { url } = this.option();

    const isImageHidden = Boolean(!url);
    this._$image.toggleClass(HIDDEN_CLASS, isImageHidden);
  }

  _getInitials(name: string | undefined): string {
    if (isDefined(name)) {
      return String(name).charAt(0).toUpperCase();
    }

    return '';
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name } = args;

    switch (name) {
      case 'name':
        this._updateName();
        break;
      case 'url':
        this._updateUrl();
        this._updateImageVisibility();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default Avatar;
