import $ from 'jquery';

import ConfirmationPopup from '__internal/ui/chat/confirmationpopup';
import { BUTTON_CLASS } from '__internal/ui/button/button';

const moduleConfig = {
    beforeEach: function() {
        const init = (confirmationPopupConfig = {}, popupConfig = {}) => {
            this.$element = $('#component');
            this.instance = new ConfirmationPopup(
                this.$element,
                confirmationPopupConfig,
                {
                    container: this.$element,
                    ...popupConfig,
                }
            );
        };

        this.reinit = (confirmationPopupConfig, popupConfig) => {
            this.instance.dispose();
            this.$element.empty();
            init(confirmationPopupConfig, popupConfig);
        };

        init();
    },
};

QUnit.module('ConfirmationPopup', moduleConfig, () => {
    QUnit.test('Should execute onApplyButtonClick callback when apply button is clicked', function(assert) {
        assert.expect(1);

        const done = assert.async();

        this.reinit({
            onApplyButtonClick: () => {
                assert.ok(true, 'onApplyButtonClick callback was executed');
                done();
            },
        });
        this.instance.show();

        const $buttons = this.$element.find(`.${BUTTON_CLASS}`);
        $buttons.first().trigger('dxclick');
    }
    );

    QUnit.test('Should execute onCancelButtonClick callback when cancel button is clicked', function(assert) {
        assert.expect(1);

        const done = assert.async();

        this.reinit({
            onCancelButtonClick: () => {
                assert.ok(
                    true,
                    'onCancelButtonClick callback was executed'
                );
                done();
            },
        });
        this.instance.show();

        const $buttons = this.$element.find(`.${BUTTON_CLASS}`);
        $buttons.last().trigger('dxclick');
    }
    );

    QUnit.test('Should hide popup when buttons clicked without callbacks', function(assert) {
        assert.expect(1);

        const done = assert.async();

        this.reinit(
            {},
            {
                onHidden: () => {
                    assert.ok(
                        true,
                        'onHidden callback was executed when buttons clicked without callbacks'
                    );
                    done();
                },
            }
        );
        this.instance.show();

        const $buttons = this.$element.find(`.${BUTTON_CLASS}`);
        $buttons.first().trigger('dxclick');
    }
    );
});
