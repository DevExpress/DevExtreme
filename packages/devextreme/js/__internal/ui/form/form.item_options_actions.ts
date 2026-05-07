/* eslint-disable max-classes-per-file */
import type { ValidationRule } from '@js/common';
import { data } from '@js/core/element_data';
import type { GroupItem } from '@js/ui/form';
import type { ItemOptionActionOptions, ValidationRulesItemOptionActionOption } from '@ts/ui/form/form.item_option_action';
import ItemOptionAction from '@ts/ui/form/form.item_option_action';
import type { PreparedGroupedItem } from '@ts/ui/form/form.items_runtime_info';
import { getFullOptionName } from '@ts/ui/form/form.utils';

export type ItemOptionActionType = WidgetOptionItemOptionAction
  | ValidationRulesItemOptionAction
  | CssClassItemOptionAction
  | TabOptionItemOptionAction
  | TabsOptionItemOptionAction
  | SimpleItemTemplateChangedAction
  | GroupItemTemplateChangedAction
  | null;

class WidgetOptionItemOptionAction extends ItemOptionAction {
  tryExecute(): boolean {
    const { value } = this._options;
    const instance = this.findInstance();
    if (instance) {
      instance.option(value);
      return true;
    }
    return false;
  }
}

class TabOptionItemOptionAction extends ItemOptionAction {
  tryExecute(): boolean {
    const tabPanel = this.findInstance();
    if (tabPanel) {
      const { optionName, item, value } = this._options;
      const itemIndex = this._itemsRunTimeInfo.findItemIndexByItem(item) ?? -1;
      if (itemIndex >= 0) {
        tabPanel.option(getFullOptionName(`items[${itemIndex}]`, optionName), value);
        return true;
      }
    }
    return false;
  }
}

class SimpleItemTemplateChangedAction extends ItemOptionAction {
  tryExecute(): boolean {
    return false;
  }
}

class GroupItemTemplateChangedAction extends ItemOptionAction<
  ItemOptionActionOptions<GroupItem>
> {
  tryExecute(): boolean {
    const preparedItem: PreparedGroupedItem | undefined = this.findPreparedItem();
    if (preparedItem?._prepareGroupItemTemplate
      && preparedItem._renderGroupContentTemplate
    ) {
      preparedItem._prepareGroupItemTemplate(this._options.item.template);
      preparedItem._renderGroupContentTemplate();
      return true;
    }
    return false;
  }
}
class TabsOptionItemOptionAction extends ItemOptionAction {
  tryExecute(): boolean {
    const tabPanel = this.findInstance();
    if (tabPanel) {
      const { value } = this._options;
      tabPanel.option('dataSource', value);
      return true;
    }
    return false;
  }
}

class ValidationRulesItemOptionAction extends ItemOptionAction<
  ValidationRulesItemOptionActionOption
> {
  tryExecute(): boolean {
    const { item } = this._options;
    const instance = this.findInstance();
    const validator = instance && data(instance.$element()[0], 'dxValidator');
    if (validator && item) {
      const filterRequired = (validationRule: ValidationRule): boolean => validationRule.type === 'required';
      const oldContainsRequired = (validator.option('validationRules') || []).some(filterRequired);
      const newContainsRequired = (item.validationRules ?? []).some(filterRequired);
      if (oldContainsRequired === newContainsRequired) {
        validator.option('validationRules', item.validationRules);
        return true;
      }
    }
    return false;
  }
}

class CssClassItemOptionAction extends ItemOptionAction {
  tryExecute(): boolean {
    const $itemContainer = this.findItemContainer();

    if ($itemContainer.length) {
      const { previousValue = '', value = '' } = this._options;

      $itemContainer
        .removeClass(previousValue as string)
        .addClass(value as string);
      return true;
    }
    return false;
  }
}

const tryCreateItemOptionAction = (
  optionName: string | undefined,
  itemActionOptions: ItemOptionActionOptions,
): ItemOptionActionType => {
  switch (optionName) {
    case 'editorOptions': // SimpleItem/#editorOptions
    case 'buttonOptions': // ButtonItem/#buttonOptions
      return new WidgetOptionItemOptionAction(itemActionOptions);
    case 'validationRules': // SimpleItem/#validationRules
      return new ValidationRulesItemOptionAction(itemActionOptions) as ItemOptionActionType;
    case 'cssClass': // ButtonItem/#cssClass or EmptyItem/#cssClass or GroupItem/#cssClass or SimpleItem/#cssClass or TabbedItem/#cssClass
      return new CssClassItemOptionAction(itemActionOptions);
    case 'badge': // TabbedItem/tabs/#badge
    case 'disabled': // TabbedItem/tabs/#disabled
    case 'icon': // TabbedItem/tabs/#icon
    case 'tabTemplate': // TabbedItem/tabs/#tabTemplate
    case 'title': { // TabbedItem/tabs/#title
      itemActionOptions.optionName = optionName;
      return new TabOptionItemOptionAction(itemActionOptions);
    }
    case 'tabs': // TabbedItem/tabs
      return new TabsOptionItemOptionAction(itemActionOptions);
    case 'template': {
      // TabbedItem/tabs/#template or SimpleItem/#template or GroupItem/#template
      const itemType = itemActionOptions?.item?.itemType
        ?? itemActionOptions.itemsRunTimeInfo.findPreparedItemByItem(
          itemActionOptions?.item,
        )?.itemType;

      if (itemType === 'simple') {
        return new SimpleItemTemplateChangedAction(itemActionOptions);
      } if (itemType === 'group') {
        return new GroupItemTemplateChangedAction(itemActionOptions);
      }

      itemActionOptions.optionName = optionName;
      return new TabOptionItemOptionAction(itemActionOptions);
    }
    default:
      return null;
  }
};

export default tryCreateItemOptionAction;
