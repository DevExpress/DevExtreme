import $ from '../../../core/renderer';
import { getWidth, getOuterWidth } from '../../../core/utils/size';
import { each } from '../../../core/utils/iterator';
import { grep, deferRender } from '../../../core/utils/common';
import DropDownMenu from '../drop_down_menu';
import { compileGetter } from '../../../core/utils/data';
import { extend } from '../../../core/utils/extend';
import { getBoundingRect } from '../../../core/utils/position';

const TOOLBAR_BEFORE_CLASS = 'dx-toolbar-before';
const TOOLBAR_CENTER_CLASS = 'dx-toolbar-center';
const TOOLBAR_AFTER_CLASS = 'dx-toolbar-after';
const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';
const TOOLBAR_BUTTON_CLASS = 'dx-toolbar-button';
const TOOLBAR_COMPACT_CLASS = 'dx-toolbar-compact';
const TOOLBAR_AUTO_HIDE_ITEM_CLASS = 'dx-toolbar-item-auto-hide';
const TOOLBAR_HIDDEN_ITEM = 'dx-toolbar-item-invisible';

const INVISIBLE_STATE_CLASS = 'dx-state-invisible';

const TOOLBAR_DROP_DOWN_MENU_CONTAINER_CLASS = 'dx-toolbar-menu-container';

export class SingleLineStrategy {
    constructor(toolbar) {
        this._toolbar = toolbar;

        this._renderSections();
    }

    _itemContainer() {
        return this._toolbar._$itemsContainer.find([
            `.${TOOLBAR_BEFORE_CLASS}`,
            `.${TOOLBAR_CENTER_CLASS}`,
            `.${TOOLBAR_AFTER_CLASS}`,
        ].join(','));
    }

    _renderSections() {
        const $container = this._toolbar._$itemsContainer;

        each(['before', 'center', 'after'], (_, sectionName) => {
            const sectionClass = `dx-toolbar-${sectionName}`;
            let $section = $container.find(`.${sectionClass}`);

            if(!$section.length) {
                this._toolbar[`_$${sectionName}Section`] = $section = $('<div>')
                    .addClass(sectionClass)
                    .appendTo($container);
            }
        });
    }

    _renderOverflowMenu() {
        deferRender(() => {
            this._renderDropDownMenu();
        });
    }

    _renderDropDownMenu() {
        if(!this._hasVisibleMenuItems()) {
            return;
        }

        this._$menuButtonContainer = $('<div>').appendTo(this._toolbar._$afterSection)
            .addClass(TOOLBAR_BUTTON_CLASS)
            .addClass(TOOLBAR_DROP_DOWN_MENU_CONTAINER_CLASS);

        const $menu = $('<div>').appendTo(this._$menuButtonContainer);

        this._dropDownMenu = this._toolbar._createComponent($menu, DropDownMenu, this._dropDownMenuOptions());

        this.renderMenuItems();
    }

    _dropDownMenuOptions() {
        const itemClickAction = this._toolbar._createActionByOption('onItemClick');

        return {
            disabled: this._toolbar.option('disabled'),
            itemTemplate: this._toolbar._getTemplateByOption('menuItemTemplate'),
            onItemClick: (e) => { itemClickAction(e); },
            container: this._toolbar.option('menuContainer'),
            onOptionChanged: ({ name, value }) => {
                if(name === 'opened') {
                    this._toolbar.option('overflowMenuVisible', value);
                }
                if(name === 'items') {
                    this._updateMenuVisibility(value);
                }
            },
        };
    }

    renderMenuItems() {
        if(!this._dropDownMenu) {
            this._renderDropDownMenu();
        }

        this._dropDownMenu && this._dropDownMenu.option('items', this._getMenuItems());

        if(this._dropDownMenu && !this._dropDownMenu.option('items').length) {
            this._dropDownMenu.close();
        }
    }

