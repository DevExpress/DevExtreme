var TemplateBase = require('./ui.template_base');

module.exports = TemplateBase.inherit({

    ctor: function(name) {
        this.name = name;
    }

});
