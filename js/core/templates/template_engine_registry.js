import { isString } from '../utils/type';
import errors from '../errors';

const templateEngines = {};
let currentTemplateEngine;

export function registerTemplateEngine(name, templateEngine) {
    templateEngines[name] = templateEngine;
}

/**
* @name setTemplateEngine
* @publicName setTemplateEngine(name)
* @param1 templateEngineName:string
* @namespace DevExpress
* @module core/set_template_engine
* @export default
*/
/**
* @name setTemplateEngine
* @publicName setTemplateEngine(options)
* @param1 templateEngineOptions:object
* @param1_field1 compile:function(html, $element)
* @param1_field2 render:function(template, data, index)
* @namespace DevExpress
* @module core/set_template_engine
* @export default
*/

export function setTemplateEngine(templateEngine) {
    if(isString(templateEngine)) {
        currentTemplateEngine = templateEngines[templateEngine];
        if(!currentTemplateEngine) {
            throw errors.Error('E0020', templateEngine);
        }
    } else {
        currentTemplateEngine = templateEngine;
    }
}

export function getCurrentTemplateEngine() { return currentTemplateEngine; }
