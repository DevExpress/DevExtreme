import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getWidth } from '@js/core/utils/size';
import { isFunction } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import SplitterControl from '@js/ui/splitter_control';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import Drawer from '@ts/ui/drawer/drawer';
import type { ActiveStateChangedEvent, ApplyPanelSizeEvent } from '@ts/ui/splitter_control';

const window = getWindow();
const ADAPTIVE_STATE_SCREEN_WIDTH = 573;

const FILE_MANAGER_ADAPTIVITY_DRAWER_PANEL_CLASS = 'dx-filemanager-adaptivity-drawer-panel';
const DRAWER_PANEL_CONTENT_INITIAL = 'dx-drawer-panel-content-initial';
const DRAWER_PANEL_CONTENT_ADAPTIVE = 'dx-drawer-panel-content-adaptive';

interface FileManagerAdaptivityControlOptions extends WidgetProperties {
  drawerTemplate?: (container: dxElementWrapper | Element) => void;
  contentTemplate?: (container: dxElementWrapper) => void;
  onAdaptiveStateChanged?: (e: { enabled: boolean }) => void;
}

class FileManagerAdaptivityControl extends Widget<FileManagerAdaptivityControlOptions> {
  _isInAdaptiveState?: boolean;

  _drawer?: Drawer;

  _splitter?: SplitterControl;

  _actions!: { onAdaptiveStateChanged?: ({ enabled }) => void };

  _initMarkup(): void {
    super._initMarkup();

    this._initActions();

    this._isInAdaptiveState = false;

    const $drawer = $('<div>').appendTo(this.$element());

    $('<div>')
      .addClass(FILE_MANAGER_ADAPTIVITY_DRAWER_PANEL_CLASS)
      .appendTo($drawer);

    // @ts-expect-error ts-error
    this._drawer = this._createComponent($drawer, Drawer);
    this._drawer.option({
      opened: true,
      template: this._createDrawerTemplate.bind(this),
    });
    $(this._drawer.content()).addClass(DRAWER_PANEL_CONTENT_INITIAL);

    const $drawerContent = $drawer
      .find(`.${FILE_MANAGER_ADAPTIVITY_DRAWER_PANEL_CLASS}`)
      .first();

    const { contentTemplate: contentRenderer } = this.option();
    if (isFunction(contentRenderer)) {
      contentRenderer($drawerContent);
    }
    this._updateDrawerMaxSize();
  }

  _createDrawerTemplate(container: HTMLElement | dxElementWrapper | Element): void {
    const { drawerTemplate } = this.option();
    drawerTemplate?.(container);
    this._splitter = this._createComponent('<div>', SplitterControl, {
      container: this.$element(),
      leftElement: $(this._drawer?.content()),
      rightElement: $(this._drawer?.viewContent()),
      onApplyPanelSize: this._onApplyPanelSize.bind(this),
      onActiveStateChanged: this._onActiveStateChanged.bind(this),
    });
    this._splitter.$element().appendTo(container);
    this._splitter.disableSplitterCalculation(true);
  }

  _render(): void {
    super._render();
    this._checkAdaptiveState();
  }

  _onApplyPanelSize(e: ApplyPanelSizeEvent): void {
    if (!hasWindow()) {
      return;
    }

    if (!this._splitter?.isSplitterMoved()) {
      this._setDrawerWidth('');
      return;
    }
    $(this._drawer?.content()).removeClass(DRAWER_PANEL_CONTENT_INITIAL);
    this._setDrawerWidth(e.leftPanelWidth);
  }

  _onActiveStateChanged(e: ActiveStateChangedEvent): void {
    this._splitter?.disableSplitterCalculation(!e.isActive);
    if (!e.isActive) {
      this._splitter?.$element().css('left', 'auto');
    }
  }

  _setDrawerWidth(width: string | number): void {
    $(this._drawer?.content()).css('width', width);
    this._updateDrawerMaxSize();
    this._drawer?.resizeViewContent();
  }

  _updateDrawerMaxSize(): void {
    this._drawer?.option('maxSize', this._drawer.getRealPanelWidth());
  }

  // @ts-expect-error ts-error
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _dimensionChanged(dimension): void {
    if (!dimension || dimension !== 'height') {
      this._checkAdaptiveState();
    }
  }

  _checkAdaptiveState(): void {
    const oldState = this._isInAdaptiveState;
    this._isInAdaptiveState = this._isSmallScreen();
    if (oldState !== this._isInAdaptiveState) {
      this.toggleDrawer(!this._isInAdaptiveState, true);
      $(this._drawer?.content()).toggleClass(
        DRAWER_PANEL_CONTENT_ADAPTIVE,
        this._isInAdaptiveState,
      );
      this._raiseAdaptiveStateChanged(this._isInAdaptiveState);
    }
    if (this._isInAdaptiveState && this._isDrawerOpened()) {
      this._updateDrawerMaxSize();
    }
  }

  _isSmallScreen(): boolean {
    return getWidth(window) <= ADAPTIVE_STATE_SCREEN_WIDTH;
  }

  _isDrawerOpened(): boolean | undefined {
    const { opened } = this._drawer?.option() ?? {};
    return opened;
  }

  _initActions(): void {
    this._actions = {
      onAdaptiveStateChanged: this._createActionByOption(
        'onAdaptiveStateChanged',
      ),
    };
  }

  _raiseAdaptiveStateChanged(enabled: boolean): void {
    this._actions?.onAdaptiveStateChanged?.({ enabled });
  }

  _getDefaultOptions(): FileManagerAdaptivityControlOptions {
    return {
      ...super._getDefaultOptions(),
      drawerTemplate: undefined,
      contentTemplate: undefined,
      onAdaptiveStateChanged: undefined,
    };
  }

  _optionChanged(args: OptionChanged<FileManagerAdaptivityControlOptions>): void {
    const { name } = args;

    switch (name) {
      case 'drawerTemplate':
      case 'contentTemplate':
        this.repaint();
        break;
      case 'onAdaptiveStateChanged':
        this._actions[name] = this._createActionByOption(name);
        break;
      default:
        super._optionChanged(args);
    }
  }

  isInAdaptiveState(): boolean | undefined {
    return this._isInAdaptiveState;
  }

  toggleDrawer(showing?: boolean, skipAnimation?: boolean): void {
    this._updateDrawerMaxSize();
    this._drawer?.option('animationEnabled', !skipAnimation);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._drawer?.toggle(showing);
    const isSplitterActive = this._isDrawerOpened() && !this.isInAdaptiveState();
    this._splitter?.toggleDisabled(!isSplitterActive);
  }

  getSplitterElement(): Element | undefined {
    return this._splitter?.getSplitterBorderElement()?.get(0);
  }
}

export default FileManagerAdaptivityControl;
