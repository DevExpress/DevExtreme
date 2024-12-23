import devices from '@js/core/devices';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import { noop } from '@js/core/utils/common';
import { compileGetter, compileSetter } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { getImageContainer } from '@js/core/utils/icon';
import { each } from '@js/core/utils/iterator';
import { isFunction, isObject } from '@js/core/utils/type';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.async';

import HierarchicalDataAdapter from './m_data_adapter';

const DISABLED_STATE_CLASS = 'dx-state-disabled';
const ITEM_URL_CLASS = 'dx-item-url';

const HierarchicalCollectionWidget = CollectionWidget.inherit({

  _getDefaultOptions() {
    return extend(this.callBase(), {
      keyExpr: 'id',
      displayExpr: 'text',
      selectedExpr: 'selected',
      disabledExpr: 'disabled',
      itemsExpr: 'items',
      hoverStateEnabled: true,
      parentIdExpr: 'parentId',
      expandedExpr: 'expanded',
    });
  },

  _defaultOptionsRules() {
    return this.callBase().concat([
      {
        device() {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        options: {
          focusStateEnabled: true,
        },
      },
    ]);
  },

  _init() {
    this.callBase();

    this._initAccessors();
    this._initDataAdapter();
    this._initDynamicTemplates();
  },

  _initDataSource() {
    this.callBase();
    this._dataSource && this._dataSource.paginate(false);
  },

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
  },

  _getDataAdapterOptions: noop,

  _getItemExtraPropNames: noop,

  _initDynamicTemplates() {
    const fields = ['text', 'html', 'items', 'icon'].concat(this._getItemExtraPropNames());

    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(this._addContent.bind(this), fields, this.option('integrationOptions.watchMethod'), {
        text: this._displayGetter,
        items: this._itemsGetter,
      }),
    });
  },

  _addContent($container, itemData) {
    $container
      .html(itemData.html)
      .append(this._getIconContainer(itemData))
      .append(this._getTextContainer(itemData));
  },

  _getLinkContainer(iconContainer, textContainer, { linkAttr, url }) {
    const linkAttributes = isObject(linkAttr) ? linkAttr : {};
    return $('<a>')
      .addClass(ITEM_URL_CLASS)
      // @ts-expect-error
      .attr({ ...linkAttributes, href: url })
      .append(iconContainer)
      .append(textContainer);
  },

  _getIconContainer(itemData) {
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
  },

  _getTextContainer(itemData) {
    return $('<span>').text(itemData.text);
  },

  _initAccessors() {
    const that = this;
    each(this._getAccessors(), (_, accessor) => {
      that._compileAccessor(accessor);
    });

    this._compileDisplayGetter();
  },

  _getAccessors() {
    return ['key', 'selected', 'items', 'disabled', 'parentId', 'expanded'];
  },

  _getChildNodes(node) {
    const that = this;
    const arr = [];
    each(node.internalFields.childrenKeys, (_, key) => {
      const childNode = that._dataAdapter.getNodeByKey(key);
      // @ts-expect-error
      arr.push(childNode);
    });
    return arr;
  },

  _hasChildren(node) {
    return node && node.internalFields.childrenKeys.length;
  },

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

    this[getter] = compileGetter(optionExpr);
    this[setter] = compileSetter(optionExpr);
  },

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
  },

  _initMarkup() {
    this.callBase();
    this._addWidgetClass();
  },

  _addWidgetClass() {
    this._focusTarget().addClass(this._widgetClass());
  },

  _widgetClass: noop,

  _renderItemFrame(index, itemData) {
    const $itemFrame = this.callBase.apply(this, arguments);

    $itemFrame.toggleClass(DISABLED_STATE_CLASS, !!this._disabledGetter(itemData));
    return $itemFrame;
  },

  _optionChanged(args) {
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
        this.callBase(args);
        break;
      default:
        this.callBase(args);
    }
  },
});

export default HierarchicalCollectionWidget;
