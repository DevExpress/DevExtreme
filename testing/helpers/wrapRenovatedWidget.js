import { act } from 'preact/test-utils';

export function wrapRenovatedWidget(renovatedWidget) {
    const result = renovatedWidget.inherit({
        ctor: function() {
            let res;
            act(() => {
                res = this.callBase.apply(this, arguments);
            });
            return res;
        },
        option: function() {
            let res;
            act(() => {
                res = this.callBase.apply(this, arguments);
            });
            return res;
        },
        focus: function() {
            let res;
            act(() => {
                res = this.callBase.apply(this, arguments);
            });
            return res;
        },
        repaint: function() {
            let res;
            act(() => {
                res = this.callBase.apply(this, arguments);
            });
            return res;
        },
    }
    );
    result.getInstance = renovatedWidget.getInstance;
    result.IS_RENOVATED_WIDGET = true;
    return result;
}
