"use strict";

var $ = require("../../core/renderer"),
    viewPortUtils = require("../../core/utils/view_port"),
    LoadPanel = require("../load_panel");

var loading = null;

var createLoadPanel = function(options) {
    return new LoadPanel($("<div>")
        .appendTo(options && options.container || viewPortUtils.value()),
        options);
};

var removeLoadPanel = function() {
    if(!loading) {
        return;
    }
    loading.element().remove();
    loading = null;
};

exports.show = function(options) {
    removeLoadPanel();
    loading = createLoadPanel(options);
    return loading.show();
};

exports.hide = function() {
    //todo: hot fix for case without viewport

    if(!loading) {
        return $.Deferred().resolve();
    }
    return loading
        .hide()
        .done(removeLoadPanel)
        .promise();
};
