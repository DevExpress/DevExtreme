import $ from '../../core/renderer';
import viewPortUtils from '../../core/utils/view_port';
import LoadPanel from '../load_panel';
import { Deferred } from '../../core/utils/deferred';

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

export function show(options) {
    removeLoadPanel();
    loading = createLoadPanel(options);
    return loading.show();
}

export function hide() {
    // todo: hot fix for case without viewport

    if(!loading) {
        return new Deferred().resolve();
    }
    return loading
        .hide()
        .done(removeLoadPanel)
        .promise();
}
