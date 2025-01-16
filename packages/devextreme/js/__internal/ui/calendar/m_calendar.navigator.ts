import type { DefaultOptionsRule } from '@js/core/options/utils';
import $ from '@js/core/renderer';
import type { ButtonStyle, ButtonType, ClickEvent } from '@js/ui/button';
import Button from '@js/ui/button';
import { isFluent, isMaterial } from '@js/ui/themes';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import Widget from '@ts/core/widget/widget';

const CALENDAR_NAVIGATOR_CLASS = 'dx-calendar-navigator';
const CALENDAR_NAVIGATOR_PREVIOUS_MONTH_CLASS = 'dx-calendar-navigator-previous-month';
const CALENDAR_NAVIGATOR_NEXT_MONTH_CLASS = 'dx-calendar-navigator-next-month';
const CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS = 'dx-calendar-navigator-previous-view';
const CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS = 'dx-calendar-navigator-next-view';
const CALENDAR_NAVIGATOR_DISABLED_LINK_CLASS = 'dx-calendar-disabled-navigator-link';
const CALENDAR_NAVIGATOR_CAPTION_BUTTON_CLASS = 'dx-calendar-caption-button';
const BUTTON_TEXT_CLASS = 'dx-button-text';

export interface NavigatorOptions extends WidgetOptions<Navigator> {
  onClick?: ((e: ClickEvent) => void);
  onCaptionClick?: ((e: ClickEvent) => void);
  type?: ButtonType;
  stylingMode?: ButtonStyle;
  text: string;
}

class Navigator extends Widget<NavigatorOptions> {
  _clickAction?: ((event: { direction: number; event: ClickEvent }) => void) | null;

  _captionClickAction?: ((event: { event: ClickEvent }) => void) | null;

  _prevButton!: Button;

  _caption!: Button;

  _nextButton!: Button;

  _getDefaultOptions(): NavigatorOptions {
    return {
      ...super._getDefaultOptions(),
      onClick: undefined,
      onCaptionClick: undefined,
      type: 'normal',
      stylingMode: 'outlined',
      text: '',
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<NavigatorOptions>[] {
    return super._defaultOptionsRules().concat([
      {
        device() {
          // @ts-expect-error
          return isMaterial();
        },
        options: {
          type: 'default',
          stylingMode: 'text',
        },
      },
      {
        device() {
          // @ts-expect-error
          return isFluent();
        },
        options: {
          type: 'normal',
          stylingMode: 'text',
        },
      },
    ]);
  }

  _init(): void {
    super._init();

    this._initActions();
  }

  _initActions(): void {
    this._clickAction = this._createActionByOption('onClick');
    this._captionClickAction = this._createActionByOption('onCaptionClick');
  }

  _initMarkup(): void {
    super._initMarkup();

    $(this.element()).addClass(CALENDAR_NAVIGATOR_CLASS);

    this._renderButtons();

    this._renderCaption();
  }

  _renderButtons(): void {
    const {
      rtlEnabled, type, stylingMode, focusStateEnabled,
    } = this.option();
    const direction = 1;

    this._prevButton = this._createComponent(
      $('<div>'),
      Button,
      {
        focusStateEnabled,
        icon: rtlEnabled ? 'chevronright' : 'chevronleft',
        onClick: (e) => { this._clickAction?.({ direction: -direction, event: e }); },
        type,
        stylingMode,
        integrationOptions: {},
      },
    );

    const $prevButton = $(this._prevButton.element())
      .addClass(CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS)
      .addClass(CALENDAR_NAVIGATOR_PREVIOUS_MONTH_CLASS);

    this._nextButton = this._createComponent(
      $('<div>'),
      Button,
      {
        focusStateEnabled,
        icon: rtlEnabled ? 'chevronleft' : 'chevronright',
        onClick: (e) => { this._clickAction?.({ direction, event: e }); },
        type,
        stylingMode,
        integrationOptions: {},
      },
    );

    const $nextButton = $(this._nextButton.element())
      .addClass(CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS)
      .addClass(CALENDAR_NAVIGATOR_NEXT_MONTH_CLASS);

    this._caption = this._createComponent(
      $('<div>').addClass(CALENDAR_NAVIGATOR_CAPTION_BUTTON_CLASS),
      Button,
      {
        focusStateEnabled,
        onClick: (e) => { this._captionClickAction?.({ event: e }); },
        type,
        stylingMode,
        template: (_, content) => {
          const { text } = this.option();

          const captionSeparator = ' - ';
          const viewCaptionTexts = text.split(captionSeparator);

          viewCaptionTexts.forEach((captionText) => {
            $(content)
              .append($('<span>').addClass(BUTTON_TEXT_CLASS).text(captionText));
          });
        },
        integrationOptions: {},
      },
    );

    const $caption = this._caption.$element();

    this.$element()
      .append($prevButton)
      .append($caption)
      .append($nextButton);
  }

  _renderCaption(): void {
    const { text } = this.option();

    this._caption?.option('text', text);
  }

  toggleButton(
    buttonPrefix: 'next' | 'prev',
    value: boolean,
  ): void {
    const buttonName = `_${buttonPrefix}Button`;
    const button = this[buttonName];

    if (button) {
      button.option('disabled', value);
      button.$element().toggleClass(CALENDAR_NAVIGATOR_DISABLED_LINK_CLASS, value);
    }
  }

  _optionChanged(args: Record<string, unknown>): void {
    switch (args.name) {
      case 'text':
        this._renderCaption();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default Navigator;
