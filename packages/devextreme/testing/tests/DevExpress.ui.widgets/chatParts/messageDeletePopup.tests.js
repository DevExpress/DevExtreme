import $ from 'jquery';

import MessageDeletePopup, {
    CHAT_DELETE_CONFIRMATION_POPUP_WRAPPER_CLASS,
    CHAT_DELETE_CONFIRMATION_POPUP_CONTENT_CLASS,
} from '__internal/ui/chat/messagedeletepopup';

const DX_BUTTON_CLASSNAME = 'dx-button';

const POPUP_MESSAGE = 'message';
const BUTTON_YES_LABEL = 'Yes';
const BUTTON_NO_LABEL = 'No';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#component');

        this.messageDeletePopup = new MessageDeletePopup(
            this.$element,
            {
                message: POPUP_MESSAGE,
                applyButtonLabel: BUTTON_YES_LABEL,
                cancelButtonLabel: BUTTON_NO_LABEL,
            },
            { container: this.$element }
        );

        this.messageToDelete = {
            id: 1,
            timestamp: new Date(),
            text: 'text',
        };
    },
};

QUnit.module('MessageDeletePopup', moduleConfig, () => {
    QUnit.test('Should render message delete popup content with correct values', function(assert) {
        assert.expect(4);

        this.messageDeletePopup.show(this.messageToDelete);

        const $wrapper = this.$element.find(`.${CHAT_DELETE_CONFIRMATION_POPUP_WRAPPER_CLASS}`);
        const $popupContent = $wrapper.find(`.${CHAT_DELETE_CONFIRMATION_POPUP_CONTENT_CLASS}`);
        const $message = $popupContent.text();
        const $buttons = $wrapper.find(`.${DX_BUTTON_CLASSNAME}`);
        const buttonsLabels = $buttons.map((_, button) => $(button).text()).get();

        assert.strictEqual($popupContent.length, 1, 'Message delete popup content rendered');
        assert.strictEqual($message, POPUP_MESSAGE, 'Message delete popup content has correct message');
        assert.strictEqual($buttons.length, 2, 'Message delete popup buttons rendered');
        assert.deepEqual(buttonsLabels, [BUTTON_YES_LABEL, BUTTON_NO_LABEL], 'Message delete popup buttons have correct labels');
    });
});
