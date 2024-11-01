import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

const AVATAR_CLASS = 'dx-avatar';
const AVATAR_INITIALS_CLASS = 'dx-avatar-initials';
const AVATAR_IMAGE_CLASS = 'dx-avatar-image';

export interface Properties extends WidgetOptions<Avatar> {
  name?: string;
  url?: string;
  alt?: string;
}

class Avatar extends Widget<Properties> {
  _$content?: dxElementWrapper;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      name: 'Unknown User',
      url: '',
      alt: '',
    };
  }

  _initMarkup(): void {
    $(this.element()).addClass(AVATAR_CLASS);

    super._initMarkup();

    this._renderAvatarContent();
  }

  _renderAvatarContent(): void {
    this._$content?.remove();

    if (this._isValuableUrl()) {
      this._renderImage();

      return;
    }

    this._renderInitials();
  }

  _renderImage(): void {
    this._renderImageElement();
    this._updateUrl();
    this._updateAlt();
  }

  _renderInitials(): void {
    this._renderInitialsElement();
    this._updateInitials();
  }

  _renderImageElement(): void {
    this._$content = $('<img>')
      .addClass(AVATAR_IMAGE_CLASS)
      .appendTo(this.element());
  }

  _renderInitialsElement(): void {
    this._$content = $('<div>')
      .addClass(AVATAR_INITIALS_CLASS)
      .appendTo(this.element());
  }

  _updateInitials(): void {
    const { name } = this.option();

    this._$content?.text(this._getInitials(name));
  }

  _updateUrl(): void {
    const { url } = this.option();

    this._$content?.attr('src', url ?? '');
  }

  _updateAlt(): void {
    const { alt, name } = this.option();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const altText = alt || name || messageLocalization.format('dxAvatar-defaultImageAlt');

    this._$content?.attr('alt', altText);
  }

  _isValuableUrl(): boolean {
    const { url } = this.option();

    const result = !!url?.trim?.();

    return result;
  }

  _getInitials(name: string | undefined): string {
    if (isDefined(name)) {
      const splitValue = String(name).trim().split(/\s+/);

      const firstInitial = this._getFirstChar(splitValue[0]);
      const secondInitial = this._getFirstChar(splitValue[1]);

      const result = `${firstInitial}${secondInitial}`;

      return result;
    }

    return '';
  }

  _getFirstChar(value: string | undefined): string {
    return value?.charAt(0).toUpperCase() ?? '';
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name } = args;

    switch (name) {
      case 'alt':
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
