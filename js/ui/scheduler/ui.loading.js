const $ = require('../../core/renderer');
const viewPortUtils = require('../../core/utils/view_port');
const LoadPanel = require('../load_panel');
const Deferred = require('../../core/utils/deferred').Deferred;

let loading = null;

const createLoadPanel = function(options) {
    return new LoadPanel($('<div>')
        .appendTo(options && options.container || viewPortUtils.value()),
    options);
};

const removeLoadPanel = function() {
    if(!loading) {
        return;
    }
    loading.$element().remove();
    loading = null;
};

exports.show = function(options) {
    removeLoadPanel();
    loading = createLoadPanel(options);
    return loading.show();
};

exports.hide = function() {
    // todo: hot fix for case without viewport

    if(!loading) {
        return new Deferred().resolve();
    }
    return loading
        .hide()
        .done(removeLoadPanel)
        .promise();
};
