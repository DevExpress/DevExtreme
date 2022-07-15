import $ from '../../core/renderer';
import registerComponent from '../../core/component_registrator';
import { each } from '../../core/utils/iterator';
import { ListBase } from '../list/ui.list.base';

const TOOLBAR_MENU_ACTION_CLASS = 'dx-toolbar-menu-action';
const TOOLBAR_HIDDEN_BUTTON_CLASS = 'dx-toolbar-hidden-button';
const TOOLBAR_HIDDEN_BUTTON_GROUP_CLASS = 'dx-toolbar-hidden-button-group';
const TOOLBAR_MENU_SECTION_CLASS = 'dx-toolbar-menu-section';
const TOOLBAR_MENU_LAST_SECTION_CLASS = 'dx-toolbar-menu-last-section';

const ToolbarMenuList = ListBase.inherit({
    _activeStateUnit: `.${TOOLBAR_MENU_ACTION_CLASS}`,

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

            if(!that[sectionName]) {
                that[sectionName] = $('<div>')
                    .addClass(TOOLBAR_MENU_SECTION_CLASS);
            }

            that[sectionName].appendTo($container);
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

        if(location === 'menu' || item.widget === 'dxButton' || item.widget === 'dxButtonGroup' || item.isAction) {
            itemElement.addClass(TOOLBAR_MENU_ACTION_CLASS);
        }

        if(item.widget === 'dxButton') {
            itemElement.addClass(TOOLBAR_HIDDEN_BUTTON_CLASS);
        }

        if(item.widget === 'dxButtonGroup') {
            itemElement.addClass(TOOLBAR_HIDDEN_BUTTON_GROUP_CLASS);
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

    _dataSourceOptions: function() {
        return {
            paginate: false
        };
    },

    _itemClickHandler: function(e, args, config) {
        if($(e.target).closest('.' + TOOLBAR_MENU_ACTION_CLASS).length) {
            this.callBase(e, args, config);
        }
    },

    _getAriaTarget: function() {
        return this.option('_areaTarget') ?? this.callBase();
    },

    _clean: function() {
        this._getSections().empty();
        this.callBase();
    }
});

registerComponent('dxToolbarMenuList', ToolbarMenuList);

export default ToolbarMenuList;
