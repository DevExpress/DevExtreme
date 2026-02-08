import '@js/ui/context_menu';

import type { Orientation } from '@js/common';
import type { PositionConfig } from '@js/common/core/animation';
import animationPosition from '@js/common/core/animation/position';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import {
  getHeight, getWidth, setHeight, setWidth,
} from '@js/core/utils/size';
import type { DxEvent } from '@js/events';
import type { Item } from '@js/ui/menu';
import type { ContextMenuProperties } from '@ts/ui/context_menu/context_menu';
import ContextMenu from '@ts/ui/context_menu/context_menu';
import type { HoverEvent } from '@ts/ui/context_menu/menu_base';
import type DataAdapter from '@ts/ui/hierarchical_collection/data_adapter';
import type { ItemKey } from '@ts/ui/hierarchical_collection/data_converter';
import type { OverlayProperties, PositioningEvent as OverlayPositioningEvent } from '@ts/ui/overlay/overlay';
import type Overlay from '@ts/ui/overlay/overlay';

const DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS = 'dx-context-menu-content-delimiter';
const DX_SUBMENU_CLASS = 'dx-submenu';

export interface SubmenuProperties extends ContextMenuProperties<Item> {
  _parentKey: ItemKey;
  orientation?: Orientation;
  onHoverStart?: (e: DxEvent) => void;
}
class Submenu extends ContextMenu<SubmenuProperties> {
  _overlay!: Overlay | null;

  $contentDelimiter?: dxElementWrapper;

  _dataAdapter!: DataAdapter;

  _getMaxUsableSpace(offsetTop: number, windowHeight: number, anchorHeight: number): number {
    return Math.max(offsetTop, windowHeight - offsetTop - anchorHeight);
  }

  _getDefaultOptions(): SubmenuProperties {
    return {
      ...super._getDefaultOptions(),
      orientation: 'horizontal',
      // @ts-expect-error ts-error
      tabIndex: null,
      onHoverStart: noop,
    };
  }

