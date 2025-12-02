import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import {
  FORM_LOAD_PANEL_CLASS,
  FORM_LOAD_PANEL_WRAPPER_CLASS,
} from '@ts/ui/form/constants';
import { AnimationType } from '@ts/ui/load_indicator';
import type { LoadPanelProperties } from '@ts/ui/load_panel';
import type LoadPanel from '@ts/ui/load_panel';

export const FORM_LOAD_INDICATOR_SIZE = 120;

interface FormLoadPanelDependencies {
  $container: dxElementWrapper;
  onLoadPanelCreate: ($element: dxElementWrapper, options: LoadPanelProperties) => LoadPanel;
}

export class FormLoadPanel {
  private readonly _dependencies: FormLoadPanelDependencies;

  private _loadPanel?: LoadPanel;

  constructor(dependencies: FormLoadPanelDependencies) {
    this._dependencies = dependencies;
  }

  show(): void {
    this._ensureLoadPanel();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._loadPanel?.show();
  }

  hide(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._loadPanel?.hide();
  }

  dispose(): void {
    if (!this._loadPanel) {
      return;
    }

    this._loadPanel.dispose();
    this._loadPanel.$element().remove();
    this._loadPanel = undefined;
  }

  get instance(): LoadPanel | undefined {
    return this._loadPanel;
  }

  option(name: string): unknown {
    return this._loadPanel?.option(name);
  }

  private _ensureLoadPanel(): void {
    if (this._loadPanel) {
      return;
    }

    const $loadPanel = $('<div>')
      .addClass(FORM_LOAD_PANEL_CLASS)
      .appendTo(this._dependencies.$container);

    this._loadPanel = this._dependencies.onLoadPanelCreate($loadPanel, {
      width: FORM_LOAD_INDICATOR_SIZE,
      height: FORM_LOAD_INDICATOR_SIZE,
      maxHeight: undefined,
      maxWidth: undefined,
      position: {
        of: this._dependencies.$container.get(0),
      },
      visible: false,
      showIndicator: true,
      indicatorOptions: {
        animationType: AnimationType.Sparkle,
        width: FORM_LOAD_INDICATOR_SIZE,
        height: FORM_LOAD_INDICATOR_SIZE,
      },
      showPane: false,
      shading: false,
      hideOnOutsideClick: false,
      hideOnParentScroll: false,
      deferRendering: false,
      disabled: false,
      message: '',
      wrapperAttr: {
        class: FORM_LOAD_PANEL_WRAPPER_CLASS,
      },
    });
  }
}
