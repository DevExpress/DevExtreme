import ItemOptionAction from "./ui.form.item_option_action";
import { data } from "../../core/element_data";

class WidgetOptionItemOptionAction extends ItemOptionAction {
    tryExecute() {
        const instance = this.getInstance();
        instance.option(this.value);
        return super.tryExecute();
    }
}

class ValidationRulesItemOptionAction extends ItemOptionAction {
    tryExecute() {
        const instance = this.getInstance();
        const validator = data(instance.$element()[0], "dxValidator");
        if(validator) {
            const filterRequired = item => item.type === "required";
            const oldContainsRequired = (validator.option("validationRules") || []).some(filterRequired);
            const newContainsRequired = (this.item.validationRules || []).some(filterRequired);
            if(!oldContainsRequired && !newContainsRequired || oldContainsRequired && newContainsRequired) {
                validator.option("validationRules", this.item.validationRules);
                return super.tryExecute();
            }
        }
        return false;
    }
}

class CssClassItemOptionAction extends ItemOptionAction {
    constructor(options) {
        super(options);
        this.previousValue = options.previousValue;
    }

    tryExecute() {
        const $itemContainer = this.getItemContainer();
        $itemContainer.removeClass(this.previousValue).addClass(this.value);
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
        default:
            return null;
    }
};

export default tryCreateItemOptionAction;
