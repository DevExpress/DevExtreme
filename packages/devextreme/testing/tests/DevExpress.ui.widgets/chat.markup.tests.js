import $ from 'jquery';

import 'ui/chat';

QUnit.testStart(function() {
    const markup = '<div id="chat"></div>';

    $('#qunit-fixture').html(markup);
});

const CHAT_CLASS = 'dx-chat';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.$element = $('#chat').dxChat(options);
            this.instance = this.$element.dxChat('instance');
        };

        init();
    }
};

QUnit.module('Chat markup', moduleConfig, () => {
    QUnit.test(`Chat should have ${CHAT_CLASS} class`, function(assert) {
        assert.strictEqual(this.$element.hasClass(CHAT_CLASS), true);
    });
});
