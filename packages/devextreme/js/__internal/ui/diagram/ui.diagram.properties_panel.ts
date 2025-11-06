/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { PositionConfig } from '@js/common/core/animation';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getHeight, getOuterHeight } from '@js/core/utils/size';
import type { dxPopupAnimation } from '@js/ui/popup';
import DiagramCommandsManager from '@ts/ui/diagram/diagram.commands_manager';
import DiagramFloatingPanel from '@ts/ui/diagram/ui.diagram.floating_panel';
import type { PopupProperties } from '@ts/ui/popup/m_popup';
import ScrollView from '@ts/ui/scroll_view/scroll_view';
import TabPanel from '@ts/ui/tab_panel/tab_panel';

const DIAGRAM_PROPERTIES_POPUP_WIDTH = 420;
const DIAGRAM_PROPERTIES_POPUP_HEIGHT = 340;
const DIAGRAM_PROPERTIES_POPUP_CLASS = 'dx-diagram-properties-popup';
const DIAGRAM_PROPERTIES_POPUP_NOTABS_CLASS = 'dx-diagram-properties-popup-notabs';
const DIAGRAM_PROPERTIES_PANEL_CLASS = 'dx-diagram-properties-panel';
const DIAGRAM_PROPERTIES_PANEL_GROUP_TITLE_CLASS = 'dx-diagram-properties-panel-group-title';
const DIAGRAM_PROPERTIES_PANEL_GROUP_TOOLBAR_CLASS = 'dx-diagram-properties-panel-group-toolbar';

