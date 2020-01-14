const $ = require('../../core/renderer');
const TemplateBase = require('./ui.template_base');

const EmptyTemplate = TemplateBase.inherit({

    _renderCore: function() {
        return $();
    }

});


module.exports = EmptyTemplate;
