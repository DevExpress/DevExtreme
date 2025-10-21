// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from '@js/core/renderer';
import type {
  ClickEvent,
  InitializedEvent,
} from '@js/ui/button';
import type Button from '@js/ui/button';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';

export type Properties = WidgetProperties & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDownload: (e: any) => void;
};

class File extends Widget<Properties> {
  _downloadButton?: Button | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _downloadAction?: (e: any) => void;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
    };
  }

  _init(): void {
    super._init();

    this._createSendAction();
  }

  _createSendAction(): void {
    this._downloadAction = this._createActionByOption(
      'onDownload',
      { excludeValidators: ['disabled'] },
    );
  }

  _initMarkup(): void {
    super._initMarkup();
    this._renderSections();
  }

  _renderSections(): void {

  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getSendButtonConfig(): any {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const configuration = {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      icon: 'arrowright',
      type: 'default',
      stylingMode: 'contained',
      onClick: (e: ClickEvent): void => {
        this._downloadAction?.(e);
      },
      onInitialized: (e: InitializedEvent): void => {
        this._downloadButton = e.component;
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

      case 'data': {
        /** invalidate */
        break;
      }

      case 'onDownload':
        this._createSendAction();
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
