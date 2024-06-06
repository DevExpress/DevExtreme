import ItemOptionAction from './ui.form.item_option_action';
import { data } from '../../core/element_data';
import { extend } from '../../core/utils/extend';
import { getFullOptionName } from './ui.form.utils';

class WidgetOptionItemOptionAction extends ItemOptionAction {
    tryExecute() {
        const { value } = this._options;
        const instance = this.findInstance();
        if(instance) {
            instance.option(value);
            return true;
        }
        return false;
    }
}

class TabOptionItemOptionAction extends ItemOptionAction {
    tryExecute() {
        const tabPanel = this.findInstance();
        if(tabPanel) {
            const { optionName, item, value } = this._options;
            const itemIndex = this._itemsRunTimeInfo.findItemIndexByItem(item);
            if(itemIndex >= 0) {
                tabPanel.option(getFullOptionName(`items[${itemIndex}]`, optionName), value);
                return true;
            }
        }
        return false;
    }
}

class SimpleItemTemplateChangedAction extends ItemOptionAction {
    tryExecute() {
        return false;
    }
}

class GroupItemTemplateChangedAction extends ItemOptionAction {
    tryExecute() {
        const preparedItem = this.findPreparedItem();
        if(preparedItem != null && preparedItem._prepareGroupItemTemplate && preparedItem._renderGroupContentTemplate) {
            preparedItem._prepareGroupItemTemplate(this._options.item.template);
            preparedItem._renderGroupContentTemplate();
            return true;
        }
        return false;
    }
}
class TabsOptionItemOptionAction extends ItemOptionAction {
    tryExecute() {
        const tabPanel = this.findInstance();
        if(tabPanel) {
            const { value } = this._options;
            tabPanel.option('dataSource', value);
            return true;
        }
        return false;
    }
}

class ValidationRulesItemOptionAction extends ItemOptionAction {
    tryExecute() {
        const { item } = this._options;
        const instance = this.findInstance();
        const validator = instance && data(instance.$element()[0], 'dxValidator');
        if(validator && item) {
            const filterRequired = item => item.type === 'required';
            const oldContainsRequired = (validator.option('validationRules') || []).some(filterRequired);
            const newContainsRequired = (item.validationRules || []).some(filterRequired);
            if(!oldContainsRequired && !newContainsRequired || oldContainsRequired && newContainsRequired) {
                validator.option('validationRules', item.validationRules);
                return true;
            }
        }
        return false;
    }
}

class CssClassItemOptionAction extends ItemOptionAction {
    tryExecute() {
        const $itemContainer = this.findItemContainer();
        const { previousValue, value } = this._options;
        if($itemContainer) {
            $itemContainer.removeClass(previousValue).addClass(value);
            return true;
        }
        return false;
    }
}

const tryCreateItemOptionAction = (optionName, itemActionOptions) => {
    switch(optionName) {
        case 'editorOptions': // SimpleItem/#editorOptions
        case 'buttonOptions': // ButtonItem/#buttonOptions
            return new WidgetOptionItemOptionAction(itemActionOptions);
        case 'validationRules': // SimpleItem/#validationRules
            return new ValidationRulesItemOptionAction(itemActionOptions);
        case 'cssClass': // ButtonItem/#cssClass or EmptyItem/#cssClass or GroupItem/#cssClass or SimpleItem/#cssClass or TabbedItem/#cssClass
            return new CssClassItemOptionAction(itemActionOptions);
        case 'badge': // TabbedItem/tabs/#badge
        case 'disabled': // TabbedItem/tabs/#disabled
        case 'icon': // TabbedItem/tabs/#icon
        case 'tabTemplate': // TabbedItem/tabs/#tabTemplate
        case 'title': // TabbedItem/tabs/#title
            return new TabOptionItemOptionAction(extend(itemActionOptions, { optionName }));
        case 'tabs': // TabbedItem/tabs
            return new TabsOptionItemOptionAction(itemActionOptions);
        case 'template': {
            // TabbedItem/tabs/#template or SimpleItem/#template or GroupItem/#template
            const itemType = itemActionOptions?.item?.itemType ?? itemActionOptions.itemsRunTimeInfo.findPreparedItemByItem(itemActionOptions?.item)?.itemType;
            if(itemType === 'simple') {
                return new SimpleItemTemplateChangedAction(itemActionOptions);
            } else if(itemType === 'group') {
                return new GroupItemTemplateChangedAction(itemActionOptions);
            }
            return new TabOptionItemOptionAction(extend(itemActionOptions, { optionName }));
        }
        default:
            return null;
    }
};

export default tryCreateItemOptionAction;
