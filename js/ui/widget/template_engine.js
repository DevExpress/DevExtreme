const errors = require("../../core/errors"),
    typeUtils = require("../../core/utils/type"),
    domUtils = require("../../core/utils/dom");

let templateEngines = {};
let currentTemplateEngine;

const registerTemplateEngine = (name, templateEngine) => {
    templateEngines[name] = templateEngine;
};

const setTemplateEngine = (templateEngine) => {
    if(typeUtils.isString(templateEngine)) {
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

registerTemplateEngine("default", {
    compile: (element) => domUtils.normalizeTemplateElement(element),
    render: (template, model, index) => template.clone()
});

registerTemplateEngine("jquery-tmpl", {
    compile: (element) => {
        return domUtils.extractTemplateMarkup(element);
    },
    render: (template, data) => {
        /* global jQuery */
        return jQuery.tmpl(template, data);
    }
});

registerTemplateEngine("jsrender", {
    compile: (element) => {
        /* global jQuery */
        /* global jsrender */
        return (jQuery ? jQuery : jsrender).templates(domUtils.extractTemplateMarkup(element));
    },
    render: (template, data) => {
        return template.render(data);
    }
});

registerTemplateEngine("mustache", {
    compile: (element) => {
        /* global Mustache */
        return domUtils.extractTemplateMarkup(element);
    },
    render: (template, data) => {
        return Mustache.render(template, data);
    }
});

registerTemplateEngine("hogan", {
    compile: (element) => {
        /* global Hogan */
        return Hogan.compile(domUtils.extractTemplateMarkup(element));
    },
    render: (template, data) => {
        return template.render(data);
    }
});

registerTemplateEngine("underscore", {
    compile: (element) => {
        /* global _ */
        return _.template(domUtils.extractTemplateMarkup(element));
    },
    render: (template, data) => {
        return template(data);
    }
});

registerTemplateEngine("handlebars", {
    compile: (element) => {
        /* global Handlebars */
        return Handlebars.compile(domUtils.extractTemplateMarkup(element));
    },
    render: (template, data) => {
        return template(data);
    }
});

registerTemplateEngine("doT", {
    compile: (element) => {
        /* global doT */
        return doT.template(domUtils.extractTemplateMarkup(element));
    },
    render: (template, data) => {
        return template(data);
    }
});

setTemplateEngine("default");

module.exports.setTemplateEngine = setTemplateEngine;
module.exports.registerTemplateEngine = registerTemplateEngine;
module.exports.getCurrentTemplateEngine = getCurrentTemplateEngine;
