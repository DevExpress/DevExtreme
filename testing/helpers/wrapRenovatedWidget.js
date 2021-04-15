// eslint-disable-next-line spellcheck/spell-checker
const reRender = require('inferno').rerender;

function callMethod() {
    const result = this.callBase.apply(this, arguments);
    reRender();
    return result;
}

exports.wrapRenovatedWidget = function wrapRenovatedWidget(renovatedWidget) {
    const result = renovatedWidget.inherit({
        ctor: function() {
            return callMethod.apply(this, arguments);
        },
        option: function() {
            return callMethod.apply(this, arguments);
        },
        focus: function() {
            return callMethod.apply(this, arguments);
        },
        repaint: function() {
            return callMethod.apply(this, arguments);
        },
    });
    result.getInstance = renovatedWidget.getInstance;
    result.defaultOptions = renovatedWidget.defaultOptions;
    result.IS_RENOVATED_WIDGET = true;
    return result;
};
