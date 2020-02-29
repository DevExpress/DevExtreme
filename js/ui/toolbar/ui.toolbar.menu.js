const $ = require('../../core/renderer');
const registerComponent = require('../../core/component_registrator');
const each = require('../../core/utils/iterator').each;
const List = require('../list/ui.list.base');

const TOOLBAR_MENU_ACTION_CLASS = 'dx-toolbar-menu-action';
const TOOLBAR_HIDDEN_BUTTON_CLASS = 'dx-toolbar-hidden-button';
const TOOLBAR_MENU_SECTION_CLASS = 'dx-toolbar-menu-section';
const TOOLBAR_MENU_LAST_SECTION_CLASS = 'dx-toolbar-menu-last-section';

const ToolbarMenu = List.inherit({
    _activeStateUnit: '.' + TOOLBAR_MENU_ACTION_CLASS,

    _initMarkup: function() {
        this._renderSections();
        this.callBase();
    },

    _getSections: function() {
        return this._itemContainer().children();
    },

    _itemElements: function() {
        return this._getSections().children(this._itemSelector());
    },

    _renderSections: function() {
        const that = this;
        const $container = this._itemContainer();

        each(['before', 'center', 'after', 'menu'], function() {
            const sectionName = '_$' + this + 'Section';
            let $section = that[sectionName];

            if(!$section) {
                that[sectionName] = $section = $('<div>')
                    .addClass(TOOLBAR_MENU_SECTION_CLASS);
            }

            $section.appendTo($container);
        });
    },

    _renderItems: function() {
        this.callBase.apply(this, arguments);
        this._updateSections();
    },

    _updateSections: function() {
        const $sections = this.$element().find('.' + TOOLBAR_MENU_SECTION_CLASS);
        $sections.removeClass(TOOLBAR_MENU_LAST_SECTION_CLASS);
        $sections.not(':empty').eq(-1).addClass(TOOLBAR_MENU_LAST_SECTION_CLASS);
    },

    _renderItem: function(index, item, itemContainer, $after) {
        const location = item.location || 'menu';
        const $container = this['_$' + location + 'Section'];
        const itemElement = this.callBase(index, item, $container, $after);

        if(this._getItemTemplateName({ itemData: item })) {
            itemElement.addClass('dx-toolbar-menu-custom');
        }

        if(location === 'menu' || item.widget === 'dxButton' || item.isAction) {
            itemElement.addClass(TOOLBAR_MENU_ACTION_CLASS);
        }

        if(item.widget === 'dxButton') {
            itemElement.addClass(TOOLBAR_HIDDEN_BUTTON_CLASS);
        }

        itemElement.addClass(item.cssClass);

        return itemElement;
    },

    _getItemTemplateName: function(args) {
        const template = this.callBase(args);

        const data = args.itemData;
        const menuTemplate = data && data['menuItemTemplate'];

        return menuTemplate || template;
    },

    _itemClickHandler: function(e, args, config) {
        if($(e.target).closest('.' + TOOLBAR_MENU_ACTION_CLASS).length) {
            this.callBase(e, args, config);
        }
    },

    _clean: function() {
        this._getSections().empty();
        this.callBase();
    }
});

registerComponent('dxToolbarMenu', ToolbarMenu);

module.exports = ToolbarMenu;
