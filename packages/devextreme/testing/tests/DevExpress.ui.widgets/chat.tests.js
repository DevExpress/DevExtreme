import $ from 'jquery';
import Chat from 'ui/chat';
import fx from 'animation/fx';

import 'generic_light.css!';

// eslint-disable-next-line no-unused-vars
const CHAT_CLASS = 'dx-chat';

QUnit.testStart(() => {
    const markup = '<div id="chat"></div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;

        const init = (options = {}) => {
            this.$element = $('#chat').dxChat(options);
            this.instance = this.$element.dxChat('instance');
        };

        init();
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('Chat initialization', moduleConfig, () => {
    QUnit.test('Chat should be initialized with correct type', function(assert) {
        assert.ok(this.instance instanceof Chat);
    });
});
