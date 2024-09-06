import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

const CHAT_MESSAGE_AVATAR_CLASS = 'dx-chat-message-avatar';
const CHAT_MESSAGE_AVATAR_INITIALS_CLASS = 'dx-chat-message-avatar-initials';
const CHAT_MESSAGE_AVATAR_IMAGE_CLASS = 'dx-chat-message-avatar-image';

export interface Properties extends WidgetOptions<Avatar> {
  name?: string;
  url?: string;
}

class Avatar extends Widget<Properties> {
  _$initials?: dxElementWrapper;

  _$image?: dxElementWrapper;

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
    this._renderImage();
    this._renderInitials();
  }

  _renderImage(): void {
    this._$image?.remove();

    const { url } = this.option();

    if (url) {
      this._renderImageElement();
      this._updateUrl();
      this._updateAlt();
    }
  }

  _renderInitials(): void {
    this._$initials?.remove();

    const { name, url } = this.option();

    if (!url && name) {
      this._renderInitialsElement();
      this._updateInitials();
    }
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

  _updateInitials(): void {
    const { name } = this.option();

    this._$initials?.text(this._getInitials(name));
  }

  _updateUrl(): void {
    const { url } = this.option();

    this._$image?.attr('src', url ?? '');
  }

  _updateAlt(): void {
    const { name } = this.option();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this._$image?.attr('alt', name || 'Avatar');
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
      case 'url':
        this._renderAvatarContent();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default Avatar;
