import { isString } from '../../core/utils/type';
import errors from '../../core/errors';

let templateEngines = {};
let currentTemplateEngine;

const registerTemplateEngine = (name, templateEngine) => {
    templateEngines[name] = templateEngine;
};

const setTemplateEngine = (templateEngine) => {
    if(isString(templateEngine)) {
        currentTemplateEngine = templateEngines[templateEngine];
        if(!currentTemplateEngine) {
            throw errors.Error('E0020', templateEngine);
        }
    } else {
        currentTemplateEngine = templateEngine;
    }
};

const getCurrentTemplateEngine = () => {
    return currentTemplateEngine;
};

module.exports.setTemplateEngine = setTemplateEngine;
module.exports.getCurrentTemplateEngine = getCurrentTemplateEngine;
module.exports.registerTemplateEngine = registerTemplateEngine;
