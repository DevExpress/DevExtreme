import ItemOptionAction from "./ui.form.item_option_action";
import { data } from "../../core/element_data";
import { extend } from "../../core/utils/extend";

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
                tabPanel.option(`items[${itemIndex}].${optionName}`, value);
                return true;
            }
        }
        return false;
    }
}

class ValidationRulesItemOptionAction extends ItemOptionAction {
    tryExecute() {
        const { item } = this._options;
        const instance = this.findInstance();
        const validator = instance && data(instance.$element()[0], "dxValidator");
        if(validator && item) {
            const filterRequired = item => item.type === "required";
            const oldContainsRequired = (validator.option("validationRules") || []).some(filterRequired);
            const newContainsRequired = (item.validationRules || []).some(filterRequired);
            if(!oldContainsRequired && !newContainsRequired || oldContainsRequired && newContainsRequired) {
                validator.option("validationRules", item.validationRules);
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
        case "editorOptions":
        case "buttonOptions":
            return new WidgetOptionItemOptionAction(itemActionOptions);
        case "validationRules":
            return new ValidationRulesItemOptionAction(itemActionOptions);
        case "cssClass":
            return new CssClassItemOptionAction(itemActionOptions);
        case "badge":
        case "disabled":
        case "icon":
        case "template":
        case "tabTemplate":
        case "title":
            return new TabOptionItemOptionAction(extend(itemActionOptions, { optionName }));
        default:
            return null;
    }
};

export default tryCreateItemOptionAction;
