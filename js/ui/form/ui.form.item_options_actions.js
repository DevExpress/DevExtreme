import ItemOptionAction from "./ui.form.item_option_action";
import { data } from "../../core/element_data";
import { extend } from "../../core/utils/extend";
import { getFullOptionName } from "./ui.form.utils";

class WidgetOptionItemOptionAction extends ItemOptionAction {
    tryExecute() {
        const { value } = this._options;
        const instance = this.getInstance();
        instance.option(value);
        return super.tryExecute();
    }
}

class TabOptionItemOptionAction extends ItemOptionAction {
    tryExecute() {
        const { optionName, value, previousValue, item } = this._options;
        const instance = this.getInstance();
        const targetedTitle = optionName === "title" ? previousValue : item.title;
        const tabPanelItems = instance.option("items") || [];
        const itemIndex = tabPanelItems.map(item => item.title).indexOf(targetedTitle);

        if(itemIndex > -1) {
            instance.option(getFullOptionName(`items[${itemIndex}]`, optionName), value);
            return super.tryExecute();
        }
        return false;
    }
}

class ValidationRulesItemOptionAction extends ItemOptionAction {
    tryExecute() {
        const { item } = this._options;
        const instance = this.getInstance();
        const validator = data(instance.$element()[0], "dxValidator");
        if(validator) {
            const filterRequired = item => item.type === "required";
            const oldContainsRequired = (validator.option("validationRules") || []).some(filterRequired);
            const newContainsRequired = (item.validationRules || []).some(filterRequired);
            if(!oldContainsRequired && !newContainsRequired || oldContainsRequired && newContainsRequired) {
                validator.option("validationRules", item.validationRules);
                return super.tryExecute();
            }
        }
        return false;
    }
}

class CssClassItemOptionAction extends ItemOptionAction {
    tryExecute() {
        const $itemContainer = this.getItemContainer();
        const { previousValue, value } = this._options;
        $itemContainer.removeClass(previousValue).addClass(value);
        return super.tryExecute();
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
        case "title": {
            const { item, itemsRunTimeInfo } = itemActionOptions;
            const widgetInstance = itemsRunTimeInfo.findWidgetInstanceByItem(item);
            if(widgetInstance && widgetInstance.NAME === "dxTabPanel") {
                return new TabOptionItemOptionAction(extend(itemActionOptions, { optionName }));
            }
            return null;
        }
        default:
            return null;
    }
};

export default tryCreateItemOptionAction;
