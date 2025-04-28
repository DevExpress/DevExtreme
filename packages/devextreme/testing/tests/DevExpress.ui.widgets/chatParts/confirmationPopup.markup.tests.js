import $ from 'jquery';

import ConfirmationPopup, {
    CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS,
} from '__internal/ui/chat/confirmationpopup';

const DX_POPUP_CONTENT_CLASS = 'dx-popup-content';

const DX_BUTTON_CLASSNAME = 'dx-button';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#component');
    },
};

QUnit.module('ConfirmationPopup', moduleConfig, () => {
    QUnit.module('Render', moduleConfig, () => {
        QUnit.test('Should render confirmation popup content and toolbar with correct items', function(assert) {
            assert.expect(2);

            const confirmationPopup = new ConfirmationPopup(this.$element, {}, { container: this.$element });

            confirmationPopup.show();

            const $wrapper = this.$element.find(`.${CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS}`);
            const $popupContent = $wrapper.find(`.${DX_POPUP_CONTENT_CLASS}`);
            const $buttons = $wrapper.find(`.${DX_BUTTON_CLASSNAME}`);

            assert.strictEqual($popupContent.length, 1, 'Confirmation popup content rendered');
            assert.strictEqual($buttons.length, 2, 'Confirmation popup buttons rendered');
        });
    });
});
