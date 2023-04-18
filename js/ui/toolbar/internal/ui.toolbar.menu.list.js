import $ from '../../../core/renderer';
import { each } from '../../../core/utils/iterator';
import { ListBase } from '../../list/ui.list.base';

const TOOLBAR_MENU_ACTION_CLASS = 'dx-toolbar-menu-action';
const TOOLBAR_HIDDEN_BUTTON_CLASS = 'dx-toolbar-hidden-button';
const TOOLBAR_HIDDEN_BUTTON_GROUP_CLASS = 'dx-toolbar-hidden-button-group';
const TOOLBAR_MENU_SECTION_CLASS = 'dx-toolbar-menu-section';
const TOOLBAR_MENU_CUSTOM_CLASS = 'dx-toolbar-menu-custom';
const TOOLBAR_MENU_LAST_SECTION_CLASS = 'dx-toolbar-menu-last-section';

export default class ToolbarMenuList extends ListBase {
    _init() {
        super._init();

        this._activeStateUnit = `.${TOOLBAR_MENU_ACTION_CLASS}:not(.${TOOLBAR_HIDDEN_BUTTON_GROUP_CLASS})`;
    }

    _initMarkup() {
        this._renderSections();
        super._initMarkup();
    }

    _getSections() {
        return this._itemContainer().children();
    }

    _itemElements() {
        return this._getSections().children(this._itemSelector());
    }

    _renderSections() {
        const $container = this._itemContainer();

        each(['before', 'center', 'after', 'menu'], (_, section) => {
            const sectionName = `_$${section}Section`;

            if(!this[sectionName]) {
                this[sectionName] = $('<div>')
                    .addClass(TOOLBAR_MENU_SECTION_CLASS);
            }

            this[sectionName].appendTo($container);
        });
    }

    _renderItems() {
        super._renderItems.apply(this, arguments);
        this._updateSections();
        this._updateRole();
    }

    _updateRole() {
        const $sections = this.$element().find(`.${TOOLBAR_MENU_SECTION_CLASS}`);

        const $emptySections = $sections.filter(':empty');
        const $notEmptySections = $sections.not(':empty');

        $emptySections.removeAttr('role');
        $notEmptySections.attr('role', 'menu');
    }

    _updateSections() {
        const $sections = this.$element().find(`.${TOOLBAR_MENU_SECTION_CLASS}`);
        $sections.removeClass(TOOLBAR_MENU_LAST_SECTION_CLASS);
        $sections.not(':empty').eq(-1).addClass(TOOLBAR_MENU_LAST_SECTION_CLASS);
    }

    _renderItem(index, item, itemContainer, $after) {
        const location = item.location ?? 'menu';
        const $container = this[`_$${location}Section`];
        const itemElement = super._renderItem(index, item, $container, $after);

        if(this._getItemTemplateName({ itemData: item })) {
            itemElement.addClass(TOOLBAR_MENU_CUSTOM_CLASS);
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
    }

    _getItemTemplateName(args) {
        const template = super._getItemTemplateName(args);

        const data = args.itemData;
        const menuTemplate = data && data['menuItemTemplate'];

        return menuTemplate || template;
    }

    _dataSourceOptions() {
        return {
            paginate: false
        };
    }

    _itemClickHandler(e, args, config) {
        if($(e.target).closest(`.${TOOLBAR_MENU_ACTION_CLASS}`).length) {
            super._itemClickHandler(e, args, config);
        }
    }

    _getAriaTarget() {
        return this.option('_areaTarget') ?? super._getAriaTarget();
    }

    _clean() {
        this._getSections().empty();
        super._clean();
    }
}
