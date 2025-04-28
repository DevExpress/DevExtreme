import $ from 'jquery';

import ConfirmationPopup from '__internal/ui/chat/confirmationpopup';

const DX_BUTTON_CLASSNAME = 'dx-button';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#component');
    },
};

QUnit.module('ConfirmationPopup', moduleConfig, () => {
    QUnit.test('Should execute onApplyButtonClick callback when apply button is clicked', function(assert) {
        assert.expect(1);

        const done = assert.async();
        const confirmationPopup = new ConfirmationPopup(
            this.$element,
            {
                onApplyButtonClick: () => {
                    assert.ok(true, 'onApplyButtonClick callback was executed');
                    done();
                }
            },
            { container: this.$element }
        );
        confirmationPopup.show();

        const $buttons = this.$element.find(`.${DX_BUTTON_CLASSNAME}`);
        $buttons.first().trigger('dxclick');
    });

    QUnit.test('Should execute onCancelButtonClick callback when cancel button is clicked', function(assert) {
        assert.expect(1);

        const done = assert.async();
        const confirmationPopup = new ConfirmationPopup(
            this.$element,
            {
                onCancelButtonClick: () => {
                    assert.ok(true, 'onCancelButtonClick callback was executed');
                    done();
                }
            },
            { container: this.$element }
        );
        confirmationPopup.show();

        const $buttons = this.$element.find(`.${DX_BUTTON_CLASSNAME}`);
        $buttons.last().trigger('dxclick');
    });

    QUnit.test('Should hide popup when buttons clicked without callbacks', function(assert) {
        assert.expect(1);

        const done = assert.async();
        const confirmationPopup = new ConfirmationPopup(
            this.$element,
            {},
            {
                container: this.$element,
                onHidden: () => {
                    assert.ok(true, 'onHidden callback was executed when buttons clicked without callbacks');
                    done();
                }
            }
        );
        confirmationPopup.show();

        const $buttons = this.$element.find(`.${DX_BUTTON_CLASSNAME}`);
        $buttons.first().trigger('dxclick');
    });


});
