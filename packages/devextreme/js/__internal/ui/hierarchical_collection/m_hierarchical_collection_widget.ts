import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import { noop } from '@js/core/utils/common';
import { compileGetter, compileSetter } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { getImageContainer } from '@js/core/utils/icon';
import { each } from '@js/core/utils/iterator';
import { isFunction, isObject } from '@js/core/utils/type';
import CollectionWidgetAsync from '@js/ui/collection/ui.collection_widget.async';
import type { ItemLike } from '@js/ui/collection/ui.collection_widget.base';
import type { OptionChanged } from '@ts/core/widget/types';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/m_collection_widget.edit';

import HierarchicalDataAdapter from './m_data_adapter';

const DISABLED_STATE_CLASS = 'dx-state-disabled';
const ITEM_URL_CLASS = 'dx-item-url';

class HierarchicalCollectionWidget<
// eslint-disable-next-line @typescript-eslint/no-explicit-any
TProperties extends CollectionWidgetEditProperties<any, TItem, TKey>,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
TItem extends ItemLike = any,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
TKey = any,
> extends CollectionWidgetAsync<TProperties> {
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

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device() {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        // @ts-expect-error ts-error
        options: {
          focusStateEnabled: true,
        },
      },
    ]);
  }

  _init() {
    super._init();

    this._initAccessors();
    this._initDataAdapter();
    this._initDynamicTemplates();
  }

  _initDataSource() {
    // @ts-expect-error ts-error
    super._initDataSource();
    // @ts-expect-error ts-error
    this._dataSource && this._dataSource.paginate(false);
  }

  _initDataAdapter() {
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

  _getDataAdapterOptions() {}

  // @ts-expect-error
  _getItemExtraPropNames(): string[] {}

  _initDynamicTemplates() {
    const fields = ['text', 'html', 'items', 'icon'].concat(this._getItemExtraPropNames());

    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(this._addContent.bind(this), fields, this.option('integrationOptions.watchMethod'), {
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
    // @ts-expect-error
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
    // @ts-expect-error
    if (!itemData.icon) {
      return undefined;
    }
    // @ts-expect-error
    const $imageContainer = getImageContainer(itemData.icon);
    // @ts-expect-error
    if ($imageContainer.is('img')) {
      const componentName = this.NAME?.startsWith('dxPrivateComponent')
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
    const that = this;
    each(this._getAccessors(), (_, accessor) => {
      that._compileAccessor(accessor);
    });

    this._compileDisplayGetter();
  }

  _getAccessors() {
    return ['key', 'selected', 'items', 'disabled', 'parentId', 'expanded'];
  }

  _getChildNodes(node: TItem): TItem[] {
    const that = this;
    const arr = [];
    // @ts-expect-error
    each(node.internalFields.childrenKeys, (_, key) => {
      const childNode = that._dataAdapter.getNodeByKey(key);
      // @ts-expect-error
      arr.push(childNode);
    });
    return arr;
  }

  _hasChildren(node: TItem): number | undefined {
    // @ts-expect-error
    return node && node.internalFields.childrenKeys.length;
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
    const that = this;
    const accessors = {
      getters: {},
      setters: {},
    };

    each(this._getAccessors(), (_, accessor) => {
      const getterName = `_${accessor}Getter`;
      const setterName = `_${accessor}Setter`;
      const newAccessor = accessor === 'parentId' ? 'parentKey' : accessor;

      accessors.getters[newAccessor] = that[getterName];
      accessors.setters[newAccessor] = that[setterName];
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
    this._focusTarget().addClass(this._widgetClass());
  }

  // @ts-expect-error ts-error
  _widgetClass(): string {}

  _renderItemFrame(
    index: number,
    itemData: TItem,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    $itemContainer: dxElementWrapper,
  ): dxElementWrapper {
    // @ts-expect-error ts-error
    const $itemFrame = super._renderItemFrame.apply(this, arguments);
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
