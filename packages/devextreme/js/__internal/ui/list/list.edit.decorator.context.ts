import type { EventInfo } from '@js/common/core/events';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getOuterHeight, getOuterWidth } from '@js/core/utils/size';
import type {
  DxEvent,
  PointerInteractionEvent,
} from '@js/events';
import type { ItemClickEvent } from '@js/ui/list';
import type dxOverlay from '@js/ui/overlay';
import { ListBase } from '@ts/ui/list/list.base';
import EditDecorator from '@ts/ui/list/list.edit.decorator';
import { register as registerDecorator } from '@ts/ui/list/list.edit.decorator_registry';
import type { OverlayProperties } from '@ts/ui/overlay/overlay';
import Overlay from '@ts/ui/overlay/overlay';

const CONTEXTMENU_CLASS = 'dx-list-context-menu';
const CONTEXTMENU_MENUCONTENT_CLASS = 'dx-list-context-menucontent';

class EditDecoratorContext extends EditDecorator {
  _$itemWithMenu?: dxElementWrapper;

  _$menuList?: dxElementWrapper;

  _menu!: Overlay;

  _init(): void {
    const $menu = $('<div>').addClass(CONTEXTMENU_CLASS);
    this._list.$element().append($menu);

    this._menu = this._renderOverlay($menu);
  }

  _renderOverlay($element: dxElementWrapper): Overlay {
    return this._list._createComponent($element, Overlay, {
      shading: false,
      deferRendering: true,
      hideOnParentScroll: true,
      hideOnOutsideClick: (e: DxEvent<PointerInteractionEvent>): boolean => !$(e.target).closest(`.${CONTEXTMENU_CLASS}`).length,
      animation: {
        show: {
          type: 'slide',
          duration: 300,
          from: {
            // @ts-expect-error ts-error
            height: 0,
            opacity: 1,
          },
          to: {
            // @ts-expect-error ts-error
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            height: (): number => getOuterHeight(this._$menuList),
            opacity: 1,
          },
        },
        hide: {
          type: 'slide',
          duration: 0,
          from: {
            opacity: 1,
          },
          to: {
            opacity: 0,
          },
        },
      },
      _ignoreFunctionValueDeprecation: true,
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      height: (): number => (this._$menuList ? getOuterHeight(this._$menuList) : 0),
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      width: (): number => getOuterWidth(this._list.$element()),
      onContentReady: (e: EventInfo<dxOverlay<OverlayProperties>>): void => {
        this._renderMenuContent(e);
      },
    });
  }

  _renderMenuContent(e: EventInfo<dxOverlay<OverlayProperties>>): void {
    const $overlayContent = $(e.component.content());

    const { menuItems = [], allowItemDeleting } = this._list.option();
    const items = menuItems.slice();

    if (allowItemDeleting) {
      items.push({
        text: messageLocalization.format('dxListEditDecorator-delete'),
        action: this._deleteItem.bind(this),
      });
    }

    this._$menuList = $('<div>');
    this._list._createComponent(this._$menuList, ListBase, {
      items,
      onItemClick: (event: ItemClickEvent) => {
        this._menuItemClickHandler(event);
      },
      height: 'auto',
      integrationOptions: {},
    });

    $overlayContent.addClass(CONTEXTMENU_MENUCONTENT_CLASS);
    $overlayContent.append(this._$menuList);
  }

  _menuItemClickHandler(e: ItemClickEvent): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._menu.hide();
    this._list._itemEventHandlerByHandler(
      $(this._$itemWithMenu),
      e.itemData.action,
      {},
      { excludeValidators: ['disabled', 'readOnly'] },
    );
  }

  _deleteItem(): void {
    if (!this._$itemWithMenu) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._list.deleteItem(this._$itemWithMenu.get(0));
  }

  handleContextMenu($itemElement: dxElementWrapper): boolean {
    this._$itemWithMenu = $itemElement;

    this._menu.option({
      position: {
        my: 'top',
        at: 'bottom',
        of: $itemElement,
        collision: 'flip',
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._menu.show();

    return true;
  }

  dispose(): void {
    if (this._menu) {
      this._menu.$element().remove();
    }
    super.dispose();
  }
}

registerDecorator(
  'menu',
  'context',
  EditDecoratorContext,
);