  _initDataAdapter(): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _dataAdapter } = this.option();

    this._dataAdapter = _dataAdapter;
    if (!this._dataAdapter) {
      super._initDataAdapter();
    }
  }

  _renderContentImpl(): void {
    this._renderContextMenuOverlay();
    super._renderContentImpl();

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _parentKey } = this.option();
    const node = this._dataAdapter.getNodeByKey(_parentKey);

    if (node) {
      this._renderItems(this._getChildNodes(node));
    }

    this._renderDelimiter();
  }

  _renderDelimiter(): void {
    this.$contentDelimiter = $('<div>')
      .appendTo(this._itemContainer())
      .addClass(DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS);
  }

  _getOverlayOptions(): OverlayProperties {
    return extend(true, super._getOverlayOptions(), {
      onPositioned: this._overlayPositionedActionHandler.bind(this),
      position: {
        precise: true,
      },
    }) as OverlayProperties;
  }

  _overlayPositionedActionHandler(arg: OverlayPositioningEvent): void {
    this._showDelimiter(arg);
  }

  _hoverEndHandler(e: HoverEvent): void {
    super._hoverEndHandler(e);
    // @ts-expect-error ts-error
    this._toggleFocusClass(false, e.currentTarget);
  }

  _isMenuHorizontal(): boolean {
    const { orientation } = this.option();

    return orientation === 'horizontal';
  }

  _hoverStartHandler(e: HoverEvent): void {
    const { onHoverStart } = this.option();

    onHoverStart?.(e);
    super._hoverStartHandler(e);
  }

  _drawSubmenu($rootItem: dxElementWrapper): void {
    this._actions.onShowing?.({
      // @ts-expect-error ts-error
      rootItem: getPublicElement($rootItem),
      submenu: this,
    });
    super._drawSubmenu($rootItem);
    this._actions.onShown?.({
      // @ts-expect-error ts-error
      rootItem: getPublicElement($rootItem),
      submenu: this,
    });
  }

  _hideSubmenu($rootItem: dxElementWrapper): void {
    this._actions.onHiding?.({
      cancel: true,
      // @ts-expect-error ts-error
      rootItem: getPublicElement($rootItem),
      submenu: this,
    });
    super._hideSubmenu($rootItem);
    this._actions.onHidden?.({
      // @ts-expect-error ts-error
      rootItem: getPublicElement($rootItem),
      submenu: this,
    });
  }

  _getDelimiterWidth($rootItem: dxElementWrapper, $submenu: dxElementWrapper): number {
    if (this._isMenuHorizontal()) {
      const rootWidth: number = getWidth($rootItem);
      const submenuWidth: number = getWidth($submenu);

      return rootWidth < submenuWidth ? rootWidth : submenuWidth;
    }

    return 3;
  }

  _getDelimiterHeight($rootItem: dxElementWrapper, $submenu: dxElementWrapper): number {
    if (this._isMenuHorizontal()) {
      return 3;
    }

    const rootHeight: number = getHeight($rootItem);
    const submenuHeight: number = getHeight($submenu);

    return rootHeight < submenuHeight ? rootHeight : submenuHeight;
  }

  // TODO: try to simplify it
  _showDelimiter(arg: OverlayPositioningEvent): void {
    if (!this.$contentDelimiter) {
      return;
    }

    const { position: positionOption } = this.option();

    const $submenu = this._itemContainer().children(`.${DX_SUBMENU_CLASS}`).eq(0);

    const $rootItem = $(positionOption?.of).find('.dx-context-menu-container-border');
    const position: PositionConfig = {
      // @ts-expect-error ts-error
      of: $submenu,
      precise: true,
    };
    const containerOffset = arg.position;
    const vLocation = containerOffset.v.location;
    const hLocation = containerOffset.h.location;
    const rootOffset = $rootItem.offset();
    const offsetLeft = Math.round(rootOffset?.left ?? 0);
    const offsetTop = Math.round(rootOffset?.top ?? 0);

    this.$contentDelimiter.css('display', 'block');
    setWidth(
      this.$contentDelimiter,
      this._getDelimiterWidth($rootItem, $submenu),
    );
    setHeight(
      this.$contentDelimiter,
      this._getDelimiterHeight($rootItem, $submenu),
    );

    if (this._isMenuHorizontal()) {
      if (vLocation > offsetTop) {
        if (Math.round(hLocation) === offsetLeft) {
          position.offset = '0 -2.5';
          position.at = 'left top';
          position.my = 'left top';
        } else {
          position.offset = '0 -2.5';
          position.at = 'right top';
          position.my = 'right top';
        }
      } else {
        setHeight(this.$contentDelimiter, 5);
        if (Math.round(hLocation) === offsetLeft) {
          position.offset = '0 5';
          position.at = 'left bottom';
          position.my = 'left bottom';
        } else {
          position.offset = '0 5';
          position.at = 'right bottom';
          position.my = 'right bottom';
        }
      }
    } else if (hLocation > offsetLeft) {
      if (Math.round(vLocation) === offsetTop) {
        position.offset = '-2.5 0';
        position.at = 'left top';
        position.my = 'left top';
      } else {
        position.offset = '-2.5 0';
        position.at = 'left bottom';
        position.my = 'left bottom';
      }
    } else if (Math.round(vLocation) === offsetTop) {
      position.offset = '2.5 0';
      position.at = 'right top';
      position.my = 'right top';
    } else {
      position.offset = '2.5 0';
      position.at = 'right bottom';
      position.my = 'right bottom';
    }
    animationPosition.setup(this.$contentDelimiter, position);
  }

  _getContextMenuPosition(): PositionConfig | undefined {
    const { position } = this.option();

    return position;
  }

  isOverlayVisible(): boolean | undefined {
    const { visible } = this._overlay?.option() ?? {};

    return visible;
  }

  getOverlayContent(): dxElementWrapper | undefined | null {
    return this._overlay?.$content();
  }
}

export default Submenu;
