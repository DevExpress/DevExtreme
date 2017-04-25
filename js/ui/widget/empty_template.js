"use strict";

var $ = require("jquery"),
    TemplateBase = require("./ui.template_base");

var EmptyTemplate = TemplateBase.inherit({

    _renderCore: function() {
        return $();
    }

});


module.exports = EmptyTemplate;
