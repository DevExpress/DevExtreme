"use strict";

var $ = require("jquery"),
    errors = require("../../core/errors"),
    commonUtils = require("../../core/utils/common"),
    TemplateBase = require("./ui.template_base"),
    domUtils = require("../../core/utils/dom");

var templateEngines = {};
var registerTemplateEngine = function(name, templateEngine) {
    templateEngines[name] = templateEngine;
};

var outerHtml = function(element) {
    element = $(element);

    var templateTag = element.length && element[0].nodeName.toLowerCase();
    if(templateTag === "script") {
        return element.html();
    } else {
        element = $("<div>").append(element);
        return element.html();
    }
};

registerTemplateEngine("default", {
    compile: function(element) {
        return domUtils.normalizeTemplateElement(element);
    },
    render: function(template) {
        return template.clone();
    }
});

registerTemplateEngine("jquery-tmpl", {
    compile: function(element) {
        return outerHtml(element);
    },
    render: function(template, data) {
        return $.tmpl(template, data);
    }
});

registerTemplateEngine("jsrender", {
    compile: function(element) {
        return $.templates(outerHtml(element));
    },
    render: function(template, data) {
        return template.render(data);
    }
});

registerTemplateEngine("mustache", {
    compile: function(element) {
        /* global Mustache */
        return outerHtml(element);
    },
    render: function(template, data) {
        return Mustache.render(template, data);
    }
});

registerTemplateEngine("hogan", {
    compile: function(element) {
        /* global Hogan */
        return Hogan.compile(outerHtml(element));
    },
    render: function(template, data) {
        return template.render(data);
    }
});

registerTemplateEngine("underscore", {
    compile: function(element) {
        /* global _ */
        return _.template(outerHtml(element));
    },
    render: function(template, data) {
        return template(data);
    }
});

registerTemplateEngine("handlebars", {
    compile: function(element) {
        /* global Handlebars */
        return Handlebars.compile(outerHtml(element));
    },
    render: function(template, data) {
        return template(data);
    }
});

registerTemplateEngine("doT", {
    compile: function(element) {
        /* global doT */
        return doT.template(outerHtml(element));
    },
    render: function(template, data) {
        return template(data);
    }
});


var currentTemplateEngine;
var setTemplateEngine = function(templateEngine) {
    if(commonUtils.isString(templateEngine)) {
        currentTemplateEngine = templateEngines[templateEngine];
        if(!currentTemplateEngine) {
            throw errors.Error("E0020", templateEngine);
        }
    } else {
        currentTemplateEngine = templateEngine;
    }
};

setTemplateEngine("default");


var Template = TemplateBase.inherit({

    ctor: function(element) {
        this._element = element;

        this._compiledTemplate = currentTemplateEngine.compile(element);
    },

    _renderCore: function(options) {
        return $("<div>").append(currentTemplateEngine.render(this._compiledTemplate, options.model)).contents();
    },

    source: function() {
        return $(this._element).clone();
    }

});

module.exports = Template;
module.exports.setTemplateEngine = setTemplateEngine;
