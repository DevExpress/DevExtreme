import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import { noop } from '@js/core/utils/common';
import { compileGetter, compileSetter } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { getImageContainer } from '@js/core/utils/icon';
import { each } from '@js/core/utils/iterator';
import { isFunction, isObject } from '@js/core/utils/type';
import CollectionItem from '@js/ui/collection/item';
import type { CollectionWidgetItem } from '@js/ui/collection/ui.collection_widget.base';
import type { HierarchicalCollectionWidgetOptions } from '@js/ui/hierarchical_collection/ui.hierarchical_collection_widget';
import CollectionWidget from '@ts/ui/collection/edit';

import HierarchicalDataAdapter from './m_data_adapter';

const DISABLED_STATE_CLASS = 'dx-state-disabled';
const ITEM_URL_CLASS = 'dx-item-url';

export interface HierarchicalCollectionWidgetItem extends CollectionWidgetItem {
  linkAttr?: Record<string, any>;

  icon?: string;

  url?: string;

  internalFields: { childrenKeys: any[] };
}

export type Item = HierarchicalCollectionWidgetItem;

export interface Properties<
    TComponent extends HierarchicalCollectionWidget<any, TItem, TKey>,
    TItem extends Item = any,
    TKey = any,
> extends HierarchicalCollectionWidgetOptions<TComponent, TItem, TKey> {

}

class HierarchicalCollectionWidget<
  TProperties extends Properties<any, TItem, TKey>,
  TItem extends Item = any,
  TKey = any,
> extends CollectionWidget<TProperties, TItem, TKey> {
  static ItemClass = CollectionItem;

  public NAME!: string;

  _dataAdapter?: any;

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

  _defaultOptionsRules() {
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
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
    // @ts-expect-error
    super._initDataSource();
    // @ts-expect-error
    this._dataSource && this._dataSource.paginate(false);
  }

  _initDataAdapter(): void {
    const accessors = this._createDataAdapterAccessors();

    this._dataAdapter = new HierarchicalDataAdapter(
      extend({
        dataAccessors: {
          getters: accessors.getters,
          setters: accessors.setters,
        },
        items: this.option('items'),
      }, this._getDataAdapterOptions()),
    );
  }

  _getDataAdapterOptions(): void {}

  _getItemExtraPropNames(): string[] {
    return [];
  }

  _initDynamicTemplates() {
    const fields = ['text', 'html', 'items', 'icon'].concat(this._getItemExtraPropNames());

    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(this._addContent.bind(this), fields, this.option('integrationOptions.watchMethod'), {
        // @ts-expect-error
        text: this._displayGetter,
        // @ts-expect-error
        items: this._itemsGetter,
      }),
    });
  }

  _addContent($container: dxElementWrapper, itemData: TItem): void {
    $container
      // @ts-expect-error
      .html(itemData.html)
      // @ts-expect-error
      .append(this._getIconContainer(itemData))
      .append(this._getTextContainer(itemData));
  }

  _getLinkContainer(
    iconContainer: dxElementWrapper,
    textContainer: dxElementWrapper,
    itemData: TItem,
  ): dxElementWrapper {
    const { linkAttr, url } = itemData;
    const linkAttributes = isObject(linkAttr) ? linkAttr : {};
    return $('<a>')
      .addClass(ITEM_URL_CLASS)
      // @ts-expect-error
      .attr({ ...linkAttributes, href: url })
      .append(iconContainer)
      .append(textContainer);
  }

  _getIconContainer(itemData: TItem): dxElementWrapper | undefined | null {
    if (!itemData.icon) {
      return undefined;
    }

    const $imageContainer = getImageContainer(itemData.icon);
    // @ts-expect-error
    if ($imageContainer.is('img')) {
      const componentName = this.NAME.startsWith('dxPrivateComponent')
        ? ''
        : `${this.NAME} `;
      // @ts-expect-error
      $imageContainer.attr('alt', `${componentName}item icon`);
    }

    return $imageContainer;
  }

  _getTextContainer(itemData: TItem): dxElementWrapper {
    // @ts-expect-error
    return $('<span>').text(itemData.text);
  }

  _initAccessors(): void {
    each(this._getAccessors(), (_, accessor) => {
      this._compileAccessor(accessor);
    });

    // @ts-expect-error
    this._compileDisplayGetter();
  }

  _getAccessors() {
    return ['key', 'selected', 'items', 'disabled', 'parentId', 'expanded'];
  }

  _getChildNodes(node: TItem): TItem[] {
    const arr = [];
    each(node.internalFields.childrenKeys, (_, key) => {
      const childNode = this._dataAdapter.getNodeByKey(key);
      // @ts-expect-error
      arr.push(childNode);
    });
    return arr;
  }

  _hasChildren(node: TItem): number | undefined {
    return node?.internalFields.childrenKeys.length;
  }

  _compileAccessor(optionName) {
    const getter = `_${optionName}Getter`;
    const setter = `_${optionName}Setter`;
    const optionExpr = this.option(`${optionName}Expr`);

    if (!optionExpr) {
      this[getter] = noop;
      this[setter] = noop;
      return;
    } if (isFunction(optionExpr)) {
      this[setter] = function (obj, value) { obj[optionExpr()] = value; };
      this[getter] = function (obj) { return obj[optionExpr()]; };
      return;
    }
    // @ts-expect-error
    this[getter] = compileGetter(optionExpr);
    // @ts-expect-error
    this[setter] = compileSetter(optionExpr);
  }

  _createDataAdapterAccessors() {
    const accessors = {
      getters: {},
      setters: {},
    };

    each(this._getAccessors(), (_, accessor) => {
      const getterName = `_${accessor}Getter`;
      const setterName = `_${accessor}Setter`;
      const newAccessor = accessor === 'parentId' ? 'parentKey' : accessor;

      accessors.getters[newAccessor] = this[getterName];
      accessors.setters[newAccessor] = this[setterName];
    });
    // @ts-expect-error
    accessors.getters.display = !this._displayGetter ? (itemData) => itemData.text : this._displayGetter;

    return accessors;
  }

  _initMarkup(): void {
    super._initMarkup();
    this._addWidgetClass();
  }

  _addWidgetClass(): void {
    // @ts-expect-error
    this._focusTarget().addClass(this._widgetClass());
  }

  _widgetClass(): void {}

  _renderItemFrame(
    index: number,
    itemData: TItem,
    $container: dxElementWrapper,
    $itemToReplace?: dxElementWrapper,
  ): dxElementWrapper {
    const $itemFrame = super._renderItemFrame(index, itemData, $container, $itemToReplace);

    // @ts-expect-error
    $itemFrame.toggleClass(DISABLED_STATE_CLASS, !!this._disabledGetter(itemData));
    return $itemFrame;
  }

  _optionChanged(args: {
    name: string;
    fullName: string;
    value: unknown;
    previousValue: unknown;
  }): void {
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
