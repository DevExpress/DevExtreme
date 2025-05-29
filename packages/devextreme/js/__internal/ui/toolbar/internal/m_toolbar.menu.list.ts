import $ from '@js/core/renderer';
import { each } from '@js/core/utils/iterator';
import { ListBase } from '@ts/ui/list/m_list.base';

const TOOLBAR_MENU_ACTION_CLASS = 'dx-toolbar-menu-action';
const TOOLBAR_HIDDEN_BUTTON_CLASS = 'dx-toolbar-hidden-button';
const TOOLBAR_HIDDEN_BUTTON_GROUP_CLASS = 'dx-toolbar-hidden-button-group';
const TOOLBAR_MENU_SECTION_CLASS = 'dx-toolbar-menu-section';
const TOOLBAR_MENU_CUSTOM_CLASS = 'dx-toolbar-menu-custom';
const TOOLBAR_MENU_LAST_SECTION_CLASS = 'dx-toolbar-menu-last-section';
const SCROLLVIEW_CONTENT_CLASS = 'dx-scrollview-content';
export default class ToolbarMenuList extends ListBase {
  _activeStateUnit!: string;

  _expandableComponents!: string[];

  _init(): void {
    super._init();

    this._activeStateUnit = `.${TOOLBAR_MENU_ACTION_CLASS}:not(.${TOOLBAR_HIDDEN_BUTTON_GROUP_CLASS})`;
    this._expandableComponents = ['dxDropDownButton'];
  }

  _initMarkup(): void {
    this._renderSections();
    super._initMarkup();
    this._setMenuRole();
  }

  _getSections() {
    return this._itemContainer().children();
  }

  _itemElements() {
    return this._getSections().children(this._itemSelector());
  }

  _renderSections(): void {
    const $container = this._itemContainer();

    each(['before', 'center', 'after', 'menu'], (_, section) => {
      const sectionName = `_$${section}Section`;

      if (!this[sectionName]) {
        this[sectionName] = $('<div>')
          .addClass(TOOLBAR_MENU_SECTION_CLASS);
      }

      this[sectionName].appendTo($container);
    });
  }

  _renderItems(): void {
    // @ts-expect-error ts-error
    super._renderItems.apply(this, arguments);
    this._updateSections();
  }

  _setMenuRole(): void {
    const $menuContainer = this.$element().find(`.${SCROLLVIEW_CONTENT_CLASS}`);

    $menuContainer.attr('role', 'menu');
  }

  _updateSections(): void {
    const $sections = this.$element().find(`.${TOOLBAR_MENU_SECTION_CLASS}`);
    $sections.removeClass(TOOLBAR_MENU_LAST_SECTION_CLASS);
    $sections.not(':empty').eq(-1).addClass(TOOLBAR_MENU_LAST_SECTION_CLASS);
  }

  _renderItem(index, item, itemContainer, $after) {
    const $container = this[`_$${item.location ?? 'menu'}Section`];
    const itemElement = super._renderItem(index, item, $container, $after);

    const itemElementClasses = this._getItemCssClasses(item);
    itemElement.addClass(itemElementClasses.join(' '));

    return itemElement;
  }

  _getItemCssClasses(item): string[] {
    const location = item.location ?? 'menu';
    const cssClasses: string[] = [];

    if (item.cssClass) {
      cssClasses.push(item.cssClass);
    }

    if (this._getItemTemplateName({ itemData: item })) {
      cssClasses.push(TOOLBAR_MENU_CUSTOM_CLASS);
    }

    if (this._expandableComponents.includes(item.widget)) {
      return cssClasses;
    }

    if (location === 'menu' || item.widget === 'dxButton' || item.widget === 'dxButtonGroup' || item.isAction) {
      cssClasses.push(TOOLBAR_MENU_ACTION_CLASS);
    }

    if (item.widget === 'dxButton') {
      cssClasses.push(TOOLBAR_HIDDEN_BUTTON_CLASS);
    }

    if (item.widget === 'dxButtonGroup') {
      cssClasses.push(TOOLBAR_HIDDEN_BUTTON_GROUP_CLASS);
    }

    return cssClasses;
  }

  _getItemTemplateName(args) {
    const template = super._getItemTemplateName(args);

    const data = args.itemData;
    const menuTemplate = data?.menuItemTemplate;

    return menuTemplate || template;
  }

  _dataSourceOptions() {
    return {
      paginate: false,
    };
  }

  _itemClickHandler(e, args, config): void {
    if ($(e.target).closest(`.${TOOLBAR_MENU_ACTION_CLASS}`).length) {
      super._itemClickHandler(e, args, config);
    }
  }

  _clean(): void {
    this._getSections().empty();
    super._clean();
  }
}
