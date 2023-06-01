// eslint-disable-next-line spellcheck/spell-checker
const reRender = require('inferno').rerender;

exports.wrapRenovatedWidget = function wrapRenovatedWidget(renovatedWidget) {
    class WrappedWidget extends renovatedWidget {
        callMethod(name, ...args) {
            const result = super[name](...args);
            reRender();
            return result;
        }
        constructor(...args) {
            super(...args);
            reRender();
        }
        option(...args) {
            return this.callMethod('option', ...args);
        }
        focus(...args) {
            return this.callMethod('focus', ...args);
        }
        blur(...args) {
            return this.callMethod('blur', ...args);
        }
        repaint(...args) {
            return this.callMethod('repaint', ...args);
        }
    }
    const result = WrappedWidget;
    result.IS_RENOVATED_WIDGET = true;
    return result;
};
