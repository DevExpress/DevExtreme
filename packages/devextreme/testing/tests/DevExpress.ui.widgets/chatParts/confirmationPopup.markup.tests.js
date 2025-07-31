import $ from 'jquery';
import localization from 'localization';

import ConfirmationPopup, {
    CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS,
} from '__internal/ui/chat/confirmationpopup';

import { OVERLAY_CONTENT_CLASS } from '__internal/ui/overlay/overlay';
import { POPUP_CONTENT_CLASS } from '__internal/ui/popup/m_popup';
import { BUTTON_CLASS } from '__internal/ui/button/button';

const moduleConfig = {
    beforeEach: function() {
        const init = () => {
            this.$element = $('#component');
            this.instance = new ConfirmationPopup(this.$element, { container: this.$element });
        };

        this.reinit = () => {
            this.instance.dispose();
            this.$element.empty();
            init();
        };

        init();
    },
};

QUnit.module('ConfirmationPopup', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('Should render confirmation popup content and toolbar with correct items', function(assert) {
            assert.expect(2);

            this.instance.show();

            const $wrapper = $(`.${CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS}`);
            const $popupContent = $wrapper.find(`.${POPUP_CONTENT_CLASS}`);
            const $buttons = $wrapper.find(`.${BUTTON_CLASS}`);

            assert.strictEqual($popupContent.length, 1, 'Confirmation popup content rendered');
            assert.strictEqual($buttons.length, 2, 'Confirmation popup buttons rendered');
        });
    });

    QUnit.module('Accessibility', () => {
        QUnit.test('Content should have id attr equal to overlay element "aria-labelledby"', function(assert) {
            assert.expect(1);

            this.instance.show();

            const $wrapper = $(`.${CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS}`);
            const $overlayContent = $wrapper.find(`.${OVERLAY_CONTENT_CLASS}`);
            const $popupContent = $wrapper.find(`.${POPUP_CONTENT_CLASS}`);
            const overlayId = $overlayContent.attr('aria-labelledby');
            const $content = $popupContent.find(`#${overlayId}`);

            assert.strictEqual($content.length, 1, 'content has correct id attr');
        });
    });

    QUnit.module('Localization', () => {
        QUnit.test('Should check that message and button texts are properly localize', function(assert) {
            const defaultLocale = localization.locale();

            const localizedYes = 'Jah';
            const localizedNo = 'Ei';
            const localizedPrompt = 'Kas olete kindel, et soovite selle sõnumi kustutada?';

            try {
                localization.loadMessages({
                    'ee': {
                        'Yes': localizedYes,
                        'No': localizedNo,
                        'dxChat-editingDeleteConfirmText': localizedPrompt,
                    }
                });
                localization.locale('ee');

                this.reinit();

                this.instance.show();

                const $wrapper = $(`.${CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS}`);
                const $popupContent = $wrapper.find(`.${POPUP_CONTENT_CLASS}`);
                const $buttons = $wrapper.find(`.${BUTTON_CLASS}`);

                assert.strictEqual($buttons.eq(0).text(), localizedYes, 'yesButton');
                assert.strictEqual($buttons.eq(1).text(), localizedNo, 'noButton');
                assert.strictEqual($popupContent.text(), localizedPrompt, 'promptMessage');
            } finally {
                localization.locale(defaultLocale);
            }
        });
    });
});