    _getMenuItems() {
        const that = this;
        const menuItems = grep(this._toolbar.option('items') || [], function(item) {
            return that._isMenuItem(item);
        });

        const $hiddenItems = this._itemContainer()
            .children(`.${TOOLBAR_AUTO_HIDE_ITEM_CLASS}.${TOOLBAR_HIDDEN_ITEM}`)
            .not(`.${INVISIBLE_STATE_CLASS}`);
        this._restoreItems = this._restoreItems || [];

        const overflowItems = [].slice.call($hiddenItems).map((item) => {
            const itemData = that._toolbar._getItemData(item);
            const $itemContainer = $(item).children();
            const $itemMarkup = $itemContainer.children();

            return extend({
                menuItemTemplate: function() {
                    that._restoreItems.push({
                        container: $itemContainer,
                        item: $itemMarkup
                    });

                    const $container = $('<div>').addClass(TOOLBAR_AUTO_HIDE_ITEM_CLASS);
                    return $container.append($itemMarkup);
                }
            }, itemData);
        });

        return [...overflowItems, ...menuItems];
    }

    _hasVisibleMenuItems(items) {
        const menuItems = items || this._toolbar.option('items');
        let result = false;

        const optionGetter = compileGetter('visible');
        const overflowGetter = compileGetter('locateInMenu');

        each(menuItems, function(index, item) {
            const itemVisible = optionGetter(item, { functionsAsIs: true });
            const itemOverflow = overflowGetter(item, { functionsAsIs: true });

            if(itemVisible !== false && (itemOverflow === 'auto' || itemOverflow === 'always') || item.location === 'menu') {
                result = true;
            }
        });

        return result;
    }

    _updateMenuVisibility(menuItems) {
        const items = menuItems || this._getMenuItems();
        const isMenuVisible = items.length && this._hasVisibleMenuItems(items);
        this._toggleMenuVisibility(isMenuVisible);
    }

    _toggleMenuVisibility(value) {
        if(!this._$menuButtonContainer) {
            return;
        }

        this._$menuButtonContainer.toggleClass(INVISIBLE_STATE_CLASS, !value);
    }

    _hideOverflowItems() {
        const overflowItems = this._toolbar.$element().find(`.${TOOLBAR_AUTO_HIDE_ITEM_CLASS}`);

        if(!overflowItems.length) {
            return;
        }

        $(overflowItems).removeClass(TOOLBAR_HIDDEN_ITEM);

        let itemsWidth = this._getItemsWidth();

        while(overflowItems.length && getWidth(this._toolbar.$element()) < itemsWidth) {
            const $item = overflowItems.eq(-1);
            itemsWidth -= getOuterWidth($item);
            $item.addClass(TOOLBAR_HIDDEN_ITEM);
            overflowItems.splice(-1, 1);
        }
    }

    _getItemsWidth() {
        return this._toolbar._getSummaryItemsWidth([this._toolbar._$beforeSection, this._toolbar._$centerSection, this._toolbar._$afterSection]);
    }

    _getItems() {
        return grep(this._toolbar.option('items') || [], (item) => {
            return !this._isMenuItem(item);
        });
    }

    _isMenuItem(itemData) {
        return itemData.location === 'menu' || itemData.locateInMenu === 'always';
    }

    _applyCompactMode() {
        const $element = this._toolbar.$element();
        $element.removeClass(TOOLBAR_COMPACT_CLASS);

        if(this._toolbar.option('compactMode') && this._toolbar._getSummaryItemsWidth(this._toolbar.itemElements(), true) > getWidth($element)) {
            $element.addClass(TOOLBAR_COMPACT_CLASS);
        }
    }

    _arrangeItems() {
        if(this._toolbar.$element().is(':hidden')) {
            return;
        }

        this._toolbar._$centerSection.css({
            margin: '0 auto',
            float: 'none'
        });

        each(this._restoreItems || [], function(_, obj) {
            $(obj.container).append(obj.item);
        });
        this._restoreItems = [];

        const elementWidth = getWidth(this._toolbar.$element());

        this._hideOverflowItems();

        const beforeRect = getBoundingRect(this._toolbar._$beforeSection.get(0));
        const afterRect = getBoundingRect(this._toolbar._$afterSection.get(0));

        this._alignCenterSection(beforeRect, afterRect, elementWidth);

        const $label = this._toolbar._$itemsContainer.find(`.${TOOLBAR_LABEL_CLASS}`).eq(0);
        const $section = $label.parent();

        if(!$label.length) {
            return;
        }

        const labelOffset = beforeRect.width ? beforeRect.width : $label.position().left;
        const widthBeforeSection = $section.hasClass(TOOLBAR_BEFORE_CLASS) ? 0 : labelOffset;
        const widthAfterSection = $section.hasClass(TOOLBAR_AFTER_CLASS) ? 0 : afterRect.width;
        let elemsAtSectionWidth = 0;

        $section.children().not(`.${TOOLBAR_LABEL_CLASS}`).each(function() {
            elemsAtSectionWidth += getOuterWidth(this);
        });

        const freeSpace = elementWidth - elemsAtSectionWidth;
        const sectionMaxWidth = Math.max(freeSpace - widthBeforeSection - widthAfterSection, 0);

        if($section.hasClass(TOOLBAR_BEFORE_CLASS)) {
            this._alignSection(this._toolbar._$beforeSection, sectionMaxWidth);
        } else {
            const labelPaddings = getOuterWidth($label) - getWidth($label);
            $label.css('maxWidth', sectionMaxWidth - labelPaddings);
        }
    }

