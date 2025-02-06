import { fx } from '@js/common/core/animation';
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import { deferRender } from '@js/core/utils/common';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getImageContainer } from '@js/core/utils/icon';
import * as iteratorUtils from '@js/core/utils/iterator';
import { getHeight, getOuterHeight, setHeight } from '@js/core/utils/size';
import { isDefined, isPlainObject } from '@js/core/utils/type';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.live_update';
import { isMaterialBased } from '@js/ui/themes';

const ACCORDION_CLASS = 'dx-accordion';
const ACCORDION_WRAPPER_CLASS = 'dx-accordion-wrapper';
const ACCORDION_ITEM_CLASS = 'dx-accordion-item';
const ACCORDION_ITEM_OPENED_CLASS = 'dx-accordion-item-opened';
const ACCORDION_ITEM_CLOSED_CLASS = 'dx-accordion-item-closed';
const ACCORDION_ITEM_TITLE_CLASS = 'dx-accordion-item-title';
const ACCORDION_ITEM_BODY_CLASS = 'dx-accordion-item-body';
const ACCORDION_ITEM_TITLE_CAPTION_CLASS = 'dx-accordion-item-title-caption';

const ACCORDION_ITEM_DATA_KEY = 'dxAccordionItemData';
// @ts-expect-error
const Accordion = CollectionWidget.inherit({
  _getDefaultOptions() {
    return extend(this.callBase(), {

      hoverStateEnabled: true,

      height: undefined,

      itemTitleTemplate: 'title',

      onItemTitleClick: null,

      selectedIndex: 0,

      collapsible: false,

      multiple: false,

      animationDuration: 300,

      deferRendering: true,

      selectByClick: true,
      activeStateEnabled: true,
      _itemAttributes: { role: 'tab' },
      _animationEasing: 'ease',
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
      {
        device() {
          // @ts-expect-error
          return isMaterialBased();
        },
        options: {
          animationDuration: 200,
          _animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    ]);
  },

  _itemElements() {
    return this._itemContainer().children(this._itemSelector());
  },

  _init() {
    this.callBase();

    this._activeStateUnit = `.${ACCORDION_ITEM_CLASS}`;

    this.option('selectionRequired', !this.option('collapsible'));
    this.option('selectionMode', this.option('multiple') ? 'multiple' : 'single');

    const $element = this.$element();
    $element.addClass(ACCORDION_CLASS);

    this._$container = $('<div>').addClass(ACCORDION_WRAPPER_CLASS);
    $element.append(this._$container);
  },

  _initTemplates() {
    this.callBase();
    this._templateManager.addDefaultTemplates({
      title: new BindableTemplate(($container, data) => {
        if (isPlainObject(data)) {
          const $iconElement = getImageContainer(data.icon);
          if ($iconElement) {
            $container.append($iconElement);
          }

          if (isDefined(data.title) && !isPlainObject(data.title)) {
            $container.append(domAdapter.createTextNode(data.title));
          }
        } else if (isDefined(data)) {
          $container.text(String(data));
        }

        $container.wrapInner($('<div>').addClass(ACCORDION_ITEM_TITLE_CAPTION_CLASS));
      }, ['title', 'icon'], this.option('integrationOptions.watchMethod')),
    });
  },

  _initMarkup() {
    this._deferredItems = [];
    this.callBase();

    this.setAria({
      role: 'tablist',

      // eslint-disable-next-line spellcheck/spell-checker
      multiselectable: this.option('multiple'),
    });

    deferRender(() => {
      const selectedItemIndices = this._getSelectedItemIndices();
      this._renderSelection(selectedItemIndices, []);
    });
  },

  _postProcessRenderItems() {
    this._updateItemHeights(true);
  },

  _itemDataKey() {
    return ACCORDION_ITEM_DATA_KEY;
  },

  _itemClass() {
    return ACCORDION_ITEM_CLASS;
  },

  _itemContainer() {
    return this._$container;
  },

  _itemTitles() {
    return this._itemElements().find(`.${ACCORDION_ITEM_TITLE_CLASS}`);
  },

  _itemContents() {
    return this._itemElements().find(`.${ACCORDION_ITEM_BODY_CLASS}`);
  },

  _getItemData(target) {
    return $(target).parent().data(this._itemDataKey()) || this.callBase.apply(this, arguments);
  },

  _executeItemRenderAction(itemData) {
    if (itemData.type) {
      return;
    }

    this.callBase.apply(this, arguments);
  },

  _itemSelectHandler(e) {
    if ($(e.target).closest(this._itemContents()).length) {
      return;
    }

    this.callBase.apply(this, arguments);
  },

  _afterItemElementDeleted($item, deletedActionArgs) {
    this._deferredItems.splice(deletedActionArgs.itemIndex, 1);
    this.callBase.apply(this, arguments);
  },

  _renderItemContent(args) {
    const itemTitleDeferred = this.callBase(extend({}, args, {
      contentClass: ACCORDION_ITEM_TITLE_CLASS,
      templateProperty: 'titleTemplate',
      defaultTemplateName: this.option('itemTitleTemplate'),
    }));

    const callBase = this.callBase.bind(this);
    itemTitleDeferred.done((itemTitle) => {
      this._attachItemTitleClickAction(itemTitle);

      const deferred = Deferred();
      if (isDefined(this._deferredItems[args.index])) {
        this._deferredItems[args.index] = deferred;
      } else {
        this._deferredItems.push(deferred);
      }

      if (!this.option('deferRendering') || this._getSelectedItemIndices().indexOf(args.index) >= 0) {
        deferred.resolve();
      }

      deferred.done(() => {
        callBase(extend({}, args, {
          contentClass: ACCORDION_ITEM_BODY_CLASS,
          container: getPublicElement($('<div>').appendTo($(itemTitle).parent())),
        }));
      });
    });
  },

  _attachItemTitleClickAction(itemTitle) {
    const eventName = addNamespace(clickEventName, this.NAME);

    eventsEngine.off(itemTitle, eventName);
    eventsEngine.on(itemTitle, eventName, this._itemTitleClickHandler.bind(this));
  },

  _itemTitleClickHandler(e) {
    this._itemDXEventHandler(e, 'onItemTitleClick');
  },

  _renderSelection(addedSelection, removedSelection) {
    this._itemElements().addClass(ACCORDION_ITEM_CLOSED_CLASS);
    this.setAria('hidden', true, this._itemContents());

    this._updateItems(addedSelection, removedSelection);
  },

  _updateSelection(addedSelection, removedSelection) {
    this._updateItems(addedSelection, removedSelection);
    this._updateItemHeightsWrapper(false);
  },

  _updateItems(addedSelection, removedSelection) {
    const $items = this._itemElements();

    iteratorUtils.each(addedSelection, (_, index) => {
      this._deferredItems[index]?.resolve();

      const $item = $items.eq(index)
        .addClass(ACCORDION_ITEM_OPENED_CLASS)
        .removeClass(ACCORDION_ITEM_CLOSED_CLASS);
      this.setAria('hidden', false, $item.find(`.${ACCORDION_ITEM_BODY_CLASS}`));
    });

    iteratorUtils.each(removedSelection, (_, index) => {
      const $item = $items.eq(index)
        .removeClass(ACCORDION_ITEM_OPENED_CLASS);
      this.setAria('hidden', true, $item.find(`.${ACCORDION_ITEM_BODY_CLASS}`));
    });
  },

  _updateItemHeightsWrapper(skipAnimation) {
    // Note: require for proper animation in angularjs (T520346)
    if (this.option('templatesRenderAsynchronously')) {
      this._animationTimer = setTimeout(() => {
        this._updateItemHeights(skipAnimation);
      });
    } else {
      this._updateItemHeights(skipAnimation);
    }
  },

  _updateItemHeights(skipAnimation) {
    const that = this;
    const deferredAnimate = that._deferredAnimate;
    const itemHeight = this._splitFreeSpace(this._calculateFreeSpace());

    clearTimeout(this._animationTimer);

    return when.apply($, [].slice.call(this._itemElements()).map((item) => that._updateItemHeight($(item), itemHeight, skipAnimation))).done(() => {
      if (deferredAnimate) {
        deferredAnimate.resolveWith(that);
      }
    });
  },

  _updateItemHeight($item, itemHeight, skipAnimation) {
    const $title = $item.children(`.${ACCORDION_ITEM_TITLE_CLASS}`);

    if (fx.isAnimating($item)) {
      // @ts-expect-error
      fx.stop($item);
    }

    const startItemHeight = getOuterHeight($item);
    let finalItemHeight;
    if ($item.hasClass(ACCORDION_ITEM_OPENED_CLASS)) {
      finalItemHeight = itemHeight + getOuterHeight($title);
      if (!finalItemHeight) {
        setHeight($item, 'auto');
        finalItemHeight = getOuterHeight($item);
      }
    } else {
      finalItemHeight = getOuterHeight($title);
    }

    return this._animateItem($item, startItemHeight, finalItemHeight, skipAnimation, !!itemHeight);
  },

  _animateItem($element, startHeight, endHeight, skipAnimation, fixedHeight) {
    let d;
    if (skipAnimation || startHeight === endHeight) {
      $element.css('height', endHeight);
      d = Deferred().resolve();
    } else {
      d = fx.animate($element, {
        // @ts-expect-error
        type: 'custom',
        // @ts-expect-error
        from: { height: startHeight },
        // @ts-expect-error
        to: { height: endHeight },
        duration: this.option('animationDuration'),
        easing: this.option('_animationEasing'),
      });
    }

    return d.done(() => {
      if ($element.hasClass(ACCORDION_ITEM_OPENED_CLASS) && !fixedHeight) {
        $element.css('height', '');
      }

      $element
        .not(`.${ACCORDION_ITEM_OPENED_CLASS}`)
        .addClass(ACCORDION_ITEM_CLOSED_CLASS);
    });
  },

  _splitFreeSpace(freeSpace) {
    if (!freeSpace) {
      return freeSpace;
    }

    return freeSpace / this.option('selectedItems').length;
  },

  _calculateFreeSpace() {
    const height = this.option('height');
    if (height === undefined || height === 'auto') {
      return;
    }

    const $titles = this._itemTitles();
    let itemsHeight = 0;

    iteratorUtils.each($titles, (_, title) => {
      itemsHeight += getOuterHeight(title);
    });

    return getHeight(this.$element()) - itemsHeight;
  },

  _visibilityChanged(visible) {
    if (visible) {
      this._dimensionChanged();
    }
  },

  _dimensionChanged() {
    this._updateItemHeights(true);
  },

  _clean() {
    clearTimeout(this._animationTimer);
    this.callBase();
  },

  _tryParseItemPropertyName(fullName) {
    const matches = fullName.match(/.*\.(.*)/);

    if (isDefined(matches) && (matches.length >= 1)) {
      return matches[1];
    }
  },

  _optionChanged(args) {
    switch (args.name) {
      case 'items':
        this.callBase(args);

        if (this._tryParseItemPropertyName(args.fullName) === 'title') {
          this._renderSelection(this._getSelectedItemIndices(), []);
        }
        if (this._tryParseItemPropertyName(args.fullName) === 'visible') {
          this._updateItemHeightsWrapper(true);
        }
        if (this.option('repaintChangesOnly') === true && args.fullName === 'items') {
          this._updateItemHeightsWrapper(true);
          this._renderSelection(this._getSelectedItemIndices(), []);
        }
        break;
      case 'animationDuration':
      case 'onItemTitleClick':
      case '_animationEasing':
        break;
      case 'collapsible':
        this.option('selectionRequired', !this.option('collapsible'));
        break;
      case 'itemTitleTemplate':
      case 'height':
      case 'deferRendering':
        this._invalidate();
        break;
      case 'multiple':
        this.option('selectionMode', args.value ? 'multiple' : 'single');
        break;
      default:
        this.callBase(args);
    }
  },

  expandItem(index) {
    this._deferredAnimate = Deferred();

    this.selectItem(index);

    return this._deferredAnimate.promise();
  },

  collapseItem(index) {
    this._deferredAnimate = Deferred();

    this.unselectItem(index);

    return this._deferredAnimate.promise();
  },

  updateDimensions() {
    return this._updateItemHeights(false);
  },

});

registerComponent('dxAccordion', Accordion);

export default Accordion;
