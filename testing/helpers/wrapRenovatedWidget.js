// eslint-disable-next-line spellcheck/spell-checker
import { rerender as reRender } from 'inferno';

function callMethod() {
    const result = this.callBase.apply(this, arguments);
    reRender();
    return result;
}

export function wrapRenovatedWidget(renovatedWidget) {
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
    result.IS_RENOVATED_WIDGET = true;
    return result;
}
