var errors = require("../../core/errors"),
    typeUtils = require("../../core/utils/type"),
    domUtils = require("../../core/utils/dom");

var templateEngines = {};
var currentTemplateEngine = {
    compile: (element) => domUtils.normalizeTemplateElement(element),
    render: (template, model, index) => template.clone()
};

var registerTemplateEngine = function(name, templateEngine) {
    templateEngines[name] = templateEngine;
};

var setTemplateEngine = function(templateEngine) {
    if(typeUtils.isString(templateEngine)) {
        currentTemplateEngine = templateEngines[templateEngine];
        if(!currentTemplateEngine) {
            throw errors.Error("E0020", templateEngine);
        }
    } else {
        currentTemplateEngine = templateEngine;
    }
};

var getCurrentTemplateEngine = () => {
    return currentTemplateEngine;
};

registerTemplateEngine("jquery-tmpl", {
    compile: function(element) {
        return domUtils.extractTemplateMarkup(element);
    },
    render: function(template, data) {
        /* global jQuery */
        return jQuery.tmpl(template, data);
    }
});

registerTemplateEngine("jsrender", {
    compile: function(element) {
        /* global jQuery */
        /* global jsrender */
        return (jQuery ? jQuery : jsrender).templates(domUtils.extractTemplateMarkup(element));
    },
    render: function(template, data) {
        return template.render(data);
    }
});

registerTemplateEngine("mustache", {
    compile: function(element) {
        /* global Mustache */
        return domUtils.extractTemplateMarkup(element);
    },
    render: function(template, data) {
        return Mustache.render(template, data);
    }
});

registerTemplateEngine("hogan", {
    compile: function(element) {
        /* global Hogan */
        return Hogan.compile(domUtils.extractTemplateMarkup(element));
    },
    render: function(template, data) {
        return template.render(data);
    }
});

registerTemplateEngine("underscore", {
    compile: function(element) {
        /* global _ */
        return _.template(domUtils.extractTemplateMarkup(element));
    },
    render: function(template, data) {
        return template(data);
    }
});

registerTemplateEngine("handlebars", {
    compile: function(element) {
        /* global Handlebars */
        return Handlebars.compile(domUtils.extractTemplateMarkup(element));
    },
    render: function(template, data) {
        return template(data);
    }
});

registerTemplateEngine("doT", {
    compile: function(element) {
        /* global doT */
        return doT.template(domUtils.extractTemplateMarkup(element));
    },
    render: function(template, data) {
        return template(data);
    }
});

module.exports.setTemplateEngine = setTemplateEngine;
module.exports.registerTemplateEngine = registerTemplateEngine;
module.exports.getCurrentTemplateEngine = getCurrentTemplateEngine;