class DiagramPropertiesPanel extends DiagramFloatingPanel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _commandTabs?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _toolbars!: any[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _selectedToolbar?: any;

  private _tabPanel?: TabPanel;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _firstScrollView?: any;

  private _scrollViewHeight?: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onSelectedGroupChangedAction?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onCreateToolbarAction?: any;

  _init(): void {
    super._init();

    this._commandTabs = DiagramCommandsManager.getPropertyPanelCommandTabs(
      this.option('propertyTabs'),
    );
    this._createOnCreateToolbar();
    this._createOnSelectedGroupChanged();
  }

  _initMarkup(): void {
    this._toolbars = [];
    this._selectedToolbar = undefined;

    super._initMarkup();
  }

  _getPopupClass(): string {
    let className = DIAGRAM_PROPERTIES_POPUP_CLASS;
    if (!this._hasTabPanel()) {
      className += ` ${DIAGRAM_PROPERTIES_POPUP_NOTABS_CLASS}`;
    }
    return className;
  }

  _getPopupWidth(): string | number {
    return this.isMobileView() ? '100%' : DIAGRAM_PROPERTIES_POPUP_WIDTH;
  }

  _getPopupHeight(): number {
    return DIAGRAM_PROPERTIES_POPUP_HEIGHT;
  }

  _getPopupPosition(): PositionConfig {
    // @ts-expect-error ts-error
    const { offsetParent, offsetX, offsetY } = this.option();
    if (this.isMobileView()) {
      return {
        my: 'left bottom',
        at: 'left bottom',
        of: offsetParent,
      };
    }
    return {
      my: 'right bottom',
      at: 'right bottom',
      of: offsetParent,
      offset: `-${offsetX} -${offsetY}`,
    };
  }

  _getPopupAnimation(): dxPopupAnimation {
    const $parent = this.option('offsetParent');
    if (this.isMobileView()) {
      return {
        hide: this._getPopupSlideAnimationObject({
          direction: 'bottom',
          from: {
            position: {
              my: 'left bottom',
              at: 'left bottom',
              of: $parent,
            },
          },
          to: {
            position: {
              my: 'left top',
              at: 'left bottom',
              of: $parent,
            },
          },
        }),
        show: this._getPopupSlideAnimationObject({
          direction: 'top',
          from: {
            position: {
              my: 'left top',
              at: 'left bottom',
              of: $parent,
            },
          },
          to: {
            position: {
              my: 'left bottom',
              at: 'left bottom',
              of: $parent,
            },
          },
        }),
      };
    }
    return super._getPopupAnimation();
  }

  _getPopupOptions(): PopupProperties {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getPopupOptions(), {
      showTitle: this.isMobileView(),
      showCloseButton: this.isMobileView(),
    });
  }

  _renderPopupContent($parent): void {
    if (!this._commandTabs.length) return;

    const $panel = $('<div>')
      .addClass(DIAGRAM_PROPERTIES_PANEL_CLASS)
      .appendTo($parent);
    if (this._hasTabPanel()) {
      this._renderTabPanel($panel);
    } else {
      this._renderTabContent($panel, this._commandTabs[0], 0, true);
    }
  }

  _hasTabPanel(): boolean {
    return this._commandTabs.length > 1;
  }

  _renderTabPanel($parent): void {
    const $tabPanel = $('<div>').appendTo($parent);
    this._tabPanel = this._createComponent($tabPanel, TabPanel, {
      focusStateEnabled: false,
      dataSource: this._commandTabs,
      itemTemplate: (data, index, $element): void => {
        // @ts-expect-error ts-error
        this._renderTabContent($element, data, index);
      },
      onSelectionChanged: (): void => {
        this._onSelectedGroupChangedAction();
        this._onPointerUpAction();
      },
      onContentReady: (e): void => {
        this._popup?.option(
          'height',
          getHeight(e.component.$element())
          + this._getVerticalPaddingsAndBorders(),
        );
        if (this._firstScrollView) {
          this._scrollViewHeight = getOuterHeight(
            this._firstScrollView.$element(),
          );
          this._firstScrollView.option('height', this._scrollViewHeight);
        }
      },
    });
  }

  _renderTabContent($parent, tab, index, isSingleTab): void {
    const $scrollViewWrapper = $('<div>').appendTo($parent);
    const scrollView = this._createComponent($scrollViewWrapper, ScrollView, {
      height: this._scrollViewHeight,
    });
    this._renderTabInnerContent(scrollView.content(), tab, index);
    if (isSingleTab) {
      this._popup?.option(
        'height',
        getHeight(scrollView.$element()) + this._getVerticalPaddingsAndBorders(),
      );
    } else {
      this._firstScrollView = this._firstScrollView || scrollView;
    }
  }

  _renderTabInnerContent($parent, group, index): void {
    if (group.groups) {
      group.groups.forEach((sg): void => {
        this._renderTabGroupContent($parent, index, sg.title, sg.commands);
      });
    } else if (group.commands) {
      this._renderTabGroupContent($parent, index, undefined, group.commands);
    }
  }

  _renderTabGroupContent($parent, index, title, commands): void {
    if (title) {
      $('<div>')
        .addClass(DIAGRAM_PROPERTIES_PANEL_GROUP_TITLE_CLASS)
        .appendTo($parent)
        .text(title);
    }
    const $toolbar = $('<div>')
      .addClass(DIAGRAM_PROPERTIES_PANEL_GROUP_TOOLBAR_CLASS)
      .appendTo($parent);
    const args = {
      $parent: $toolbar,
      commands,
    };
    this._onCreateToolbarAction(args);
    if (!this._toolbars[index]) {
      this._toolbars[index] = [];
    }
    // @ts-expect-error ts-error
    this._toolbars[index].push(args.toolbar);
    // @ts-expect-error ts-error
    this._selectedToolbar = args.toolbar;
  }

  getActiveToolbars(): dxElementWrapper {
    const index = this._tabPanel ? this._tabPanel.option('selectedIndex') : 0;
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._toolbars[index];
  }

  _createOnCreateToolbar(): void {
    // @ts-expect-error ts-error
    this._onCreateToolbarAction = this._createActionByOption('onCreateToolbar');
  }

  _createOnSelectedGroupChanged(): void {
    this._onSelectedGroupChangedAction = this._createActionByOption(
      // @ts-expect-error ts-error
      'onSelectedGroupChanged',
    );
  }

  _optionChanged(args): void {
    switch (args.name) {
      case 'onCreateToolbar':
        this._createOnCreateToolbar();
        break;
      case 'onSelectedGroupChanged':
        this._createOnSelectedGroupChanged();
        break;
      case 'propertyTabs':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default DiagramPropertiesPanel;
