import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import { noop } from '@js/core/utils/common';
import { compileGetter, compileSetter } from '@js/core/utils/data';
import { getImageContainer } from '@js/core/utils/icon';
import { each } from '@js/core/utils/iterator';
import { isFunction, isObject } from '@js/core/utils/type';
import CollectionWidgetAsync from '@js/ui/collection/ui.collection_widget.async';
import type { ItemLike } from '@js/ui/collection/ui.collection_widget.base';
import type { OptionChanged } from '@ts/core/widget/types';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/collection_widget.edit';

import DataAdapter, {
  type DataAdapterOptions,
} from './data_adapter';
import type { DataAccessors, ItemKey } from './data_converter';

const DISABLED_STATE_CLASS = 'dx-state-disabled';
const ITEM_URL_CLASS = 'dx-item-url';

class HierarchicalCollectionWidget<
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  TProperties extends CollectionWidgetEditProperties<any, TItem, TKey>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends ItemLike = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey extends ItemKey = any,
> extends CollectionWidgetAsync<TProperties, TItem, TKey> {
  _dataAdapter!: DataAdapter;

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      keyExpr: 'id',
      displayExpr: 'text',
      selectedExpr: 'selected',
      disabledExpr: 'disabled',
      itemsExpr: 'items',
      hoverStateEnabled: true,
      parentIdExpr: 'parentId',
      expandedExpr: 'expanded',
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        // @ts-expect-error ts-error
        options: {
          focusStateEnabled: true,
        },
      },
    ]);
  }

  _init(): void {
    super._init();

    this._initAccessors();
    this._initDataAdapter();
    this._initDynamicTemplates();
  }

  _initDataSource(): void {
    // @ts-expect-error ts-error
    super._initDataSource();
    // @ts-expect-error ts-error
    this._dataSource?.paginate(false);
  }

  _initDataAdapter(): void {
    const accessors = this._createDataAdapterAccessors();
    const { items = [] } = this.option();
    this._dataAdapter = new DataAdapter({
      dataAccessors: {
        getters: accessors.getters,
        setters: accessors.setters,
      },
      // @ts-expect-error
      items,
      ...this._getDataAdapterOptions(),
    });
  }

  _getDataAdapterOptions(): Partial<DataAdapterOptions> {
    return {} as Partial<DataAdapterOptions>;
  }

  _getItemExtraPropNames(): string[] {
    return [];
  }

  _initDynamicTemplates(): void {
    const fields = ['text', 'html', 'items', 'icon'].concat(this._getItemExtraPropNames());

    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(this._addContent.bind(this), fields, this.option('integrationOptions.watchMethod'), {
        text: this._displayGetter,
        // @ts-expect-error ts-error
        items: this._itemsGetter,
      }),
    });
  }

  _addContent($container: dxElementWrapper, itemData: TItem): void {
    $container
      // @ts-expect-error ts-error
      .html(itemData.html)
      // @ts-expect-error ts-error
      .append(this._getIconContainer(itemData))
      .append(this._getTextContainer(itemData));
  }

  _getLinkContainer(
    iconContainer: dxElementWrapper | undefined | null,
    textContainer: dxElementWrapper,
    itemData: TItem,
  ): dxElementWrapper {
    // @ts-expect-error ts-error
    const { linkAttr, url } = itemData;

    const linkAttributes = isObject(linkAttr) ? linkAttr : {};
    return $('<a>')
      .addClass(ITEM_URL_CLASS)
      // @ts-expect-error ts-error
      .attr({ ...linkAttributes, href: url })
      // @ts-expect-error ts-error
      .append(iconContainer)
      .append(textContainer);
  }

  _clickByLink(link: HTMLElement): void {
    link.addEventListener('click', (e: MouseEvent): void => {
      e.stopPropagation();
    }, { once: true });

    link.click();
  }

  _getIconContainer(itemData: TItem): dxElementWrapper | undefined | null {
    // @ts-expect-error ts-error
    if (!itemData.icon) {
      return undefined;
    }
    // @ts-expect-error ts-error
    const $imageContainer = getImageContainer(itemData.icon);
    // @ts-expect-error ts-error
    if ($imageContainer.is('img')) {
      const componentName = this.NAME?.startsWith('dxPrivateComponent')
        ? ''
        : `${this.NAME} `;
      // @ts-expect-error ts-error
      $imageContainer.attr('alt', `${componentName}item icon`);
    }

    return $imageContainer;
  }

  _getTextContainer(itemData: TItem): dxElementWrapper {
    // @ts-expect-error ts-error
    return $('<span>').text(itemData.text);
  }

  _initAccessors(): void {
    each(this._getAccessors(), (_index: number, accessor: string): void => {
      this._compileAccessor(accessor);
    });

    this._compileDisplayGetter();
  }

  _getAccessors(): string[] {
    return ['key', 'selected', 'items', 'disabled', 'parentId', 'expanded'];
  }

  _getChildNodes(node: TItem): TItem[] {
    const arr: TItem[] = [];
    // @ts-expect-error ts-error
    each(node.internalFields.childrenKeys, (_, key) => {
      const childNode = this._dataAdapter?.getNodeByKey(key);
      arr.push(childNode as TItem);
    });
    return arr;
  }

  _hasChildren(node: TItem): boolean {
    // @ts-expect-error ts-error
    return Boolean(node?.internalFields?.childrenKeys?.length);
  }

  _compileAccessor(optionName: string): void {
    const getter = `_${optionName}Getter`;
    const setter = `_${optionName}Setter`;
    const optionExpr = this.option(`${optionName}Expr`);

    if (!optionExpr) {
      this[getter] = noop;
      this[setter] = noop;
      return;
    } if (isFunction(optionExpr)) {
      this[setter] = (obj, value): void => { obj[optionExpr()] = value; };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      this[getter] = (obj): unknown => obj[optionExpr()];
      return;
    }
    // @ts-expect-error ts-error
    this[getter] = compileGetter(optionExpr);
    // @ts-expect-error ts-error
    this[setter] = compileSetter(optionExpr);
  }

  _createDataAdapterAccessors(): DataAccessors {
    const accessors: DataAccessors = {
      getters: {} as DataAccessors['getters'],
      setters: {} as DataAccessors['setters'],
    };

    each(this._getAccessors(), (_index: number, accessor: string): void => {
      const getterName = `_${accessor}Getter`;
      const setterName = `_${accessor}Setter`;
      const newAccessor = accessor === 'parentId' ? 'parentKey' : accessor;

      accessors.getters[newAccessor] = this[getterName];
      accessors.setters[newAccessor] = this[setterName];
    });
    // @ts-expect-error
    accessors.getters.display = this._displayGetter
      ?? ((itemData): string => itemData.text as string);

    return accessors;
  }

  _initMarkup(): void {
    super._initMarkup();
    this._addWidgetClass();
  }

  _addWidgetClass(): void {
    this._focusTarget().addClass(this._widgetClass());
  }

  _widgetClass(): string {
    return '';
  }

  _renderItemFrame(
    index: number,
    itemData: TItem,
    $itemContainer: dxElementWrapper,
  ): dxElementWrapper {
    const $itemFrame = super._renderItemFrame(index, itemData, $itemContainer);
    // @ts-expect-error ts-error
    $itemFrame.toggleClass(DISABLED_STATE_CLASS, !!this._disabledGetter(itemData));
    return $itemFrame;
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    switch (args.name) {
      case 'displayExpr':
      case 'keyExpr':
        this._initAccessors();
        this._initDynamicTemplates();
        this.repaint();
        break;
      case 'itemsExpr':
      case 'selectedExpr':
      case 'disabledExpr':
      case 'expandedExpr':
      case 'parentIdExpr':
        this._initAccessors();
        this._initDataAdapter();
        this.repaint();
        break;
      case 'items':
        this._initDataAdapter();
        super._optionChanged(args);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default HierarchicalCollectionWidget;