    _alignCenterSection(beforeRect, afterRect, elementWidth) {
        this._alignSection(this._toolbar._$centerSection, elementWidth - beforeRect.width - afterRect.width);

        const isRTL = this._toolbar.option('rtlEnabled');
        const leftRect = isRTL ? afterRect : beforeRect;
        const rightRect = isRTL ? beforeRect : afterRect;
        const centerRect = getBoundingRect(this._toolbar._$centerSection.get(0));

        if(leftRect.right > centerRect.left || centerRect.right > rightRect.left) {
            this._toolbar._$centerSection.css({
                marginLeft: leftRect.width,
                marginRight: rightRect.width,
                float: leftRect.width > rightRect.width ? 'none' : 'right'
            });
        }
    }

    _alignSection($section, maxWidth) {
        const $labels = $section.find(`.${TOOLBAR_LABEL_CLASS}`);
        let labels = $labels.toArray();

        maxWidth = maxWidth - this._getCurrentLabelsPaddings(labels);

        const currentWidth = this._getCurrentLabelsWidth(labels);
        const difference = Math.abs(currentWidth - maxWidth);

        if(maxWidth < currentWidth) {
            labels = labels.reverse();
            this._alignSectionLabels(labels, difference, false);
        } else {
            this._alignSectionLabels(labels, difference, true);
        }
    }

    _alignSectionLabels(labels, difference, expanding) {
        const getRealLabelWidth = function(label) { return getBoundingRect(label).width; };

        for(let i = 0; i < labels.length; i++) {
            const $label = $(labels[i]);
            const currentLabelWidth = Math.ceil(getRealLabelWidth(labels[i]));
            let labelMaxWidth;

            if(expanding) {
                $label.css('maxWidth', 'inherit');
            }

            const possibleLabelWidth = Math.ceil(expanding ? getRealLabelWidth(labels[i]) : currentLabelWidth);

            if(possibleLabelWidth < difference) {
                labelMaxWidth = expanding ? possibleLabelWidth : 0;
                difference = difference - possibleLabelWidth;
            } else {
                labelMaxWidth = expanding ? currentLabelWidth + difference : currentLabelWidth - difference;
                $label.css('maxWidth', labelMaxWidth);
                break;
            }

            $label.css('maxWidth', labelMaxWidth);
        }
    }

    _getCurrentLabelsWidth(labels) {
        let width = 0;

        labels.forEach(function(label, index) {
            width += getOuterWidth(label);
        });

        return width;
    }

    _getCurrentLabelsPaddings(labels) {
        let padding = 0;

        labels.forEach(function(label, index) {
            padding += (getOuterWidth(label) - getWidth(label));
        });

        return padding;
    }

    _optionChanged(name, value) {
        switch(name) {
            case 'compactMode':
                this._applyCompactMode();
                break;
            case 'disabled':
                this._dropDownMenu?.option(name, value);
                break;
            case 'overflowMenuVisible':
                this._dropDownMenu?.option('opened', value);
                break;
            case 'onItemClick':
                this._dropDownMenu?.option(name, value);
                break;
            case 'menuContainer':
                this._dropDownMenu?.option('container', value);
                break;
            case 'menuItemTemplate':
                this._dropDownMenu?.option('itemTemplate', value);
                break;
        }

    }

}
