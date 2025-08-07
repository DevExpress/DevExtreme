import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { each } from '@js/core/utils/iterator';
import type { DxEvent } from '@js/events';
import type { Item } from '@js/ui/list';
import errors from '@js/ui/widget/ui.errors';
import { isFunction } from '@ts/core/utils/m_type';
import type { PostprocessRenderItemInfo } from '@ts/ui/collection/collection_widget.base';
import type List from '@ts/ui/list/list.edit';
import type { BagConfig } from '@ts/ui/list/list.edit.decorator';
import type EditDecorator from '@ts/ui/list/list.edit.decorator';
import type { DecoratorClass } from '@ts/ui/list/list.edit.decorator_registry';
import { registry } from '@ts/ui/list/list.edit.decorator_registry';

interface OptionRegistry {
  enabled: () => boolean;
  decoratorType: () => string;
  decoratorSubType: () => string;
}

const editOptionsRegistry: OptionRegistry[] = [];

const registerOption = ({ enabled, decoratorType, decoratorSubType }: OptionRegistry): void => {
  editOptionsRegistry.push({
    enabled,
    decoratorType,
    decoratorSubType,
  });
};

// NOTE: option registration order does matter
registerOption({
  enabled(): boolean {
    const { menuItems } = this.option();
    return Boolean(menuItems.length);
  },
  decoratorType: (): string => 'menu',
  decoratorSubType(): string {
    const { menuMode } = this.option();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return menuMode;
  },
});
registerOption({
  enabled(): boolean {
    const { menuItems, allowItemDeleting } = this.option();
    return Boolean(!menuItems.length && allowItemDeleting);
  },
  decoratorType(): string {
    const { itemDeleteMode } = this.option();

    return ['toggle', 'slideButton', 'swipe', 'static'].includes(itemDeleteMode) ? 'delete' : 'menu';
  },
  decoratorSubType(): string {
    let { itemDeleteMode } = this.option();

    if (itemDeleteMode === 'slideItem') {
      itemDeleteMode = 'slide';
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return itemDeleteMode;
  },
});
registerOption({
  enabled(): boolean {
    const { selectionMode, showSelectionControls } = this.option();
    return Boolean(selectionMode !== 'none' && showSelectionControls);
  },
  decoratorType: (): string => 'selection',
  decoratorSubType: (): string => 'default',
});
registerOption({
  enabled(): boolean {
    const { itemDragging } = this.option();
    return Boolean(
      itemDragging.allowReordering
      || itemDragging.allowDropInsideItem
      || itemDragging.group,
    );
  },
  decoratorType: (): string => 'reorder',
  decoratorSubType: (): string => 'default',
});

const LIST_ITEM_BEFORE_BAG_CLASS = 'dx-list-item-before-bag';
const LIST_ITEM_AFTER_BAG_CLASS = 'dx-list-item-after-bag';

const DECORATOR_BEFORE_BAG_CREATE_METHOD = 'beforeBag';
const DECORATOR_AFTER_BAG_CREATE_METHOD = 'afterBag';
const DECORATOR_MODIFY_ELEMENT_METHOD = 'modifyElement';
const DECORATOR_AFTER_RENDER_METHOD = 'afterRender';
const DECORATOR_GET_EXCLUDED_SELECTORS_METHOD = 'getExcludedSelectors';

class EditProvider {
  _list: List;

  _decorators: EditDecorator[];

  constructor(list: List) {
    this._list = list;
    this._decorators = [];
    this._fetchRequiredDecorators();
  }

  dispose(): void {
    if (this._decorators?.length) {
      each(this._decorators, (_index: number, decorator: EditDecorator): void => {
        decorator.dispose();
      });
    }
  }

  _fetchRequiredDecorators(): void {
    each(editOptionsRegistry, (_index: number, option: OptionRegistry): void => {
      const optionEnabled = option.enabled.call(this._list);
      if (optionEnabled) {
        const decoratorType = option.decoratorType.call(this._list);
        const decoratorSubType = option.decoratorSubType.call(this._list);

        const decorator = this._createDecorator(decoratorType, decoratorSubType);

        this._decorators.push(decorator);
      }
    });
  }

  _createDecorator(type: string, subType: string): EditDecorator {
    const CreatedDecoratorClass = this._findDecorator(type, subType);
    return new CreatedDecoratorClass(this._list);
  }

  _findDecorator(type: string, subType: string): DecoratorClass {
    const foundDecorator = registry[type]?.[subType];

    if (!foundDecorator) {
      throw errors.Error('E1012', type, subType);
    }

    return foundDecorator;
  }

  modifyItemElement(args: PostprocessRenderItemInfo<Item>): void {
    const $itemElement = $(args.itemElement);

    const config = {
      $itemElement,
      $container: $(),
    };

    this._prependBeforeBags($itemElement, config);
    this._appendAfterBags($itemElement, config);
    this._applyDecorators(DECORATOR_MODIFY_ELEMENT_METHOD, config);
  }

  afterItemsRendered(): void {
    this._applyDecorators(DECORATOR_AFTER_RENDER_METHOD);
  }

  _prependBeforeBags($itemElement: dxElementWrapper, config: BagConfig): void {
    const $beforeBags = this._collectDecoratorsMarkup(
      DECORATOR_BEFORE_BAG_CREATE_METHOD,
      config,
      LIST_ITEM_BEFORE_BAG_CLASS,
    );
    $itemElement.prepend($beforeBags);
  }

  _appendAfterBags($itemElement: dxElementWrapper, config: BagConfig): void {
    const $afterBags = this._collectDecoratorsMarkup(
      DECORATOR_AFTER_BAG_CREATE_METHOD,
      config,
      LIST_ITEM_AFTER_BAG_CLASS,
    );
    $itemElement.append($afterBags);
  }

  _collectDecoratorsMarkup(
    method: string,
    config: BagConfig,
    containerClass: string,
  ): dxElementWrapper {
    const $collector = $('<div>');

    this._decorators?.forEach((decorator: EditDecorator): void => {
      if (isFunction(decorator[method])) {
        const $container = $('<div>').addClass(containerClass);
        decorator[method]({
          ...config,
          $container,
        });
        if ($container.children().length) {
          $collector.append($container);
        }
      }
    });

    return $collector.children();
  }

  _applyDecorators(method: string, config?: unknown): void {
    this._decorators?.forEach((decorator: EditDecorator): void => {
      decorator[method](config);
    });
  }

  _handlerExists(name: string): boolean {
    if (!this._decorators) {
      return false;
    }

    const decorators = this._decorators;
    const { length } = decorators;
    for (let i = 0; i < length; i += 1) {
      if (decorators[i][name] !== noop) {
        return true;
      }
    }

    return false;
  }

  _eventHandler(name: string, ...args: unknown[]): boolean {
    if (!this._decorators) {
      return false;
    }

    let response = false;
    const decorators = this._decorators;
    const { length } = decorators;
    for (let i = 0; i < length; i += 1) {
      response = decorators[i][name](...args);
      if (response) {
        break;
      }
    }

    return response;
  }

  handleClick($itemElement: dxElementWrapper, e: DxEvent): boolean {
    return this._eventHandler('handleClick', $itemElement, e);
  }

  handleKeyboardEvents(currentFocusedIndex: number, moveFocusUp: boolean | undefined): boolean {
    return this._eventHandler('handleKeyboardEvents', currentFocusedIndex, moveFocusUp);
  }

  handleEnterPressing(e: KeyboardEvent): boolean {
    return this._eventHandler('handleEnterPressing', e);
  }

  contextMenuHandlerExists(): boolean {
    return this._handlerExists('handleContextMenu');
  }

  handleContextMenu($itemElement: dxElementWrapper, e: DxEvent): boolean {
    return this._eventHandler('handleContextMenu', $itemElement, e);
  }

  getExcludedItemSelectors(): string {
    const excludedSelectors = [];

    this._applyDecorators(DECORATOR_GET_EXCLUDED_SELECTORS_METHOD, excludedSelectors);

    return excludedSelectors.join(',');
  }
}

export default EditProvider;
