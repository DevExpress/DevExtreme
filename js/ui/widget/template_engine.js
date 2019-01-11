import { isString } from "../../core/utils/type";
import errors from "../../core/errors";
import { getTemplateEngines } from "./template_engines_registration";

let templateEngines = getTemplateEngines();
let currentTemplateEngine;

const setTemplateEngine = (templateEngine) => {
    if(isString(templateEngine)) {
        currentTemplateEngine = templateEngines[templateEngine];
        if(!currentTemplateEngine) {
            throw errors.Error("E0020", templateEngine);
        }
    } else {
        currentTemplateEngine = templateEngine;
    }
};

const getCurrentTemplateEngine = () => {
    return currentTemplateEngine;
};

setTemplateEngine("default");

module.exports.setTemplateEngine = setTemplateEngine;
module.exports.getCurrentTemplateEngine = getCurrentTemplateEngine;
